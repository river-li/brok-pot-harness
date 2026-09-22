"""CPU speech output, with all weights and phonemizers available offline.

Retained voice IDs select local presets; they do not reproduce vendor voices.
English and Mandarin are supported here. Other call languages remain pending.
"""
import hashlib
import io
import json
import os
from pathlib import Path
import tempfile
from urllib.request import urlopen
import wave

import numpy as np
import onnxruntime as ort
from kokoro_onnx import Kokoro
from misaki.zh import ZHG2P

MAX_TEXT = 2000
MAX_SECONDS = 120
VOICE_IDS = "altair ara atlas aurora carina castor celeste cosmo eve helios helix iris kepler leo liora lumen luna lux naksh orion perseus rex rigel sal sirius ursa zagan zenith".split()
ENGLISH_VOICES = "af_alloy af_aoede am_adam af_bella af_heart am_echo af_jessica am_eric af_kore am_fenrir am_liam af_nicole am_michael am_onyx af_nova af_river af_sarah af_sky am_puck am_santa bf_alice bm_daniel bf_emma bm_fable bf_isabella bf_lily bm_george bm_lewis".split()
CHINESE_VOICES = "zf_xiaobei zf_xiaoni zf_xiaoxiao zf_xiaoyi zm_yunjian zm_yunxi zm_yunxia zm_yunyang".split()
assert len(VOICE_IDS) == len(ENGLISH_VOICES) == 28


def ensure_tts_model():
    manifest = json.loads(Path(__file__).with_name("tts-model.json").read_text())
    root = Path(os.environ.get("GROKBOT_TTS_MODEL_ROOT", "/tts-models"))
    root.mkdir(parents=True, exist_ok=True)
    for entry in manifest["files"]:
        target = root / entry["name"]
        if target.is_file() and target.stat().st_size == entry["size"]:
            with target.open("rb") as source:
                if hashlib.file_digest(source, "sha256").hexdigest() == entry["sha256"]:
                    continue
        if os.environ.get("GROKBOT_SPEECH_OFFLINE") == "1":
            raise RuntimeError("The pinned local TTS model is missing or invalid.")
        temporary = None
        try:
            with urlopen(entry["url"], timeout=60) as response, tempfile.NamedTemporaryFile(dir=root, delete=False) as output:
                temporary = Path(output.name)
                digest, count = hashlib.sha256(), 0
                while chunk := response.read(1024 * 1024):
                    count += len(chunk)
                    if count > entry["size"]:
                        raise RuntimeError("The TTS model download exceeds its pinned size.")
                    digest.update(chunk)
                    output.write(chunk)
                if count != entry["size"] or digest.hexdigest() != entry["sha256"]:
                    raise RuntimeError("The TTS model download failed checksum verification.")
            os.replace(temporary, target)
        finally:
            if temporary is not None:
                temporary.unlink(missing_ok=True)
    return root


def validate_request(request):
    if not isinstance(request, dict):
        raise ValueError("Expected a speech request object.")
    text = request.get("text")
    if not isinstance(text, str) or not text.strip() or len(text) > MAX_TEXT:
        raise ValueError("Speech text must contain 1 to 2000 characters.")
    voice_id = request.get("voiceId", "altair")
    if voice_id not in VOICE_IDS:
        raise ValueError("Unknown local voice preset.")
    language = request.get("language", "en")
    if language not in ("en", "zh"):
        raise ValueError("Local speech output currently supports English and Mandarin.")
    speed = request.get("speed", 1)
    if isinstance(speed, bool) or not isinstance(speed, (int, float)) or speed not in (0.75, 1, 1.25, 1.5):
        raise ValueError("Unsupported speech speed.")
    return text.strip(), voice_id, language, speed


class Synthesizer:
    def __init__(self, root):
        options = ort.SessionOptions()
        options.intra_op_num_threads = int(os.environ.get("GROKBOT_SPEECH_THREADS", "4"))
        session = ort.InferenceSession(str(root / "kokoro-v1.0.int8.onnx"), sess_options=options, providers=["CPUExecutionProvider"])
        self.kokoro = Kokoro.from_session(session, str(root / "voices-v1.0.bin"))
        self.chinese = ZHG2P()
        # Load the dictionary before readiness; the first preview keeps its
        # original short deadline. No text/audio cache is retained.
        self.chinese("你好")

    def speak(self, text, voice_id, language, speed):
        index = VOICE_IDS.index(voice_id)
        if language == "zh":
            text, _ = self.chinese(text)
            if not text.strip():
                raise ValueError("The text has no speakable characters.")
            voice = CHINESE_VOICES[index % len(CHINESE_VOICES)]
        else:
            voice = ENGLISH_VOICES[index]
        samples, rate = self.kokoro.create(
            text, voice=voice, speed=speed, is_phonemes=language == "zh",
            lang="en-gb" if voice.startswith("b") else "en-us",
        )
        if not len(samples) or len(samples) > MAX_SECONDS * rate or not np.isfinite(samples).all():
            raise ValueError("Speech audio is empty, invalid or exceeds two minutes.")
        output = io.BytesIO()
        with wave.open(output, "wb") as recording:
            recording.setnchannels(1)
            recording.setsampwidth(2)
            recording.setframerate(rate)
            recording.writeframes((np.clip(samples, -1, 1) * 32767).astype("<i2").tobytes())
        return output.getvalue()
