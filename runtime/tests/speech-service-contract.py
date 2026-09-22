"""HTTP and decoder contracts; the real-model test is transcription-live.cjs."""
import http.client
import io
import json
import sys
import threading
import unittest
import wave
from types import SimpleNamespace

sys.path.insert(0, "/app")
import server as speech


def wav_bytes():
    output = io.BytesIO()
    with wave.open(output, "wb") as recording:
        recording.setnchannels(1)
        recording.setsampwidth(2)
        recording.setframerate(16000)
        recording.writeframes(b"\0\0" * 16000)
    return output.getvalue()


class Model:
    def __init__(self):
        self.started = threading.Event()
        self.release = threading.Event()
        self.block = False
        self.language = None

    def transcribe(self, audio, **options):
        assert len(audio) == 16000
        self.language = options["language"]
        self.started.set()
        if self.block:
            assert self.release.wait(5)
        return iter([SimpleNamespace(text="speech-fixture")]), None


class SpeechContracts(unittest.TestCase):
    def setUp(self):
        self.model = Model()
        self.server = speech.SpeechServer(("127.0.0.1", 0), self.model)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.model.release.set()
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()

    def request(self, body=None, headers=None, route="/transcribe", method="POST"):
        connection = http.client.HTTPConnection("127.0.0.1", self.server.server_port, timeout=6)
        try:
            connection.request(method, route, body, headers or {})
            result = connection.getresponse()
            return result.status, json.loads(result.read())
        finally:
            connection.close()

    def test_decode_and_language(self):
        status, result = self.request(wav_bytes(), {"X-Transcription-Language": "zh"})
        self.assertEqual(status, 200)
        self.assertEqual(result["text"], "speech-fixture")
        self.assertEqual(self.model.language, "zh")
        self.assertGreaterEqual(result["transcriptionTimeMs"], 0)

    def test_invalid_empty_oversized_audio_and_language(self):
        for body, headers, status in [
            (b"", {}, 400), (b"not an audio file", {}, 400),
            (b"x", {"Content-Length": str(speech.MAX_BYTES + 1)}, 413),
            (wav_bytes(), {"X-Transcription-Language": "bad-language"}, 400),
            (b"x", {"Content-Length": "invalid"}, 400),
        ]:
            self.assertEqual(self.request(body, headers)[0], status)
        self.assertFalse(self.model.started.is_set())

    def test_decoded_duration_limit(self):
        previous = speech.MAX_SECONDS
        speech.MAX_SECONDS = 0.1
        try:
            self.assertEqual(self.request(wav_bytes())[0], 400)
            self.assertFalse(self.model.started.is_set())
        finally:
            speech.MAX_SECONDS = previous

    def test_busy_requests_do_not_block_health_or_leak_the_inference_slot(self):
        self.model.block = True
        result = []
        worker = threading.Thread(target=lambda: result.append(self.request(wav_bytes())))
        worker.start()
        self.assertTrue(self.model.started.wait(3))
        self.assertEqual(self.request(wav_bytes())[0], 429)
        self.assertEqual(self.request(route="/health", method="GET")[0], 200)
        self.model.release.set()
        worker.join()
        self.assertEqual(result[0][0], 200)
        self.assertEqual(self.request(wav_bytes())[0], 200)


unittest.main()
