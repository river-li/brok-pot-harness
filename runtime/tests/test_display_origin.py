"""Offline policy checks; real pinned-websockify coverage is a separate script."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("display_guard", Path(__file__).parents[1] / "box-websockify.py")
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


class DisplayOriginTests(unittest.TestCase):
    def test_same_origin_loopback_and_custom_tunnel_ports(self):
        for host in ["127.0.0.1:6180", "localhost:12345", "[::1]:6181", "127.0.0.2:6180"]:
            self.assertTrue(guard.permitted_origin({"Host": host, "Origin": "http://" + host}))

    def test_cross_origin_missing_opaque_and_rebinding(self):
        for origin in [None, "null", "file://", "https://evil.example", "http://localhost:6181", "http://127.0.0.1:6180/"]:
            self.assertFalse(guard.permitted_origin({"Host": "127.0.0.1:6180", "Origin": origin}))
        for host in ["evil.example:6180", "127.0.0.1.evil.example", "10.0.0.1", "user@127.0.0.1", "127.0.0.1:99999", "127.0.0.1/path"]:
            self.assertFalse(guard.permitted_origin({"Host": host, "Origin": "http://" + host}))


if __name__ == "__main__":
    unittest.main()
