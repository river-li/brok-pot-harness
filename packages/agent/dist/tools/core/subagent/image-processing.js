/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/subagent/image-processing.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var hasImageTags = (text2) => {
  const imgTagRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*\/?>/gi;
  return imgTagRegex.test(text2);
};
var parseImageTags = (text2) => {
  const imgTagRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*\/?>/gi;
  const results = [];
  let match2 = imgTagRegex.exec(text2);
  while (match2 !== null) {
    const src = match2[1];
    if (src !== void 0) {
      results.push({
        filepath: src,
        startIndex: match2.index,
        endIndex: match2.index + match2[0].length
      });
    }
    match2 = imgTagRegex.exec(text2);
  }
  return results;
};
var buildScreenshotPathLookup = (conversationSteps) => {
  const pathMap = /* @__PURE__ */ new Map();
  for (const step of conversationSteps) {
    if (step.message.case !== "toolCall" || step.message.value.tool.case !== "computerUseToolCall") {
      continue;
    }
    const computerUseResult = step.message.value.tool.value.result;
    if (computerUseResult === void 0) {
      continue;
    }
    const resultValue = computerUseResult.result.value;
    if (resultValue === void 0) {
      continue;
    }
    const { screenshotPath, screenshot } = resultValue;
    if (screenshotPath !== void 0 && screenshotPath !== "" && screenshot !== void 0 && screenshot !== "") {
      pathMap.set(screenshotPath, {
        base64: screenshot,
        mimeType: DEFAULT_SCREENSHOT_MIME_TYPE
      });
    }
  }
  return pathMap;
};
var buildInterleavedContent = (text2, screenshotMap) => {
  const images = parseImageTags(text2);
  const content = [];
  if (images.length === 0) {
    return [{ type: "text", text: text2 }];
  }
  let lastIndex = 0;
  for (const img of images) {
    const textWithTag = text2.slice(lastIndex, img.endIndex);
    if (textWithTag !== "") {
      content.push({ type: "text", text: textWithTag });
    }
    const imageData = screenshotMap.get(img.filepath);
    if (imageData !== void 0) {
      content.push({
        type: "image",
        data: imageData.base64,
        mimeType: imageData.mimeType
      });
    }
    lastIndex = img.endIndex;
  }
  const remainingText = text2.slice(lastIndex);
  if (remainingText !== "") {
    content.push({ type: "text", text: remainingText });
  }
  return content;
};
var tryHydrateReferencedImages = (text2, conversationSteps) => {
  if (!hasImageTags(text2)) {
    return void 0;
  }
  const screenshotLookup = buildScreenshotPathLookup(conversationSteps);
  if (screenshotLookup.size === 0) {
    return void 0;
  }
  const content = buildInterleavedContent(text2, screenshotLookup);
  return { content, isError: false };
};

