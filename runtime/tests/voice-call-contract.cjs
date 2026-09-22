const { test } = require("node:test");
const assert = require("node:assert/strict");
const { setTimeout: delay } = require("node:timers/promises");
const { LocalVoiceCall } = require("../../dist/local/voice-call.js");
const { toResponsesInput } = require("../../dist/local/responses.js");

const tools = [
  "send_task",
  "recall_text_messages",
  "stay_silent",
  "end_the_call",
].map((name) => ({
  type: "function",
  name,
  description: name,
  parameters: { type: "object", properties: {} },
}));
const configuration = {
  type: "session.update",
  session: {
    instructions: "Retained test voice instructions",
    tools,
    voice: "altair",
    turn_detection: { type: "server_vad", silence_duration_ms: 600 },
    audio: {
      input: { format: { type: "audio/pcm", rate: 24000 }, transcription: {} },
      output: { format: { type: "audio/pcm", rate: 24000 }, speed: 1 },
    },
  },
};
async function waitFor(predicate) {
  for (let i = 0; i < 400; i++) {
    if (predicate()) return;
    await delay(5);
  }
  throw Error("Timed out waiting for voice contract state");
}
function answer(text, calls = []) {
  const content = [...(text ? [{ type: "text", text }] : []), ...calls];
  return {
    fullStream: (async function* () {
      if (text) yield { type: "text-delta", textDelta: text };
    })(),
    response: Promise.resolve({ messages: [{ role: "assistant", content }] }),
  };
}
function setup(t, overrides = {}) {
  const events = [],
    requests = [],
    speech = [],
    closes = [];
  const ports = {
    respond: (messages, tools, signal) => {
      requests.push({ messages: structuredClone(messages), tools, signal });
      return answer("Hello there.");
    },
    transcribe: async (wav) => {
      assert.equal(wav.toString("ascii", 0, 4), "RIFF");
      return "Please help with this task";
    },
    speak: async (text, _settings, signal) => {
      speech.push({ text, signal });
      return Buffer.alloc(2400, 1);
    },
    ...overrides,
  };
  const call = new LocalVoiceCall(
    (e) => events.push(e),
    (reason) => closes.push(reason),
    ports,
  );
  t.after(() => call.close());
  call.receive(structuredClone(configuration));
  return { call, events, requests, speech, closes };
}
function audio(call, loudMs = 200, silenceMs = 600) {
  for (const [ms, loud] of [
    [loudMs, true],
    [silenceMs, false],
  ]) {
    const pcm = Buffer.alloc(ms * 48);
    if (loud) for (let i = 0; i < pcm.length; i += 2) pcm.writeInt16LE(3000, i);
    call.receive({
      type: "input_audio_buffer.append",
      audio: pcm.toString("base64"),
    });
  }
}

test("Retained tools correlate results and seeded work updates across voice turns", async (t) => {
  let count = 0;
  const requests = [];
  const { call, events, closes } = setup(t, {
    respond: (messages) => {
      requests.push(structuredClone(messages));
      if (++count === 1)
        return answer("I will open the file.", [
          {
            type: "tool-call",
            toolCallId: "call-1",
            toolName: "send_task",
            args: { request: "Open the local project file" },
          },
        ]);
      return answer("The file is ready.");
    },
  });
  call.receive({ type: "response.create" });
  await waitFor(() => events.some((e) => e.type === "response.done"));
  assert.ok(
    events.some(
      (e) =>
        e.type === "response.function_call_arguments.done" &&
        e.call_id === "call-1",
    ),
  );
  assert.ok(events.find((e) => e.type === "response.output_audio.delta").delta);
  call.receive({ type: "response.create" });
  await delay(20);
  assert.equal(
    count,
    1,
    "Wait for the tool result before another model request",
  );
  call.receive({
    type: "conversation.item.create",
    item: {
      type: "function_call_output",
      call_id: "call-1",
      output: '{"accepted":true}',
    },
  });
  await waitFor(
    () =>
      count === 2 &&
      events.filter((e) => e.type === "response.done").length === 2,
  );
  assert.ok(
    requests[1].some(
      (m) => m.role === "tool" && m.content[0].toolCallId === "call-1",
    ),
  );
  call.receive({
    type: "conversation.item.create",
    item: {
      type: "function_call",
      call_id: "seeded-nudge-proof",
      name: "work_landed",
      arguments: "{}",
    },
  });
  call.receive({
    type: "conversation.item.create",
    item: {
      type: "function_call_output",
      call_id: "seeded-nudge-proof",
      output: '{"updates":["task finished"]}',
    },
  });
  call.receive({ type: "response.create" });
  await waitFor(() => count === 3);
  assert.ok(
    requests[2].some(
      (m) =>
        m.role === "assistant" &&
        m.content.some?.((p) => p.toolCallId === "seeded-nudge-proof"),
    ),
  );
  assert.ok(
    requests[2].some(
      (m) =>
        m.role === "tool" && m.content[0].toolCallId === "seeded-nudge-proof",
    ),
  );
  assert.deepEqual(closes, []);
});

test("Voice activity cancels in-flight speech, truncates unheard context and responds to transcription", async (t) => {
  let count = 0,
    spoken = 0,
    cancelled = false;
  const requests = [];
  const { call, events, closes } = setup(t, {
    respond: (messages) => {
      requests.push(structuredClone(messages));
      return answer(
        ++count === 1
          ? "First sentence. Unheard second sentence."
          : "I heard your correction.",
      );
    },
    speak: async (_text, _settings, signal) => {
      if (++spoken === 2) {
        try {
          await delay(10000, undefined, { signal });
        } catch {
          cancelled = true;
          throw Error("aborted");
        }
      }
      return Buffer.alloc(4800, 1);
    },
  });
  call.receive({ type: "response.create" });
  await waitFor(
    () =>
      events.some((e) => e.type === "response.output_audio.delta") &&
      spoken === 2,
  );
  const item = events.find(
    (e) => e.type === "response.output_audio.delta",
  ).item_id;
  audio(call, 200, 0);
  call.receive({
    type: "conversation.item.truncate",
    item_id: item,
    content_index: 0,
    audio_end_ms: 0,
  });
  audio(call, 0, 600);
  await waitFor(
    () =>
      events.some(
        (e) =>
          e.type === "conversation.item.input_audio_transcription.completed",
      ) && events.some((e) => e.type === "response.done"),
  );
  assert.ok(cancelled);
  assert.equal(events.filter((e) => e.type === "response.cancelled").length, 1);
  assert.ok(events.some((e) => e.type === "input_audio_buffer.speech_started"));
  assert.ok(events.some((e) => e.type === "input_audio_buffer.speech_stopped"));
  assert.ok(
    events.some(
      (e) => e.type === "conversation.item.truncated" && e.transcript === "…",
    ),
  );
  assert.ok(!JSON.stringify(requests[1]).includes("Unheard second sentence"));
  assert.ok(!JSON.stringify(requests[1]).includes("First sentence"));
  assert.ok(
    requests[1].some(
      (m) => m.role === "user" && m.content === "Please help with this task",
    ),
  );
  assert.deepEqual(closes, []);
});

test("Queued utterances preserve transcription order and muting flushes the final utterance", async (t) => {
  let transcriptions = 0;
  const { call, events, requests } = setup(t, {
    transcribe: async () => {
      const n = ++transcriptions;
      await delay(30);
      return "utterance-" + n;
    },
  });
  audio(call);
  audio(call);
  await waitFor(() => requests.length === 1);
  assert.deepEqual(
    requests[0].messages.filter((m) => m.role === "user").map((m) => m.content),
    ["utterance-1", "utterance-2"],
  );
  audio(call, 200, 0);
  await waitFor(
    () =>
      events.filter(
        (e) =>
          e.type === "conversation.item.input_audio_transcription.completed",
      ).length === 3,
  );
  assert.equal(transcriptions, 3);
});

test("Closing a call aborts recognition and emits no late transcripts or speech", async (t) => {
  let aborted = false;
  const { call, events, requests } = setup(t, {
    transcribe: async (_wav, _language, signal) => {
      try {
        await delay(10000, undefined, { signal });
      } catch {
        aborted = true;
        throw Error("aborted");
      }
      return "late";
    },
  });
  audio(call);
  await delay(10);
  call.close();
  const length = events.length;
  await waitFor(() => aborted);
  assert.equal(events.length, length);
  assert.equal(requests.length, 0);
});

test("Truncating completed audio never replays empty API messages or unheard output", async (t) => {
  let count = 0;
  const inputs = [];
  const { call, events } = setup(t, {
    respond: (messages) => {
      inputs.push(toResponsesInput(messages));
      const result = answer(
        ++count === 1 ? "Completed but unheard." : "I heard you.",
      );
      if (count === 1)
        result.response = Promise.resolve({
          messages: [
            {
              role: "assistant",
              content: [{ type: "text", text: "Completed but unheard." }],
              providerOptions: {
                localResponses: {
                  items: [
                    {
                      type: "reasoning",
                      id: "reasoning-fixture",
                      encrypted_content: "encrypted-fixture",
                    },
                    {
                      type: "message",
                      id: "message-fixture",
                      role: "assistant",
                      content: [
                        { type: "output_text", text: "Completed but unheard." },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        });
      return result;
    },
  });
  call.receive({ type: "response.create" });
  await waitFor(() => events.some((e) => e.type === "response.done"));
  const id = events.find(
    (e) => e.type === "response.output_audio_transcript.done",
  ).item_id;
  call.receive({
    type: "conversation.item.truncate",
    item_id: id,
    content_index: 0,
    audio_end_ms: 0,
  });
  audio(call);
  await waitFor(() => count === 2);
  assert.ok(!JSON.stringify(inputs[1]).includes("Completed but unheard"));
  assert.ok(!JSON.stringify(inputs[1]).includes("encrypted-fixture"));
  assert.ok(
    inputs[1].every(
      (item) => !Array.isArray(item.content) || item.content.length > 0,
    ),
  );
});

test("Malformed and uncorrelated voice inputs fail without invoking tools", async (t) => {
  for (const event of [
    { type: "input_audio_buffer.append", audio: "%%%bad" },
    {
      type: "conversation.item.create",
      item: {
        type: "function_call_output",
        call_id: "unmatched",
        output: "{}",
      },
    },
    {
      type: "conversation.item.create",
      item: {
        type: "function_call",
        call_id: "seeded-nudge-bad",
        name: "Shell",
      },
    },
    { type: "unknown-frame" },
  ]) {
    const { call, closes, requests } = setup(t);
    call.receive(event);
    assert.equal(closes.length, 1);
    assert.equal(requests.length, 0);
  }
  const events = [];
  const call = new LocalVoiceCall(
    (e) => events.push(e),
    () => {},
  );
  t.after(() => call.close());
  const configuration2 = structuredClone(configuration);
  configuration2.session.audio.input.transcription.language_hint = "xx";
  call.receive(configuration2);
  assert.match(events.at(-1).error.message, /supports English and Mandarin/);
});
