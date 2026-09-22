# Local search runtime

The retained WebSearch tool calls `packages/grok-bot-harness/src/local/web-search.ts`, which queries this
local SearXNG instance. It returns titles, source URLs and snippets through the
original tool result renderer. Search queries reach the configured public search
engines; model credentials are never attached to search requests.

Pinned image: `docker.io/searxng/searxng@sha256:6869f20676fd91e3f856bcaefc510bc363fdd126f7bd860f49f2ffcb3b305da0`

- Version: `2026.9.19-367fb6537`
- Source revision: `367fb6537c3a9fd6e54f707118a5a9e9d2252703`
- Linux amd64 manifest: `sha256:5b39c7df0647ef73b0ca56d478026015c92bb4150f9f03ed9e1250fba6e1da99`
- Upstream source/license: [SearXNG, AGPL-3.0-or-later](https://github.com/searxng/searxng/tree/367fb6537c3a9fd6e54f707118a5a9e9d2252703)
- Protocol: [Search API](https://docs.searxng.org/dev/search_api.html)
- Runtime: [Official container documentation](https://docs.searxng.org/admin/installation-docker.html)

Configuration is read-only. Cache data is temporary container memory. The
instance has no published host port, no vendor login and no inference key.
`runtime/manage.cjs` generates a separate local instance secret. Edit
`settings.yml` to change search engines, then restart the search service.

Google and Brave returned relevant results in the local verification run. Bing
ignored a `site:` restriction in that run, and DuckDuckGo required a CAPTCHA, so
neither is enabled by default. Provider behavior can change independently of
the app; search failures are reported rather than converted into empty results.
