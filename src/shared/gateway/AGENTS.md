# Gateway wire maintenance

Maintain the shared wire constants in `gateway-wire.ts`; Host transport,
argument validation, and method implementations are owned by
`src/host/gateway-server.ts`, `gateway-protocol.ts`, and
`host-gateway-api.ts`. See the [component README](README.md) for the file map.

Keep endpoint paths, headers, nonce shapes, payload fields, and error behavior
consistent with Host and desktop callers. Preserve authenticated Gateway
access, SSE event echo behavior, and Host approval boundaries. Local-specific
routes stay guarded by local profile policy; do not remove original paths or
put credentials into shared constants. This file is a recovered bundle
fragment: preserve its marker, emitted names, and order; add no guessed imports.

Verify with `npm run build -- --profile local` and
`npm run test:runtime-build`. For an API smoke, follow the isolated-data and
coverage limits documented in the
[runtime test guide](../../../runtime/tests/README.md).
