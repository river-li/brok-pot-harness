# Project branding

`icon-source.png` is the unchanged artwork supplied by the project maintainer.
`icon-rounded.png` is the selected rounded, transparent-edge edit produced with
the built-in imagegen tool. `npm run build:icons` converts that selected asset
with macOS sips/iconutil into `icon.png` and `AppIcon.icns`; it does not regenerate artwork.

Edit prompt: preserve the character, face, hair, colors, dark background and
composition; change only the silhouette to a large rounded square with about
22% corner radius and a small transparent margin. No added text, objects,
borders, bevels, glow or shadows. See `icon-edit-prompt.txt` for the full prompt.

No rights to other upstream artwork are implied.
