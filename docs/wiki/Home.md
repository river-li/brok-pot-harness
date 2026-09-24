# Grokbot Harness documentation

Build your desktop agent workspace, connect a model, and turn a task into files you can use.

## Get started

| Guide | What you will learn |
| --- | --- |
| [Installation and your first task](Build-Guide.md) | Install dependencies, configure a key, launch the app, and find the output |
| [Remote server and desktop client](Remote-Server.md) | Run a persistent Host/Box server and connect an independent desktop through SSH forwarding |
| [Features](Features.md) | Available workflows and their support status |
| [Configuration](Configuration.md) | Where settings live, when they take effect, and which features can be disabled |
| [Troubleshooting](Troubleshooting.md) | Diagnose services, model requests, and desktop connections |

## Customize your workspace

| Guide | What you will learn |
| --- | --- |
| [Sandbox and data](Sandbox.md) | Mount projects, choose an image, add reference folders, and back up data |
| [Permissions](Permissions.md) | Separate mounts, Mac tools, Auto-review, and Keychain |
| [Starter marketplace and Bot recipes](Marketplace.md) | Install the pinned Skill/MCP starters, configure Host-owned credentials, and import a local Bot recipe |
| [MCP, plugins, and Skills](Extensions.md) | Connect tools and manage reusable capabilities |
| [macOS packaging](Packaging.md) | Build an app with your icon and connect it to the Host |

## Develop and maintain

| Guide | What you will learn |
| --- | --- |
| [Architecture](Architecture.md) | How desktop, Host, Agent, sandbox, and model API work together |
| [Package map](../../packages/README.md) | Find packages by responsibility and distinguish execution layers |
| [Host extension map](../../src/host/extensions/README.md) | Registration, dependencies, and service boundaries |
| [Development](Development.md) | Find the right files, rebuild, and choose tests |
| [Maintainer workflow](Agent-Maintainer-Playbook.md) | Take one useful issue through implementation, independent review, and merge |
| [CI](CI.md) | See the required offline checks and what they establish |
| [Source recovery](Source-Recovery.md) | Fragments, bundles, manifests, and strict TypeScript |
| [Verification](Verification.md) | Existing evidence and workflows that need broader coverage |
| [Issue triage](Issue-Triage.md) | Reproducible issue reports, label meanings, and triage rules |
| [Publish docs website and Wiki](Publishing.md) | Build/deploy the GitHub Pages website and optionally export the native Wiki |

New users: start with **Installation → Configuration → Sandbox → Permissions**.
Developers: start with **Architecture → Package map → Development**.
Commands run from the repository root unless a page says otherwise.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)
