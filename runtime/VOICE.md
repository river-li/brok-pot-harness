# Local voice calls

This page describes the voice bridge implementation. For supported workflows,
see [Features](../docs/wiki/Features.md); full calls still need broader verification
on the current Host. Launch services using the [build guide](../docs/wiki/Build-Guide.md). Open a Bot
and click the headphones button (**Start a voice call**). The original call
controls provide mute, hang up, parking and transcripts. Voice and speaking
speed remain in Bot settings. English and Mandarin output are currently
supported; other retained language choices still need local output adapters.

The runtime keeps its original version, interface, task tools, approvals and
call records. Set `GROKBOT_LOCAL_VOICE=0` in the root `.env` and restart the development desktop
to hide the call entry. Dictation and previews remain available. A nonempty `.env`
value takes precedence over the shell; packaged launches use their startup environment.

## Modules and data flow

1. The desktop main process requests a voice ticket from the existing local
   gateway, using its existing gateway credential. The renderer receives a
   random one-use ticket valid for 60 seconds. It never receives the model API
   key or the gateway token. Local credentials permit only a loopback WebSocket
   endpoint; arbitrary remote hosts cannot receive these tickets.
2. `packages/grok-bot-harness/src/local/voice-server.ts` attaches `/local/voice` to the gateway's HTTP
   server. It rejects unauthorized credential requests, browser-origin minting,
   unexpected socket origins, reused/expired tickets and oversized frames.
   There is no new published port. Closing the host closes its calls.
3. The original renderer captures mono PCM16 at 24 kHz. `voice-call.ts` finds
   voice activity in 20 ms frames, keeps 200 ms of leading audio and commits an
   utterance after the original 600 ms silence period. If capture is muted, its
   remaining utterance is committed after the input stops. An utterance is
   limited to 60 seconds; recognition is queued in order, with at most three
   outstanding recordings. Capture uses the original echo/noise reduction.
4. Committed audio goes to the local Whisper service. Only recognized text,
   conversation context and tool results go to the configured Responses API.
   `ResponsesExecutor` uses the same base URL/model/key as normal Agent turns.
   Spoken replies are synthesized by the local Kokoro service in text segments
   and returned as PCM to the original Web Audio scheduler.
5. The original four voice tools remain `send_task`, `recall_text_messages`,
   `stay_silent` and `end_the_call`. `send_task` wakes the existing main Agent;
   it does not run an alternative executor. Original Auto-review and sandbox
   tools run normally. Task outcomes return over the existing call-nudge path.
   The local host enables its retained final-word delivery without querying a
   vendor feature gate. `end_the_call` waits for queued speech before hanging up.
6. User speech interrupts the current model/synthesis request and drops queued
   audio through the existing renderer logic. Truncation removes unheard
   segments from subsequent model context. Text trimming is conservative at
   completed segment boundaries, not estimated word timing. Fully discarded
   replies are omitted from API replay; matched tool calls/results are kept.
7. The original gateway stores the completed call, transcripts, tool calls,
   nudges and event timestamps in the local Agent directory. The speech service
   does not save audio; pending audio/context in the bridge is released on close.

## Limits and remaining verification

Voice activity currently uses an amplitude threshold. Recognition, synthesis
and model response time add latency, especially on slower CPUs; this is not
an audio-native remote realtime model. Background noise, quiet speech and
physical microphone/speaker echo need hardware testing. Client cancellation
stops waiting immediately, but a native Whisper/Kokoro inference already running
can finish before its CPU slot becomes available. The bridge retries busy slots
for up to 60 seconds and aborts that retry on hangup.

At most two sockets can be open for active/parked calls. Calls are limited to
90 minutes and 1 MiB of model context. The app reports failures and can start a
new call; a stopped host/model service does not silently produce a reply.
The renderer keeps its original mute/park/truncation behavior. Hardware audio,
multiple parked calls and long/noisy conversations remain to be verified.
Additional output languages remain part of the recovery scope.

## Verification

```sh
npm run build
npm run check:local
npm run test:voice
npm run prepare:desktop
npm run test:desktop-voice
npm run test:voice-real-api
```

Generate `.runtime/tests/speech/en.wav` with
`python3 runtime/tests/create-speech-fixtures.py` first. Local services must be
running. The desktop integration uses a separate Box and profile, synthetic
microphone input, real Whisper/Kokoro and a deterministic Responses fixture.
It verifies a real sandbox file write/read through the original Agent and
Auto-review, a spoken task outcome, automatic goodbye/hangup and a persisted
call record. Its temporary container/profile daemon are stopped afterward.
The separate real-API test uses the configured live model and the same audio
fixture over the authenticated voice socket, including a follow-up after
truncating a completed reply. Neither test opens a hardware microphone.

The socket dependency is pinned `ws` 8.21.3 (pure JavaScript); its packaged
resources are copied into the build. The upstream server API is documented in
[ws](https://github.com/websockets/ws/blob/master/doc/ws.md).
