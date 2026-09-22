"""Create local English/Chinese recordings on macOS without opening a microphone."""
import json
import subprocess
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / ".runtime/tests/speech"
CASES = [
    ("en", "Samantha", "This is a local voice transcription test. Please open the project folder."),
    ("zh", "Tingting", "你好，这是一个语音测试。今天天气很好。"),
]

if sys.platform != "darwin":
    raise SystemExit("Fixture generation uses macOS say/afconvert; supply WAV recordings on other platforms.")
OUTPUT.mkdir(parents=True, exist_ok=True)
manifest = []
for language, voice, text in CASES:
    aiff = OUTPUT / f"{language}.aiff"
    wav = OUTPUT / f"{language}.wav"
    subprocess.run(["say", "-v", voice, "-r", "165", "-o", str(aiff), text], check=True)
    subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16@16000", "-c", "1", str(aiff), str(wav)], check=True)
    with wave.open(str(wav), "rb") as source:
        frames = source.readframes(source.getnframes())
    # Give the retained MediaRecorder time to start and stop around the fixture.
    frames = b"\0" * 32000 + frames + b"\0" * 32000
    with wave.open(str(wav), "wb") as destination:
        destination.setnchannels(1)
        destination.setsampwidth(2)
        destination.setframerate(16000)
        destination.writeframes(frames)
    aiff.unlink()
    manifest.append({"language": language, "text": text, "path": str(wav), "durationMs": round(len(frames) / 32)})
(OUTPUT / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
print(f"Created {len(manifest)} local speech fixtures in {OUTPUT}")
