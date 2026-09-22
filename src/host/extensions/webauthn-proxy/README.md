# webauthn-proxy

Proxies browser WebAuthn requests.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [webauthn-proxy-bridge.ts](webauthn-proxy-bridge.ts) | Webauthn Proxy Bridge |
| [webauthn-proxy-marker.ts](webauthn-proxy-marker.ts) | Webauthn Proxy Marker |

## Dependencies and change boundaries

Declared Host dependencies: [telemetry](../telemetry/README.md).

Local mode must not bypass user authorization required by authentication bridging.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
