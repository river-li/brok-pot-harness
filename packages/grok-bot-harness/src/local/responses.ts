/** Local harness inference port backed by the user's Responses-compatible API.
 * Protocol: https://developers.openai.com/api/docs/guides/function-calling
 * No Cursor account, token renewal, remote state, or provider-side conversation storage.
 */
import { randomUUID } from 'node:crypto';

type RecordValue = Record<string, any>;
type Message = { role: string; content: string | RecordValue[]; providerOptions?: RecordValue };

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  // Consumers may await these after exhausting the stream.
  void promise.catch(() => {});
  return { promise, resolve, reject };
}

class EventQueue {
  private events: RecordValue[] = [];
  private wake: (() => void) | undefined;
  private closed = false;
  private failure: unknown;
  push(event: RecordValue) { this.events.push(event); this.wake?.(); }
  finish(error?: unknown) { this.failure = error; this.closed = true; this.wake?.(); }
  async *read() {
    while (true) {
      while (this.events.length) yield this.events.shift()!;
      if (this.closed) { if (this.failure) throw this.failure; return; }
      await new Promise<void>(resolve => { this.wake = resolve; });
      this.wake = undefined;
    }
  }
}

function imagePart(part: RecordValue) {
  const image = part.image ?? part.data;
  const url = image instanceof URL ? image.href : typeof image === 'string'
    ? (/^(https?:|data:)/.test(image) ? image : `data:${part.mimeType || 'image/png'};base64,${image}`)
    : `data:${part.mimeType || 'image/png'};base64,${Buffer.from(image).toString('base64')}`;
  return { type: 'input_image', image_url: url, detail: 'auto' };
}

export function toResponsesInput(messages: Message[]): RecordValue[] {
  const input: RecordValue[] = [];
  for (const message of messages) {
    const savedItems = message.providerOptions?.localResponses?.items;
    if (message.role === 'assistant' && Array.isArray(savedItems)) {
      input.push(...savedItems); continue;
    }
    const parts = typeof message.content === 'string' ? [{type: 'text', text: message.content}] : message.content;
    if (message.role === 'tool') {
      for (const part of parts) {
        if (part.type !== 'tool-result') throw new Error(`Unsupported tool result part: ${part.type}`);
        const result = part.experimental_content?.length ? part.experimental_content.map((item: RecordValue) =>
          item.type === 'image' ? imagePart(item) : {type: 'input_text', text: item.text ?? JSON.stringify(item)}) :
          typeof part.result === 'string' ? part.result : JSON.stringify(part.result ?? null);
        input.push({type: 'function_call_output', call_id: part.toolCallId, output: result});
      }
      continue;
    }
    let textParts: RecordValue[] = [];
    const flush = () => {
      if (textParts.length) input.push({role: message.role, content: textParts});
      textParts = [];
    };
    for (const part of parts) {
      if (part.type === 'text') textParts.push({type: message.role === 'assistant' ? 'output_text' : 'input_text', text: part.text});
      else if (part.type === 'image') textParts.push(imagePart(part));
      else if (part.type === 'tool-call') {
        flush();
        input.push({type: 'function_call', call_id: part.toolCallId, name: part.toolName, arguments: JSON.stringify(part.args)});
      } else if (part.type !== 'reasoning' && part.type !== 'redacted-reasoning') {
        throw new Error(`Unsupported inference content: ${part.type}`);
      }
    }
    flush();
  }
  return input;
}

export async function* readSSE(body: ReadableStream<Uint8Array>): AsyncGenerator<RecordValue> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let pending = '';
  try {
    while (true) {
      const chunk = await reader.read();
      pending += decoder.decode(chunk.value, {stream: !chunk.done});
      let boundary: RegExpExecArray | null;
      while ((boundary = /\r?\n\r?\n/.exec(pending))) {
        const block = pending.slice(0, boundary.index);
        pending = pending.slice(boundary.index + boundary[0].length);
        const data = block.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
        if (data === '[DONE]') return;
        if (data) yield JSON.parse(data);
      }
      if (chunk.done) break;
    }
    if (pending.trim()) throw new Error('Responses stream ended inside an SSE event');
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}

export class ResponsesExecutor {
  private messages: Message[];
  constructor(private model: string, initial: Message[] = [], private onRequestId?: (id: string) => void) { this.messages = [...initial]; }
  appendMessages(messages: Message | Message[]) { this.messages.push(...(Array.isArray(messages) ? messages : [messages])); return this; }
  getMessages() { return [...this.messages]; }
  getState() { return this.getMessages(); }
  clearMessages() { this.messages = []; }
  stream(ctx: {signal?: AbortSignal}, invocationId?: string, tools: RecordValue[] = [], options: RecordValue = {}) {
    const queue = new EventQueue();
    const response = deferred<RecordValue>();
    const usage = deferred<RecordValue>();
    const extendedUsage = deferred<RecordValue>();
    const metadata = deferred<RecordValue | undefined>();
    const invocation = invocationId ?? randomUUID();
    const requestMessages = this.getMessages();
    const run = async () => {
      const base = (process.env.GROKBOT_RESPONSES_BASE_URL || 'http://litellm.home/v1').replace(/\/$/, '');
      const apiKey = process.env.LITELLM_API_KEY;
      const controller = new AbortController();
      const signal = ctx.signal ? AbortSignal.any([ctx.signal, controller.signal]) : controller.signal;
      const timer = setTimeout(() => controller.abort(new Error('Responses request timed out')), Number(process.env.GROKBOT_INFERENCE_TIMEOUT_MS || 180000));
      try {
        const unsupported = tools.find(tool => tool.type === 'provider-defined');
        if (unsupported) throw new Error(`Provider-defined tool needs a local adapter: ${unsupported.id ?? unsupported.name}`);
        const request: RecordValue = {model: this.model, input: toResponsesInput(requestMessages), store: false, stream: true,
          tools: tools.map(tool => ({type: 'function', name: tool.name, description: tool.description,
            parameters: tool.parameters?.jsonSchema ?? tool.parameters, strict: false})),
          include: ['reasoning.encrypted_content']};
        if (options.maxTokens) request.max_output_tokens = options.maxTokens;
        if (options.toolChoice?.type === 'tool') request.tool_choice = {type: 'function', name: options.toolChoice.toolName};
        else if (options.toolChoice?.type) request.tool_choice = options.toolChoice.type;
        if (options.parallelToolCalls !== undefined) request.parallel_tool_calls = options.parallelToolCalls;
        if (process.env.GROKBOT_REASONING_EFFORT) request.reasoning = {effort: process.env.GROKBOT_REASONING_EFFORT};
        const http = await fetch(`${base}/responses`, {method: 'POST', signal,
          headers: {'content-type': 'application/json', ...(apiKey ? {Authorization: `Bearer ${apiKey}`} : {})}, body: JSON.stringify(request)});
        if (!http.ok) {
          // Proxy authentication errors can echo credentials and key hashes.
          // Keep provider bodies out of application logs and transcripts.
          const error = await http.json().catch(() => ({})) as RecordValue;
          const code = error.error?.code ?? error.error?.type;
          throw new Error(`Responses API returned HTTP ${http.status}${typeof code === 'string' && /^[\w.-]+$/.test(code) ? ` (${code})` : ''}`);
        }
        if (!http.body) throw new Error('Responses API returned no stream');
        const calls = new Map<string, RecordValue>();
        const emitted = new Set<string>();
        const completedItems = new Map<number, RecordValue>();
        let terminal: RecordValue | undefined;
        const emitCall = (item: RecordValue) => {
          if (emitted.has(item.call_id)) return;
          emitted.add(item.call_id);
          queue.push({type: 'tool-call', toolCallId: item.call_id, toolName: item.name, args: JSON.parse(item.arguments || '{}')});
        };
        for await (const event of readSSE(http.body)) {
          // LiteLLM may send a plain {error: ...} SSE payload without a Responses
          // event type. Treat it as a failure instead of waiting for a completion.
          if (event.error) {
            const code = event.error.code ?? event.error.type;
            throw new Error(`Responses stream failed${typeof code === 'string' && /^[\w.-]+$/.test(code) ? ` (${code})` : ''}`);
          }
          switch (event.type) {
            case 'response.created': this.onRequestId?.(event.response.id); break;
            case 'response.output_text.delta': queue.push({type: 'text-delta', textDelta: event.delta}); break;
            case 'response.reasoning_summary_text.delta': queue.push({type: 'reasoning', textDelta: event.delta}); break;
            case 'response.output_item.added':
              if (event.item.type === 'function_call') {
                calls.set(event.item.id, event.item);
                queue.push({type: 'tool-call-streaming-start', toolCallId: event.item.call_id, toolName: event.item.name});
              }
              break;
            case 'response.function_call_arguments.delta': {
              const call = calls.get(event.item_id);
              if (!call) throw new Error('Received function arguments before function call');
              queue.push({type: 'tool-call-delta', toolCallId: call.call_id, toolName: call.name, argsTextDelta: event.delta});
              break;
            }
            case 'response.output_item.done':
              completedItems.set(event.output_index ?? completedItems.size, event.item);
              if (event.item.type === 'function_call') emitCall(event.item);
              break;
            case 'response.completed': case 'response.incomplete': terminal = event.response; break;
            case 'response.failed': case 'error': throw new Error('Responses stream failed; inspect the configured API server logs.');
          }
          if (terminal) break;
        }
        if (!terminal) throw new Error('Responses stream ended before a terminal response');
        // Some compatible proxies omit output from the terminal event even
        // after streaming complete items. Replay those items on the next turn;
        // otherwise a tool result loses its matching call (and reasoning).
        const output = terminal.output?.length ? terminal.output :
          [...completedItems.entries()].sort(([a], [b]) => a - b).map(([, item]) => item);
        for (const item of output) if (item.type === 'function_call') emitCall(item);
        const content: RecordValue[] = [];
        for (const item of output) {
          if (item.type === 'message') for (const part of item.content ?? []) {
            if (part.type === 'output_text') content.push({type: 'text', text: part.text});
            if (part.type === 'refusal') content.push({type: 'text', text: part.refusal});
          }
          if (item.type === 'function_call') content.push({type: 'tool-call', toolCallId: item.call_id, toolName: item.name, args: JSON.parse(item.arguments || '{}')});
        }
        const raw = terminal.usage ?? {};
        const counts = {promptTokens: raw.input_tokens ?? 0, completionTokens: raw.output_tokens ?? 0, totalTokens: raw.total_tokens ?? 0};
        const result = {id: terminal.id, timestamp: new Date((terminal.created_at ?? Date.now()/1000)*1000), modelId: terminal.model ?? this.model,
          messages: [{role: 'assistant', content, id: terminal.id, providerOptions: {localResponses: {items: output}}}]};
        response.resolve(result); usage.resolve(counts);
        extendedUsage.resolve({inputTokens: counts.promptTokens, outputTokens: counts.completionTokens,
          cacheReadTokens: raw.input_tokens_details?.cached_tokens ?? 0, cacheWriteTokens: 0,
          maxTokens: Number(process.env.GROKBOT_CONTEXT_TOKENS || 128000)});
        metadata.resolve({localResponses: {responseId: terminal.id}});
        queue.push({type: 'finish', finishReason: terminal.status === 'incomplete' ? 'length' : emitted.size ? 'tool-calls' : 'stop', usage: counts, response: result});
        queue.finish();
      } finally { clearTimeout(timer); }
    };
    void run().catch(error => { response.reject(error); usage.reject(error); extendedUsage.reject(error); metadata.reject(error); queue.finish(error); });
    return {fullStream: queue.read(), response: response.promise, usage: usage.promise, extendedUsage: extendedUsage.promise,
      providerMetadata: metadata.promise, invocationId: Promise.resolve(invocation)};
  }
}

export function createLocalInference() {
  const model = process.env.GROKBOT_MODEL || 'gpt-5.6-sol';
  return {
    resolvePrivacyMode: async () => 1, // PrivacyMode.NO_STORAGE in the bundled protocol.
    getGeminiVideoAttachedMediaUrlProvider: () => undefined,
    createSession: (onRequestId?: (id: string) => void) => ({
      getExecutor: (state?: Message[]) => new ResponsesExecutor(model, state, onRequestId),
      getModelId: () => model,
    }),
    recordPostTurnLabeling: () => {},
    recordFollowupLabeling: () => {},
  };
}
