# Local-adapter maintenance

This is the standalone strict-TypeScript adapter layer described in the
[local README](README.md). It connects retained Host/Harness ports to the
configured Responses API and local services; it is not recovered bundle source.

## Edit boundaries and failure behavior

- `responses.ts` owns Responses input conversion and SSE/tool-call translation.
  Preserve call IDs and matching tool results, streaming terminal/error
  handling, abort/timeout cancellation, and the `store: false` request policy.
  Do not log upstream error bodies, which can contain credential material.
- `auto-review.ts` adapts the retained review contract. Missing or invalid
  classifications must remain errors so the original Host review gate fails
  closed; do not invent allow-on-error behavior.
- MCP/plugin adapters own persistence, scope checks, manifest/file validation,
  and lifecycle. Web and speech adapters own their request limits and failure
  conversion. Follow the module map in `README.md` and preserve each retained
  port shape.
- Keep the model API key in the inference adapter process only. It must not
  reach the renderer, speech services, tool subprocesses, or diagnostics.
  Gateway credentials and model credentials are separate.
- Local profile adapters coexist with retained original implementations;
  profile policy selects behavior. Never remove the original service path or
  bypass local-tool/Auto-review approvals in an adapter.

## Verify changes

```sh
npm run check:local
npm run build -- --profile local
```

Then run the matching existing contract: `npm run test:responses-contract`,
`npm run test:web-fetch`, `npm run test:web-search`,
`npm run test:transcription`, `npm run test:tts`, `npm run test:voice`,
`npm run test:mcp-store`, `npm run test:mcp-scopes`, or
`npm run test:plugin-files`. These commands use the compiled adapters; rebuild
first after source edits.
Real API and desktop integration checks are separate and listed in the
[test guide](../../../../runtime/tests/README.md). Contract fixtures do not
establish external provider availability.
