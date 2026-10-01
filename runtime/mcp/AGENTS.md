# MCP bridge maintenance

This directory contains the standalone Brokpot MCP-to-Gateway adapter.

## Scope

- Keep this layer as a thin adapter over existing authenticated Gateway RPCs.
- Do not add or change Bot orchestration, runner behavior, delegation semantics, approval policy, or Host RPC contracts from this directory.
- Prefer explicit MCP tools over a generic arbitrary Gateway-RPC escape hatch.
- Observation tools may expose existing Host state; mutating tools must map to an existing reviewed Gateway action and preserve its policy/approval behavior.

## Authentication and transport

- stdio mode requires `SAND_HOST_GATEWAY_TOKEN`.
- HTTP defaults to the caller's Brokpot Gateway bearer token. Opt-in OAuth verifies that token at browser consent and issues separate resource-bound MCP tokens; never accept a raw Gateway bearer token or tool-argument credential in OAuth mode.
- `BROKPOT_MCP_SERVER_TOKEN`, when configured, is an additional bridge factor and never substitutes for Gateway authentication. In OAuth mode verify it at consent, not through a custom header ChatGPT cannot provide.
- `oauth-server.cjs` uses the pinned OAuth library for code/PKCE/refresh mechanics. Preserve exact callbacks, S256, resource and scope checks, browser-bound one-use consent, refresh reuse revocation, and sanitized errors. Client discovery may only fetch the explicitly configured ChatGPT metadata URL.
- Memory mode retains seven-day grants. Opt-in durable mode uses `oauth-store.cjs`; follow [the storage design](OAUTH-STORAGE.md). Persist only encrypted grant/hashed-token state, keep the key separate, reject live concurrent owners and fail closed on storage errors. Preserve generation-based refresh replay detection across restart. Multi-tenant accounts, replicas, automatic consent and generic metadata fetching require separate design/review.
- Never log credentials, raw authorization headers, or resolved environments.
- Refuse remote plaintext HTTP Gateway connections by default; use loopback forwarding or HTTPS.

## Long-running work

- Do not keep one MCP call open for the lifetime of Bot work.
- `sendPrompt` acceptance is not task completion.
- Use the existing durable transcript as the update source and opaque cursors for resumable reads.
- Pagination must never advance beyond entries actually consumed by the caller.
- Idempotent retries using the same Gateway client nonce must preserve the original update boundary.
- Surface user-visible non-text cards/attachments safely. Approval and credential policy remains in the existing Brokpot UI unless a separately reviewed Gateway action is explicitly exposed.
- Bounded waits must enforce one shared deadline across all Gateway I/O.

## Verification

Run at minimum:

```sh
npm run test:coordinator-mcp
npm run check:syntax
npm run docs:check
```

When changing shared runtime integration or package scripts, also run the repository's required offline gates before handoff.
