# Local speech recognition and output

The original desktop recorder and host `transcribeAudio` route use this CPU
service in local mode. Recognition runs in Docker using faster-whisper and the
multilingual Whisper base model. It needs no model API key or vendor account.
Dictation and the original Bot settings voice previews run locally. The local
voice-call bridge also uses these speech endpoints; see `../VOICE.md`.

`npm start` builds the image from the pinned Python base and dependency lock.
The first start downloads the fixed Whisper snapshot listed in `model.json`
into `../../.runtime/models/whisper/` and the two Kokoro files in `tts-model.json`
into `../../.runtime/models/kokoro/`. Kokoro downloads have pinned lengths and
SHA-256 hashes, checked again on startup. Later starts load those files locally;
recognition and output work without internet once the image and models are installed.
The model files, image layers and Python wheels can take time to download on
the first start. The service becomes healthy after the model loads.

The desktop sends audio to the existing authenticated host gateway. The host
sends it to `http://speech:8000/transcribe` on the private Compose network.
There is no published speech port. Audio and transcript are processed in memory
and are not retained or logged by this service. The recognized text becomes a
normal composer draft; sending that draft uses the configured model API.

Requests use raw audio bytes, a fixed Content-Length and optional
`X-Transcription-Language`. The retained gateway normalizes regional language
tags to Whisper language codes. PyAV decodes common recorder formats, including
WebM/Opus, into mono 16 kHz audio. Limits are 25 MiB and 15 decoded minutes;
the caller has the retained 60-second timeout. Long recordings may exceed that
timeout on slower CPUs. One inference runs at a time; concurrent calls get 429.
A caller can stop waiting, but an in-progress native inference finishes before
the service releases its slot.

`GROKBOT_SPEECH_THREADS` defaults to 4. `GROKBOT_TRANSCRIPTION_BASE_URL` changes
the host's service URL. Set `GROKBOT_SPEECH_OFFLINE=1` in the speech container to
forbid model installation and fail if the snapshot is missing. No model API
credential is passed to this service.

## Voice previews and synthesis

In a Bot's settings, open **Voice** and use the play button next to a **Local**
preset. The existing authenticated `previewVoice` gateway route sends a short
greeting to the private `/speak` endpoint. The original player receives mono
24 kHz PCM16 WAV audio. The page's `media-src` policy permits the player's
in-memory `data:` audio; script and network policies are unchanged.

The 28 retained voice IDs remain stable in saved Bot data. They select 28
English Kokoro presets, with the explicit mapping in `tts.py`; they do not
reproduce the unavailable vendor voices. The private service also supports
Mandarin with eight mapped presets and the original four speed values. Its
current language contract is `en` or `zh`; other languages are rejected rather
than silently spoken using the wrong pronunciation. The original language
choices have not been removed, and full call language coverage is pending.

Speech requests are bounded to 2,000 characters / 16 KiB JSON and output to two
minutes. The original preview deadline remains 20 seconds; arbitrary service
calls have a 60-second adapter deadline. One synthesis runs at a time, separately
from recognition. Slow CPUs or long text can exceed these deadlines. Cancellation
stops the caller waiting or playing; native synthesis already running may finish.
Text/audio are not saved or logged. The desktop's existing short-preview cache
lasts for that desktop session. `GROKBOT_TTS_BASE_URL` overrides the host's
private speech service address, defaulting to `http://speech:8000`.

## Verification

From the project root, after `npm run build` and `npm start`:

```sh
npm run test:transcription
python3 runtime/tests/create-speech-fixtures.py
node runtime/tests/transcription-live.cjs
npm run prepare:desktop
node runtime/tests/desktop-transcription-live.cjs
npm run test:tts
npm run test:desktop-tts
```

Fixture creation uses the macOS Samantha and Tingting voices and does not open
a microphone. The desktop test starts an isolated profile with Chromium fake
capture, records the English fixture through the retained UI and checks the
recognized draft without sending it. Only its audio utility sandbox is disabled
so Chromium can read the fixture; normal desktop startup is unchanged. This
tests recording/encoding/IPC, not hardware microphone permissions or quality.
The voice-preview test uses a temporary Bot and desktop profile, observes the
real native media `playing`/`ended`/`pause` events, checks voice selection across
restart, and removes its temporary Bot. It does not replace the audio player.

Service contracts and real offline cold-start recognition:

```sh
docker run --rm --network none --entrypoint python \
  -v "$PWD/runtime/tests:/tests:ro" \
  grokbot-local-speech:reconstructed /tests/speech-service-contract.py
docker run --rm --network none --entrypoint python \
  -v "$PWD/.runtime/models/whisper:/models:ro" \
  -v "$PWD/runtime/tests:/tests:ro" \
  -v "$PWD/.runtime/tests/speech:/fixtures:ro" \
  grokbot-local-speech:reconstructed /tests/speech-offline-live.py
docker run --rm --network none --entrypoint python \
  -v "$PWD/runtime/tests:/tests:ro" \
  grokbot-local-speech:reconstructed /tests/tts-service-contract.py
docker run --rm --network none --entrypoint python \
  -v "$PWD/.runtime/models/whisper:/models:ro" \
  -v "$PWD/.runtime/models/kokoro:/tts-models:ro" \
  -v "$PWD/runtime/tests:/tests:ro" \
  grokbot-local-speech:reconstructed /tests/tts-offline-live.py
```

## Provenance

- [faster-whisper](https://github.com/SYSTRAN/faster-whisper), version 1.2.1;
  complete installed versions are pinned in `requirements.lock`.
- [Whisper base conversion](https://huggingface.co/Systran/faster-whisper-base),
  snapshot `ebe41f70d5b6dfa9166e2c581c45c9c0cfc57b66`. Its model card is copied
  alongside the weights by the installer.
- Python 3.12 slim Bookworm base manifest
  `sha256:d5ae74acb8026b32a2f6deea45003c5bd4e2880700c19c44bda54670ad3eff90`;
  Linux amd64 manifest
  `sha256:1aaa65a85fda306ffb8b910824d4e93bdce61e212c7e87168123ea3073b41a1a`.
- [PyAV audio decoding and resampling](https://pyav.org/docs/stable/api/audio.html).
- [Chromium/WebRTC synthetic media testing](https://webrtc.org/getting-started/testing).
- [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx), version 0.6.1,
  with Kokoro v1.0 int8 weights and Misaki 0.9.4 Chinese phonemization. The model
  card and wrapper license are copied into `licenses/`. The model has the
  Apache-2.0 license; the ONNX wrapper has the MIT license. `jieba` is the only
  locked dependency built from source, into a pure Python wheel.

The retained desktop and host versions are unchanged. This service is an
explicit local replacement for their unavailable vendor speech endpoints.
