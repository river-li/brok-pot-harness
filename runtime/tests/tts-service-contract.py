"""Validate the private HTTP boundary without running a speech model."""
import http.client
import io
import json
import sys
import threading
import unittest
import wave
sys.path.insert(0, "/app")
import server as speech


class Synthesizer:
    def __init__(self):
        self.started = threading.Event()
        self.release = threading.Event()
        self.block = False
        self.fail = False
        self.arguments = None

    def speak(self, *arguments):
        self.arguments = arguments
        self.started.set()
        if self.block:
            assert self.release.wait(5)
        if self.fail:
            raise RuntimeError("private-error-must-not-leak")
        output = io.BytesIO()
        with wave.open(output, "wb") as recording:
            recording.setnchannels(1)
            recording.setsampwidth(2)
            recording.setframerate(24000)
            recording.writeframes(b"\0\0" * 2400)
        return output.getvalue()


class TTSContracts(unittest.TestCase):
    def setUp(self):
        self.synthesizer = Synthesizer()
        self.server = speech.SpeechServer(("127.0.0.1", 0), None, self.synthesizer)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.synthesizer.release.set()
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()

    def request(self, value=None, body=None, headers=None, route="/speak", method="POST"):
        if value is not None:
            body = json.dumps(value).encode()
        connection = http.client.HTTPConnection("127.0.0.1", self.server.server_port, timeout=6)
        try:
            connection.request(method, route, body, {"Content-Type": "application/json", **(headers or {})})
            response = connection.getresponse()
            return response.status, response.getheader("Content-Type"), response.read()
        finally:
            connection.close()

    def test_pcm_response_and_parameters(self):
        status, mime, body = self.request({"text": "你好", "voiceId": "zenith", "language": "zh", "speed": 0.75})
        self.assertEqual((status, mime), (200, "audio/wav"))
        self.assertEqual(self.synthesizer.arguments, ("你好", "zenith", "zh", 0.75))
        with wave.open(io.BytesIO(body)) as audio:
            self.assertEqual((audio.getnchannels(), audio.getsampwidth(), audio.getframerate(), audio.getnframes()), (1, 2, 24000, 2400))

    def test_invalid_request_rejected_before_inference(self):
        for value in [None, [], True, {"text": ""}, {"text": "x" * 2001},
                      {"text": "hi", "language": "xx"}, {"text": "hi", "voiceId": "../bad"},
                      {"text": "hi", "voiceId": []}, {"text": "hi", "speed": True},
                      {"text": "hi", "speed": 0.1}]:
            self.assertEqual(self.request(body=json.dumps(value).encode())[0], 400)
        self.assertEqual(self.request(body=b"invalid-json")[0], 400)
        self.assertEqual(self.request(body=b"x", headers={"Content-Length": str(16385)})[0], 413)
        self.assertEqual(self.request(body=b"x", headers={"Content-Length": "bad"})[0], 400)
        self.assertEqual(self.request({"text": "hi"}, headers={"Content-Type": "text/plain"})[0], 400)
        self.assertFalse(self.synthesizer.started.is_set())

    def test_busy_health_failure_recovery(self):
        self.synthesizer.block = True
        results = []
        worker = threading.Thread(target=lambda: results.append(self.request({"text": "hello"})))
        worker.start()
        self.assertTrue(self.synthesizer.started.wait(3))
        self.assertEqual(self.request({"text": "hi"})[0], 429)
        self.assertEqual(self.request(route="/health", method="GET")[0], 200)
        self.synthesizer.release.set()
        worker.join()
        self.assertEqual(results[0][0], 200)
        self.synthesizer.fail = True
        status, _, body = self.request({"text": "hi"})
        self.assertEqual(status, 500)
        self.assertNotIn(b"private-error", body)
        self.synthesizer.fail = False
        self.assertEqual(self.request({"text": "hi"})[0], 200)


unittest.main()
