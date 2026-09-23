var PREVIEW_RENDITION_MAX_EDGE = 1024;
function fitLongEdge(dimensions, maxEdge) {
  const longEdge = Math.max(dimensions.width, dimensions.height);
  if (longEdge <= maxEdge) return null;
  const ratio = maxEdge / longEdge;
  const even = (value) => Math.max(2, Math.round(value * ratio / 2) * 2);
  return { width: even(dimensions.width), height: even(dimensions.height) };
}
