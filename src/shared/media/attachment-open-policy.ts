function attachmentExtension(nameOrPath) {
  const segments = nameOrPath.split(/[/\\]/);
  const base = segments[segments.length - 1] ?? "";
  const dot = base.lastIndexOf(".");
  if (dot <= 0 || dot === base.length - 1) return null;
  return base.slice(dot + 1).toLowerCase();
}
