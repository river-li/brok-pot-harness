# inference

Provides model inference, web tools, transcription, and voice previews to the Host.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [inference-service.ts](inference-service.ts) | Inference Service |
| [cursor-web-tools.ts](cursor-web-tools.ts) | Cursor Web Tools |
| [transcribe-service.ts](transcribe-service.ts) | Transcribe Service |
| [voice-preview-service.ts](voice-preview-service.ts) | Voice Preview Service |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [settings](../settings/README.md).

Local implementations delegate to Harness src/local; model keys must not enter renderer or speech services.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
