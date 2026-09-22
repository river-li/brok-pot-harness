# attachments

Attachment storage, image/video renditions, and retained image-generation interfaces.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [attachments-service.ts](attachments-service.ts) | Attachments Service |
| [media-rendition.ts](media-rendition.ts) | Media Rendition |
| [generate-image-service.ts](generate-image-service.ts) | Generate Image Service |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [telemetry](../telemetry/README.md).

Attachment display does not establish image-generation support; generation still needs a local adapter.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
