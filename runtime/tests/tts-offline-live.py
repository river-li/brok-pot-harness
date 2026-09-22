"""Cold CPU synthesis + Whisper readback with Docker networking disabled."""
import io
import os
import sys
import threading
import time
import urllib.request
import json
import wave
sys.path.insert(0, "/app")
os.environ["GROKBOT_SPEECH_OFFLINE"] = "1"
from server import SpeechServer, decode_audio
from tts import Synthesizer, ensure_tts_model, ENGLISH_VOICES, CHINESE_VOICES
from model import ensure_model
from faster_whisper import WhisperModel

tts = Synthesizer(ensure_tts_model())
assert set(ENGLISH_VOICES + CHINESE_VOICES) <= set(tts.kokoro.get_voices())
whisper = WhisperModel(str(ensure_model()), device="cpu", compute_type="int8", cpu_threads=4, local_files_only=True)
server = SpeechServer(("127.0.0.1", 0), whisper, tts)
thread = threading.Thread(target=server.serve_forever, daemon=True)
thread.start()
try:
    for language, voice, text in [
        ("en", "carina", "This is a local voice transcription test. Please open the project folder."),
        ("en", "zenith", "Hello, I am ready to help you today."),
        ("zh", "altair", "你好，这是一个语音测试。今天天气很好。"),
    ]:
        started = time.monotonic()
        request = urllib.request.Request(f"http://127.0.0.1:{server.server_port}/speak", data=json.dumps({"text":text,"voiceId":voice,"language":language}).encode(), headers={"Content-Type":"application/json"})
        with urllib.request.urlopen(request, timeout=60) as response:
            assert response.headers["Content-Type"] == "audio/wav"
            audio = response.read()
        with wave.open(io.BytesIO(audio)) as recording:
            assert recording.getframerate() == 24000 and recording.getnchannels() == 1
            assert recording.getnframes() > 24000
        import numpy as np
        samples = np.pad(decode_audio(audio), (16000, 16000))
        assert np.max(np.abs(samples)) > 0.01
        segments, _ = whisper.transcribe(samples, language=language, beam_size=5)
        recognized = "".join(segment.text for segment in segments).strip()
        if voice == "carina":
            assert "transcription test" in recognized.lower() and "project folder" in recognized.lower(), recognized
        elif voice == "zenith":
            assert "ready to help" in recognized.lower(), recognized
        else:
            assert any(t in recognized for t in ("语音测试", "語音測試")), recognized
            assert any(t in recognized for t in ("天气很好", "天氣很好")), recognized
        print(json.dumps({"language":language,"voice":voice,"recognized":recognized,"seconds":round(time.monotonic()-started,2)}, ensure_ascii=False), flush=True)
finally:
    server.shutdown()
    server.server_close()
    thread.join()
print("PASS offline cold TTS → HTTP PCM WAV → real Whisper readback (US English, UK English, Mandarin).", flush=True)
