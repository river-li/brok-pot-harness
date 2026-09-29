#!/usr/bin/env python3
"""Narrow authenticated relay; never expose LiteLLM management or provider keys."""
import hmac
import http.server
import json
import ipaddress
from urllib.parse import urlsplit
import os
import threading
import urllib.error
import urllib.request
from pathlib import Path

MAX_BYTES = 8 * 1024 * 1024
CAPACITY = threading.BoundedSemaphore(4)


class Server(http.server.ThreadingHTTPServer):
    daemon_threads = True
    request_queue_size = 16

    def __init__(self, *args, **kwargs):
        self.connections = threading.BoundedSemaphore(16)
        super().__init__(*args, **kwargs)

    def process_request(self, request, client_address):
        if not self.connections.acquire(blocking=False):
            self.shutdown_request(request)
            return
        try:
            super().process_request(request, client_address)
        except Exception:
            self.connections.release()
            raise

    def process_request_thread(self, request, client_address):
        try:
            super().process_request_thread(request, client_address)
        finally:
            self.connections.release()


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


UPSTREAM = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect())


def validated_payload(payload, model):
    allowed = {'model', 'input', 'store', 'stream', 'tools', 'include',
               'max_output_tokens', 'tool_choice', 'parallel_tool_calls', 'reasoning'}
    if not isinstance(payload, dict) or set(payload) - allowed or payload.get('model') not in (model if isinstance(model, list) else [model]):
        raise ValueError('unsupported request')
    payload['store'] = False
    tools = payload.get('tools', [])
    if not isinstance(tools, list) or len(tools) > 256:
        raise ValueError('unsupported tools')
    for tool in tools:
        if not isinstance(tool, dict) or tool.get('type') != 'function' or set(tool) - {'type', 'name', 'description', 'parameters', 'strict'}:
            raise ValueError('only function tools are supported')
    reasoning = payload.get('reasoning', {})
    if not isinstance(reasoning, dict) or set(reasoning) - {'effort', 'summary'}:
        raise ValueError('unsupported reasoning')
    choice = payload.get('tool_choice', 'auto')
    if isinstance(choice, dict):
        if choice.get('type') != 'function' or set(choice) - {'type', 'name'}:
            raise ValueError('unsupported tool choice')
    elif choice not in ('auto', 'none', 'required'):
        raise ValueError('unsupported tool choice')
    if payload.get('include', []) not in ([], ['reasoning.encrypted_content']):
        raise ValueError('unsupported include')
    items = payload.get('input')
    if not isinstance(items, (str, list)):
        raise ValueError('unsupported input')
    for item in items if isinstance(items, list) else []:
        if not isinstance(item, dict) or item.get('type', 'message') not in ('message', 'function_call', 'function_call_output', 'reasoning'):
            raise ValueError('unsupported input item')
    def inspect(value):
        if isinstance(value, dict):
            if value.get('type') == 'input_image':
                url = value.get('image_url', '')
                if not isinstance(url, str) or not url.startswith(('data:image/png;base64,', 'data:image/jpeg;base64,', 'data:image/webp;base64,', 'data:image/gif;base64,')):
                    raise ValueError('images must be inline data')
            if value.get('type') in ('input_file', 'input_audio', 'mcp', 'mcp_call', 'mcp_list_tools'):
                raise ValueError('unsupported input attachment or remote tool')
            for child in value.values():
                inspect(child)
        elif isinstance(value, list):
            for child in value:
                inspect(child)
    inspect(items)
    return json.dumps(payload).encode()


class Handler(http.server.BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.0'

    def setup(self):
        super().setup()
        self.connection.settimeout(30)

    def log_message(self, *_args):
        pass

    def reply(self, code):
        self.send_response(code)
        self.send_header('Content-Length', '0')
        self.end_headers()

    def do_GET(self):
        self.forward()

    def do_POST(self):
        self.forward()

    def forward(self):
        settings = self.server.settings
        supplied = self.headers.get('Authorization', '').encode()
        expected = ('Bearer ' + settings['guest_token']).encode()
        if not hmac.compare_digest(supplied, expected):
            self.reply(401)
            return
        if (self.command, self.path) not in {('POST', '/v1/responses'), ('GET', '/v1/models')}:
            self.reply(403)
            return
        if self.headers.get('Transfer-Encoding'):
            self.reply(400)
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
        except ValueError:
            self.reply(400)
            return
        if length < 0 or length > MAX_BYTES:
            self.reply(413)
            return
        if not CAPACITY.acquire(blocking=False):
            self.reply(429)
            return
        try:
            body = self.rfile.read(length) if length else None
            if body is not None and len(body) != length:
                self.reply(400)
                return
            if self.command == 'POST':
                try:
                    payload = json.loads(body or b'')
                    body = validated_payload(payload, settings.get('models', [settings['model']]))
                except (ValueError, AttributeError):
                    self.reply(400)
                    return
            request = urllib.request.Request(settings['upstream_origin'] + self.path, data=body,
                method=self.command, headers={'Authorization': 'Bearer ' + settings['upstream_key'],
                    'Content-Type': 'application/json', 'Accept-Encoding': 'identity'})
            try:
                upstream = UPSTREAM.open(request, timeout=300)
            except urllib.error.HTTPError as error:
                error.close()
                self.reply(error.code)
                return
            except (OSError, urllib.error.URLError):
                self.reply(502)
                return
            with upstream:
                if self.command == 'GET':
                    try:
                        raw = upstream.read(MAX_BYTES + 1)
                        if len(raw) > MAX_BYTES:
                            raise ValueError('catalog too large')
                        catalog = json.loads(raw)
                        if not isinstance(catalog, dict) or not isinstance(catalog.get('data'), list):
                            raise ValueError('invalid catalog')
                    except (ValueError, TypeError):
                        self.reply(502)
                        return
                    permitted = settings.get('models', [settings['model']])
                    data = json.dumps({'object': 'list', 'data': [row for row in catalog.get('data', []) if isinstance(row, dict) and row.get('id') in permitted]}).encode()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Cache-Control', 'no-store')
                    self.send_header('Content-Length', str(len(data)))
                    self.end_headers()
                    self.wfile.write(data)
                    return
                self.send_response(upstream.status)
                self.send_header('Content-Type', upstream.headers.get('Content-Type', 'application/json'))
                self.send_header('Cache-Control', 'no-store')
                self.end_headers()
                while chunk := upstream.read1(65536):
                    self.wfile.write(chunk)
                    self.wfile.flush()
        except (OSError, TimeoutError):
            pass
        finally:
            CAPACITY.release()


if __name__ == '__main__':
    settings = json.loads((Path(os.environ['CREDENTIALS_DIRECTORY']) / 'inference.json').read_text())
    upstream = urlsplit(settings['upstream_origin'])
    if upstream.scheme != 'http' or upstream.hostname != '127.0.0.1' or not upstream.port or upstream.username or upstream.password or upstream.path or upstream.query or upstream.fragment:
        raise SystemExit('Inference upstream must be a fixed loopback HTTP origin')
    listen = ipaddress.IPv4Address(settings['listen_host'])
    if not listen.is_private or listen.is_loopback or listen.is_link_local:
        raise SystemExit('Inference relay must bind the private host veth address')
    server = Server((str(listen), 4010), Handler)
    server.settings = settings
    server.serve_forever()
