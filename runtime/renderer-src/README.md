# Desktop renderer

Maintained HTML and release UI assets assembled into Electron by `prepare:desktop`.
The retained interface receives profile-dependent local state for account and service presentation.

- [index.html](index.html): page entry, resource loading, CSP.
- [assets](assets): retained scripts and styles; locate components by feature or settings text.
- [local-marketplace.css](local-marketplace.css): scoped layout for local plugin rows; pot cards, search, detail sections and dialogs reuse retained components.
- [Main process](../desktop-src/README.md): IPC, windows, host capabilities. Do not pass the model key to the renderer.

This is not a complete original React/TypeScript source tree. After changes, rebuild and prepare from the root,
then verify actual desktop interactions. Media-playback policy changes must preserve unrelated script and network restrictions.

[Architecture](../../docs/wiki/Architecture.md) · [Packaging](../../docs/wiki/Packaging.md)
