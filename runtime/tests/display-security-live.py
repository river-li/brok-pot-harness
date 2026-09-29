"""Run inside the pinned Box with --network none and only runtime mounted read-only.

Uses a dummy RFB endpoint, never a user's desktop or credentials.
"""
import socket
import subprocess
import tempfile
import threading
import time
from pathlib import Path


def free_port():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def handshake(port, origin, host=None, route="/websockify"):
    host = host or f"127.0.0.1:{port}"
    headers = [f"GET {route} HTTP/1.1", f"Host: {host}", "Upgrade: websocket",
               "Connection: Upgrade", "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==", "Sec-WebSocket-Version: 13"]
    if origin is not None:
        headers.append(f"Origin: {origin}")
    with socket.create_connection(("127.0.0.1", port), timeout=3) as sock:
        sock.sendall(("\r\n".join(headers) + "\r\n\r\n").encode())
        return sock.recv(4096).split(b"\r\n", 1)[0]


def exercise(command, target, *, guarded, token_dir=None):
    port = free_port()
    args = command + [f"127.0.0.1:{port}"]
    if token_dir:
        args += ["--token-plugin", "TokenFile", "--token-source", str(token_dir)]
    else:
        args += [f"127.0.0.1:{target}"]
    process = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(100):
            if process.poll() is not None:
                raise AssertionError("proxy exited before readiness")
            try:
                with socket.create_connection(("127.0.0.1", port), timeout=.1):
                    break
            except OSError:
                time.sleep(.05)
        else:
            raise AssertionError("proxy readiness timed out")
        route = "/websockify?token=2" if token_dir else "/websockify"
        valid = f"http://127.0.0.1:{port}"
        assert b" 101 " in handshake(port, valid, route=route)
        for origin in ["https://evil.example", "null", None, f"http://127.0.0.1:{port + 1}"]:
            status = handshake(port, origin, route=route)
            assert (b" 403 " if guarded else b" 101 ") in status, status
        status = handshake(port, f"http://evil.example:{port}", f"evil.example:{port}", route)
        assert (b" 403 " if guarded else b" 101 ") in status, status
    finally:
        process.terminate()
        process.wait(timeout=5)


with socket.socket() as listener, tempfile.TemporaryDirectory(prefix="gbh-display-security-") as private:
    listener.bind(("127.0.0.1", 0))
    listener.listen()
    target = listener.getsockname()[1]

    def serve():
        while True:
            try:
                connection, _ = listener.accept()
                with connection:
                    connection.sendall(b"RFB 003.008\n")
            except OSError:
                return

    threading.Thread(target=serve, daemon=True).start()
    tokens = Path(private)
    (tokens / "2").write_text(f"2: 127.0.0.1:{target}\n")
    for token_dir in [None, tokens]:
        exercise(["websockify"], target, guarded=False, token_dir=token_dir)
        exercise(["python3", "/review/box-websockify.py"], target, guarded=True, token_dir=token_dir)
print("PASS: pinned upstream accepts hostile origins; guarded primary/fork reject them and retain same-origin handshakes")
