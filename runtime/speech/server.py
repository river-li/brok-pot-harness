"""Private local transcription service for the retained desktop and host.

Only model installation uses the network. Audio is decoded and transcribed in
memory on the CPU, and is neither retained nor written to request logs.
"""
import io
import json
import os
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import av
import numpy as np
from faster_whisper import WhisperModel
from faster_whisper.tokenizer import _LANGUAGE_CODES
from model import ensure_model
from tts import Synthesizer, ensure_tts_model, validate_request

MAX_BYTES = 25 * 1024 * 1024
MAX_SECONDS = 15 * 60
SAMPLE_RATE = 16000


def decode_audio(data):
    """Bound decoded duration too, including streams without duration metadata."""
    chunks = []
    sample_count = 0
    with av.open(io.BytesIO(data)) as container:
        if not container.streams.audio:
            raise ValueError("The recording contains no audio stream.")
        resampler = av.AudioResampler(format="s16", layout="mono", rate=SAMPLE_RATE)

        def append(frames):
            nonlocal sample_count
            for frame in frames:
                sample_count += frame.samples
                if sample_count > MAX_SECONDS * SAMPLE_RATE:
                    raise ValueError("The recording exceeds the 15-minute duration limit.")
                chunks.append(frame.to_ndarray().reshape(-1).astype(np.float32) / 32768.0)

        for frame in container.decode(audio=0):
            frame.pts = None
            append(resampler.resample(frame))
        append(resampler.resample(None))
    if not chunks or sample_count == 0:
        raise ValueError("The recording contains no audio samples.")
    return np.concatenate(chunks)


class SpeechServer(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, address, model, synthesizer=None):
        self.model = model
        self.inference = threading.BoundedSemaphore(1)
        self.synthesizer = synthesizer
        self.synthesis = threading.BoundedSemaphore(1)
        super().__init__(address, Handler)


class Handler(BaseHTTPRequestHandler):
    # Close after each request; an invalid/unread body cannot become the next
    # request, and cancellation never blocks another connection's health check.
    protocol_version = "HTTP/1.0"

    def setup(self):
        super().setup()
        self.connection.settimeout(15)

    def log_message(self, _format, *_args):
        pass

    def reply(self, status, value):
        body = json.dumps(value, ensure_ascii=False).encode("utf-8")
        self.reply_bytes(status, body, "application/json; charset=utf-8")

    def reply_bytes(self, status, body, mime_type):
        try:
            self.send_response(status)
            self.send_header("Content-Type", mime_type)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError, TimeoutError):
            pass  # The caller cancelled; never log audio or transcript data.

    def do_GET(self):
        if self.path != "/health":
            self.reply(404, {"error": "Unknown endpoint."})
            return
        self.reply(200, {"ok": True, "model": "Whisper base", "device": "cpu", "tts": "Kokoro v1.0 int8" if self.server.synthesizer else None})

    def do_POST(self):
        if self.path == "/speak":
            self.speak()
            return
        if self.path != "/transcribe":
            self.reply(404, {"error": "Unknown endpoint."})
            return
        if self.headers.get("Transfer-Encoding"):
            self.reply(400, {"error": "A fixed audio Content-Length is required."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BYTES:
            self.reply(413 if length > MAX_BYTES else 400, {"error": "Audio must be between 1 byte and 25 MiB."})
            return
        language = self.headers.get("X-Transcription-Language") or None
        if language is not None and language not in _LANGUAGE_CODES:
            self.reply(400, {"error": "Unsupported transcription language."})
            return
        if not self.server.inference.acquire(blocking=False):
            self.reply(429, {"error": "Local transcription is busy. Try again shortly."})
            return
        try:
            started = time.monotonic()
            try:
                data = self.rfile.read(length)
                if len(data) != length:
                    raise ValueError("Incomplete audio upload.")
                audio = decode_audio(data)
            except (ValueError, av.error.FFmpegError, TimeoutError):
                self.reply(400, {"error": "Invalid, incomplete or oversized audio recording."})
                return
            try:
                segments, _ = self.server.model.transcribe(
                    audio, language=language, task="transcribe", beam_size=5,
                    vad_filter=True, condition_on_previous_text=False,
                )
                text = "".join(segment.text for segment in segments).strip()
            except Exception:
                self.reply(500, {"error": "Local speech recognition failed."})
                return
            self.reply(200, {"text": text, "transcriptionTimeMs": round((time.monotonic() - started) * 1000)})
        finally:
            self.server.inference.release()

    def speak(self):
        if self.server.synthesizer is None:
            self.reply(503, {"error": "Local speech output is unavailable."})
            return
        if self.headers.get("Transfer-Encoding") or self.headers.get("Content-Type", "").split(";")[0].strip() != "application/json":
            self.reply(400, {"error": "Speech requires JSON with a fixed Content-Length."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > 16 * 1024:
            self.reply(413 if length > 16 * 1024 else 400, {"error": "Invalid speech request size."})
            return
        if not self.server.synthesis.acquire(blocking=False):
            self.reply(429, {"error": "Local speech output is busy. Try again shortly."})
            return
        try:
            try:
                data = self.rfile.read(length)
                if len(data) != length:
                    raise ValueError()
                arguments = validate_request(json.loads(data))
            except (ValueError, TimeoutError, RecursionError):
                self.reply(400, {"error": "Invalid speech text, local voice preset, language or speed."})
                return
            try:
                audio = self.server.synthesizer.speak(*arguments)
            except ValueError:
                self.reply(400, {"error": "The text could not produce valid speech within the duration limit."})
                return
            except Exception:
                self.reply(500, {"error": "Local speech output failed."})
                return
            self.reply_bytes(200, audio, "audio/wav")
        finally:
            self.server.synthesis.release()


def main():
    directory = ensure_model()
    model = WhisperModel(
        str(directory), device="cpu", compute_type="int8", local_files_only=True,
        cpu_threads=int(os.environ.get("GROKBOT_SPEECH_THREADS", "4")), num_workers=1,
    )
    synthesizer = Synthesizer(ensure_tts_model())
    server = SpeechServer(("0.0.0.0", 8000), model, synthesizer)
    print("Local Whisper transcription and Kokoro speech output are ready (CPU/int8).", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
