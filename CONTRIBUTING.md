# Contributing

Contributions to tool adapters, setup, documentation, and tests are welcome.

## Find a starting point

1. Launch a local workspace with the [installation guide](docs/wiki/Build-Guide.md).
2. Read [Architecture](docs/wiki/Architecture.md) and find a module in the [package map](packages/README.md).
3. Read the root and scoped AGENTS.md files for recovery and maintenance constraints.
4. Follow [Development](docs/wiki/Development.md) to edit, rebuild, and verify.

Recovered files depend on bundle scope and fragment markers. Local adapters are standalone strict TypeScript.
Preserve package layout and original service paths, selecting local behavior through build configuration.
See [Source recovery](docs/wiki/Source-Recovery.md).

## Make changes easy to review

Explain the concrete problem, resulting behavior, and checks actually performed.
Group runtime logic, documentation, and large assets by purpose. Avoid unrelated reformatting or generated output.
When changing user settings, update the configuration reference and relevant module guide.

```sh
npm run check:local
npm run build -- --profile local
# Run tests relevant to your change; see runtime/tests/README.md.
git diff --check
```

## Documentation and issue reports

English is the default for README, Wiki, and module documentation. Put translations in separate language-suffixed files
such as `README.zh.md`. Use generic domains, model placeholders, and paths instead of personal network settings.
Add new pages to the [documentation navigation](docs/wiki/Home.md), then run `npm run docs:check`.
See [Wiki publishing](docs/wiki/Publishing.md) for hosted documentation.

Use the [bug, feature, and documentation issue forms](.github/ISSUE_TEMPLATE) so reports include the context
maintainers need. Follow the [issue triage and label rules](docs/wiki/Issue-Triage.md). Submit only sanitized diagnostics:
never include keys, tokens, raw environment dumps, private conversation data, credentials, user sessions, `.env`, or runtime data.
Retain upstream licensing/provenance notices.
