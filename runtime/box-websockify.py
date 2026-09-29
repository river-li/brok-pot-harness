#!/usr/bin/env python3
"""Keep the pinned Box proxy, requiring a same-origin loopback WebSocket."""

import ipaddress
import sys
from urllib.parse import urlsplit


def permitted_origin(headers):
    host = headers.get("Host", "")
    origin = headers.get("Origin", "")
    # Compare the serialized origin as well as its parsed hostname. In
    # particular, never trust a DNS name that could rebind to loopback.
    if not host or origin != "http://" + host:
        return False
    try:
        url = urlsplit(origin)
        if url.username or url.password or url.path or url.query or url.fragment:
            return False
        if url.port is not None and not 1 <= url.port <= 65535:
            return False
        return url.hostname == "localhost" or ipaddress.ip_address(url.hostname).is_loopback
    except (ValueError, TypeError):
        return False


class LoopbackOrigin:
    def __init__(self, source=None):
        pass

    def authenticate(self, headers, target_host, target_port):
        if not permitted_origin(headers):
            from websockify.auth_plugins import AuthenticationError
            raise AuthenticationError(response_code=403, response_msg="Untrusted display origin")


if __name__ == "__main__":
    from websockify.websocketproxy import websockify_init
    # Append so an inherited option cannot override this policy. Preserve the
    # upstream token routing used for forked displays.
    sys.argv.extend(["--auth-plugin", "__main__.LoopbackOrigin"])
    websockify_init()
