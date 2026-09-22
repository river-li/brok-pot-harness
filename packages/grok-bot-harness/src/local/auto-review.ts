/** Runs the retained Auto-review policy through the configured model API.
 * Classification failures propagate to the original fail-closed review gate.
 */
import { ResponsesExecutor } from './responses.js';

type JsonRecord = Record<string, any>;
type ClassifierArgs = {
  target?: JsonRecord;
  conversationContext: {role: string; content: string}[];
};
type ClassifierPolicy = {systemPrompt: string; tool: {function: JsonRecord}};

export function createLocalAutoReview(policy: ClassifierPolicy) {
  return {
    async execute(ctx: {signal?: AbortSignal}, args: ClassifierArgs) {
      if (!args.target || !policy.systemPrompt || !policy.tool.function.name) {
        throw new Error('Missing Auto-review policy or target');
      }
      const trustedRoles = new Set(['user', 'user_answer']);
      const input = {
        trusted_user_instructions: args.conversationContext.filter(message => trustedRoles.has(message.role)),
        untrusted_agent_narration_and_prior_actions: args.conversationContext.filter(message => !trustedRoles.has(message.role)),
        proposed_tool_call: args.target,
      };
      const executor = new ResponsesExecutor(process.env.GROKBOT_MODEL || 'gpt-5.6-sol', [
        {role: 'system', content: policy.systemPrompt},
        {role: 'user', content: JSON.stringify(input)},
      ]);
      const tool = policy.tool.function;
      const run = executor.stream(ctx, undefined, [tool], {
        toolChoice: {type: 'tool', toolName: tool.name}, parallelToolCalls: false, maxTokens: 4096,
      });
      const calls: JsonRecord[] = [];
      for await (const event of run.fullStream) if (event.type === 'tool-call') calls.push(event);
      await run.response;
      if (calls.length !== 1 || calls[0].toolName !== tool.name) throw new Error('Auto-review returned no unique classification');
      const result = calls[0].args;
      if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('Invalid Auto-review classification');
      for (const name of tool.parameters.required) {
        if (typeof result[name] !== 'string' || !result[name].trim()) throw new Error('Incomplete Auto-review classification');
      }
      for (const [name, schema] of Object.entries(tool.parameters.properties) as [string, JsonRecord][]) {
        if (result[name] !== undefined && (typeof result[name] !== 'string' || (schema.enum && !schema.enum.includes(result[name])))) {
          throw new Error('Invalid Auto-review classification field');
        }
      }
      if (result.decision === 'BLOCK' && (result.blocked_effect === 'none' || result.outbound_authorization === 'trusted_destination')) {
        throw new Error('Inconsistent Auto-review classification');
      }
      // Match the retained protobuf success shape; its constructor is supplied
      // by the host bridge, so the adapter has no copied/generated dependencies.
      return {
        decision: result.decision === 'ALLOW' ? 1 : 2,
        ...(result.decision === 'BLOCK' ? {blockReason: result.reason,
          ...(result.blocked_effect !== 'trusted_block_instruction' && result.proposed_allow_rule?.trim()
            ? {proposedAllowRule: result.proposed_allow_rule.trim()} : {})} : {}),
      };
    },
  };
}
