"""Run in the speech image with --network none and read-only model/fixture mounts."""
import json
import os
import sys
import threading
import urllib.request
from pathlib import Path

sys.path.insert(0, "/app")
os.environ["GROKBOT_SPEECH_OFFLINE"] = "1"
from model import ensure_model
from server import SpeechServer
from faster_whisper import WhisperModel

model = WhisperModel(str(ensure_model()), device="cpu", compute_type="int8", local_files_only=True, cpu_threads=4)
server = SpeechServer(("127.0.0.1", 0), model)
thread = threading.Thread(target=server.serve_forever, daemon=True)
thread.start()
try:
    request = urllib.request.Request(
        f"http://127.0.0.1:{server.server_port}/transcribe",
        data=Path("/fixtures/en.wav").read_bytes(),
        headers={"Content-Type": "audio/wav", "X-Transcription-Language": "en"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        result = json.load(response)
    assert "local voice transcription test" in result["text"].lower()
    print("PASS offline cold model load and real HTTP transcription with read-only model files.")
finally:
    server.shutdown()
    server.server_close()
    thread.join()
