/* Real local STT/TTS and the configured Responses API, over the host voice socket.
 * Uses a generated fixture recording; never opens a microphone or sends tools.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path");
const { execFileSync } = require("node:child_process");
const { setTimeout: delay } = require("node:timers/promises");
const { WebSocket } = require("ws");

(async () => {
  const root = path.resolve(__dirname, "../.."),
    base = "http://127.0.0.1:1540";
  const token = fs
    .readFileSync(path.join(root, ".runtime/gateway-token"), "utf8")
    .trim();
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      ready = (await fetch(base + "/health", {
        signal: AbortSignal.timeout(1000),
      })).ok;
    } catch {}
    if (ready) break;
    await delay(500);
  }
  assert.ok(ready, "The local host must be ready before opening the voice socket");
  const mint = await fetch(base + "/local/voice/credential", {
    method: "POST",
    headers: {
      authorization: "Bearer " + token,
      "content-type": "application/json",
    },
    body: "{}",
  });
  assert.equal(mint.status, 200);
  const credential = await mint.json();
  const pcm = execFileSync(
    "python3",
    [
      "-c",
      `import sys,wave,array\nwith wave.open(sys.argv[1],'rb') as f:\n assert f.getnchannels()==1 and f.getsampwidth()==2\n rate=f.getframerate();source=array.array('h',f.readframes(f.getnframes()))\nout=array.array('h')\nfor i in range(int(len(source)*24000/rate)):\n p=i*rate/24000;j=int(p);v=source[j]+(source[min(j+1,len(source)-1)]-source[j])*(p-j);out.append(round(v))\nsys.stdout.buffer.write(out.tobytes())`,
      path.join(root, ".runtime/tests/speech/en.wav"),
    ],
    { maxBuffer: 4 * 1024 * 1024 },
  );
  const ws = new WebSocket(
    base.replace("http:", "ws:") + "/local/voice?model=grokbot-local-voice",
    ["grokbot-voice." + credential.clientSecret],
  );
  const events = [];
  let failure,
    audioBytes = 0;
  ws.on("message", (data) => {
    const event = JSON.parse(data);
    if (event.type === "error") failure = Error(event.error.message);
    if (event.type === "response.output_audio.delta") {
      audioBytes += Buffer.from(event.delta, "base64").length;
      delete event.delta;
    }
    events.push(event);
  });
  ws.on("error", (error) => {
    failure = error;
  });
  const waitFor = async (predicate, label) => {
    const deadline = Date.now() + 120000;
    while (Date.now() < deadline) {
      if (failure) throw failure;
      if (predicate()) return;
      await delay(100);
    }
    throw Error("Timed out: " + label);
  };
  try {
    await new Promise((r, j) => {
      ws.once("open", r);
      ws.once("error", j);
    });
    const send = (frame) => ws.send(JSON.stringify(frame));
    send({
      type: "session.update",
      session: {
        instructions:
          "This is a local speech integration test. Speak English. When the user mentions a local voice transcription test or asks to open the project folder, reply with exactly Speech link verified. Do not claim to have opened anything. No tools are available.",
        tools: [],
        voice: "carina",
        turn_detection: { type: "server_vad", silence_duration_ms: 600 },
        audio: {
          input: {
            format: { type: "audio/pcm", rate: 24000 },
            transcription: { language_hint: "en" },
          },
          output: { format: { type: "audio/pcm", rate: 24000 }, speed: 1 },
        },
      },
    });
    send({
      type: "response.create",
      response: { instructions: "Say only Ready." },
    });
    await waitFor(
      () => events.some((e) => e.type === "response.done"),
      "real API opening reply",
    );
    assert.ok(audioBytes > 0);
    const opening = events.find(
      (e) => e.type === "response.output_audio_transcript.done",
    );
    assert.ok(opening);
    // A real caller can interrupt audio already queued after model completion.
    // Replaying an empty output_text message would make the next API turn fail.
    send({
      type: "conversation.item.truncate",
      item_id: opening.item_id,
      content_index: 0,
      audio_end_ms: 0,
    });
    for (let offset = 0; offset < pcm.length; offset += 4800)
      send({
        type: "input_audio_buffer.append",
        audio: pcm.subarray(offset, offset + 4800).toString("base64"),
      });
    send({
      type: "input_audio_buffer.append",
      audio: Buffer.alloc(48000).toString("base64"),
    });
    await waitFor(
      () =>
        events.filter((e) => e.type === "response.done").length >= 2,
      "spoken fixture reply",
    );
    assert.ok(
      events.some(
        (e) =>
          e.type === "response.output_audio_transcript.done" &&
          /speech link verified/i.test(e.transcript),
      ),
      "The real model must respond to the transcribed fixture after truncation",
    );
    assert.ok(
      events.some(
        (e) =>
          e.type === "conversation.item.input_audio_transcription.completed" &&
          /local voice transcription test/i.test(e.transcript),
      ),
    );
    assert.ok(audioBytes > 4800);
    console.log(
      "PASS real microphone fixture → local Whisper → configured Responses model → local speech PCM over authenticated WebSocket, including a reply after fully truncating previous audio.",
    );
  } catch (error) {
    // This session contains only the generated fixture and fixed test prompts.
    // Keep credentials, provider reasoning and raw audio out of diagnostics.
    console.error("Voice fixture diagnostics:", JSON.stringify({
      eventTypes: events.map((event) => event.type),
      transcripts: events.filter((event) => typeof event.transcript === "string")
        .map((event) => ({ type: event.type, text: event.transcript })),
      audioBytes,
    }));
    throw error;
  } finally {
    ws.close();
    await new Promise((r) => {
      const timer = setTimeout(() => {
        ws.terminate();
        r();
      }, 2000);
      ws.once("close", () => {
        clearTimeout(timer);
        r();
      });
    });
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
