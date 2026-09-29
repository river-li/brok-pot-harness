"""Private local relay fixtures: no LiteLLM service, key or inference is used."""
import http.client
import importlib.util
import io
import json
import socket
import threading
import time
import unittest
import urllib.error
import urllib.request
from pathlib import Path

spec = importlib.util.spec_from_file_location('fc_proxy', Path(__file__).parents[1] / 'firecracker/inference-proxy.py')
proxy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(proxy)


class Response(io.BytesIO):
    status = 200
    headers = {'Content-Type': 'text/event-stream'}


class Upstream:
    def __init__(self):
        self.requests = []

    def open(self, request, timeout):
        self.requests.append(request)
        if request.method == 'GET':
            return Response(json.dumps({'data': [{'id': 'fixture-model'}, {'id': 'private-other-model'}]}).encode())
        return Response(b'data: {"fixture":true}\n\n')


class RelayTests(unittest.TestCase):
    def setUp(self):
        self.original = proxy.UPSTREAM
        self.upstream = proxy.UPSTREAM = Upstream()
        self.server = proxy.Server(('127.0.0.1', 0), proxy.Handler)
        self.server.settings = {'upstream_origin': 'http://127.0.0.1:9999', 'model': 'fixture-model', 'guest_token': 'guest-fixture', 'upstream_key': 'private-upstream-fixture'}
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        proxy.UPSTREAM = self.original

    def request(self, payload, path='/v1/responses', token='guest-fixture'):
        conn = http.client.HTTPConnection(*self.server.server_address, timeout=3)
        try:
            conn.request('POST', path, json.dumps(payload), {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'})
            response = conn.getresponse()
            return response.status, response.read()
        finally:
            conn.close()

    def test_relay_preserves_stream_and_injects_only_dedicated_upstream_key(self):
        status, body = self.request({'model': 'fixture-model', 'input': 'hello', 'stream': True, 'store': True,
            'tools': [{'type': 'function', 'name': 'fixture', 'parameters': {'type': 'object'}}]})
        self.assertEqual(status, 200)
        self.assertIn(b'fixture', body)
        request = self.upstream.requests[0]
        self.assertEqual(request.full_url, self.server.settings['upstream_origin'] + '/v1/responses')
        self.assertEqual(request.get_header('Authorization'), 'Bearer private-upstream-fixture')
        self.assertFalse(json.loads(request.data)['store'])
        self.assertNotIn(b'private-upstream-fixture', body)

    def test_auth_routes_provider_overrides_and_remote_tools_fail_before_upstream(self):
        good = {'model': 'fixture-model', 'input': 'hello'}
        self.assertEqual(self.request(good, token='wrong')[0], 401)
        self.assertEqual(self.request(good, path='/key/generate')[0], 403)
        for fields in [{'model': 'other'}, {'api_base': 'http://127.0.0.1'}, {'metadata': {'routing': 'override'}},
                       {'tools': [{'type': 'mcp', 'server_url': 'http://private/'}]},
                       {'input': [{'role': 'user', 'content': [{'type': 'input_image', 'image_url': 'http://private/'}]}]}]:
            self.assertEqual(self.request({**good, **fields})[0], 400)
        self.assertEqual(len(self.upstream.requests), 0)

    def test_allowlist_accepts_two_models_without_allowing_arbitrary_routing(self):
        self.server.settings['models'] = ['model-a', 'model-b']
        for model in ['model-a', 'model-b']:
            self.assertEqual(self.request({'model': model, 'input': 'hello'})[0], 200)
        self.assertEqual(self.request({'model': 'model-c', 'input': 'hello'})[0], 400)
        self.assertEqual([json.loads(r.data)['model'] for r in self.upstream.requests], ['model-a', 'model-b'])

    def test_catalog_exposes_only_permitted_models(self):
        conn = http.client.HTTPConnection(*self.server.server_address, timeout=3)
        try:
            conn.request('GET', '/v1/models', headers={'Authorization': 'Bearer guest-fixture'})
            response = conn.getresponse()
            self.assertEqual(response.status, 200)
            self.assertEqual(json.loads(response.read())['data'], [{'id': 'fixture-model'}])
        finally:
            conn.close()

    def test_partial_headers_cannot_create_unbounded_threads(self):
        sockets = []
        baseline = threading.active_count()
        try:
            for _ in range(24):
                sock = socket.create_connection(self.server.server_address, timeout=2)
                sockets.append(sock)
                try:
                    sock.sendall(b'GET /v1/models HTTP/1.1\r\nX-Pending: ')
                except (BrokenPipeError, ConnectionResetError):
                    pass
            time.sleep(.1)
            self.assertLessEqual(threading.active_count() - baseline, 16)
        finally:
            for sock in sockets:
                sock.close()

    def test_upstream_redirect_is_not_followed(self):
        redirect = proxy.NoRedirect()
        request = urllib.request.Request(self.server.settings['upstream_origin'] + '/v1/responses', headers={'Authorization': 'Bearer private-upstream-fixture'})
        self.assertIsNone(redirect.redirect_request(request, None, 302, '', {}, 'http://other.example/'))


if __name__ == '__main__':
    unittest.main()
