/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/conversation-image-presence.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function valueContainsImagePart(value, depth) {
  if (depth > 6 || value === null || typeof value !== "object") {
    return false;
  }
  if ("type" in value && value.type === "image") {
    return true;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      if (valueContainsImagePart(item, depth + 1)) {
        return true;
      }
    }
    return false;
  }
  for (const nested of Object.values(value)) {
    if (nested !== null && typeof nested === "object" && valueContainsImagePart(nested, depth + 1)) {
      return true;
    }
  }
  return false;
}
function coreMessageJsonHasImage(message) {
  if (message === null || typeof message !== "object" || !("content" in message) || !Array.isArray(message.content)) {
    return false;
  }
  for (const part of message.content) {
    if (valueContainsImagePart(part, 0)) {
      return true;
    }
  }
  return false;
}
function computeCoreMessageImagePresence(orderedMessages) {
  let suffixNumberOfTurnsWithoutImages = 0;
  for (let i = orderedMessages.length - 1; i >= 0; i--) {
    const message = orderedMessages[i];
    if (coreMessageJsonHasImage(message)) {
      return { containsImage: true, suffixNumberOfTurnsWithoutImages };
    }
    if (message.role === "user") {
      suffixNumberOfTurnsWithoutImages++;
    }
  }
  return { containsImage: false, suffixNumberOfTurnsWithoutImages };
}

