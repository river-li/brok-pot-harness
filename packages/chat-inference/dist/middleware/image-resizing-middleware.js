var __awaiter20 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __await6 = function(v2) {
  return this instanceof __await6 ? (this.v = v2, this) : new __await6(v2);
};
var __asyncValues6 = function(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m2 = o[Symbol.asyncIterator], i;
  return m2 ? m2.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v2) {
      return new Promise(function(resolve29, reject2) {
        v2 = o[n](v2), settle(resolve29, reject2, v2.done, v2.value);
      });
    };
  }
  function settle(resolve29, reject2, d, v2) {
    Promise.resolve(v2).then(function(v3) {
      resolve29({ value: v3, done: d });
    }, reject2);
  }
};
var __asyncDelegator3 = function(o) {
  var i, p2;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n, f2) {
    i[n] = o[n] ? function(v2) {
      return (p2 = !p2) ? { value: __await6(o[n](v2)), done: false } : f2 ? f2(v2) : v2;
    } : f2;
  }
};
var __asyncGenerator6 = function(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g2 = generator.apply(thisArg, _arguments || []), i, q2 = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f2) {
    return function(v2) {
      return Promise.resolve(v2).then(f2, reject2);
    };
  }
  function verb(n, f2) {
    if (g2[n]) {
      i[n] = function(v2) {
        return new Promise(function(a, b2) {
          q2.push([n, v2, a, b2]) > 1 || resume(n, v2);
        });
      };
      if (f2) i[n] = f2(i[n]);
    }
  }
  function resume(n, v2) {
    try {
      step(g2[n](v2));
    } catch (e) {
      settle(q2[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await6 ? Promise.resolve(r.value.v).then(fulfill, reject2) : settle(q2[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject2(value) {
    resume("throw", value);
  }
  function settle(f2, v2) {
    if (f2(v2), q2.shift(), q2.length) resume(q2[0][0], q2[0][1]);
  }
};
var logger3 = createLogger("@anysphere/chat-inference/image-resizing-middleware");
var IMAGE_RESIZE_CONCURRENCY = 4;
function decodeImageDataUrl(value) {
  const parsed2 = new URL(value);
  if (parsed2.protocol !== "data:") {
    throw new Error("Expected an image data URL");
  }
  const separatorIndex = parsed2.pathname.indexOf(",");
  if (separatorIndex === -1) {
    throw new Error("Image data URL is missing its data separator");
  }
  const metadata = parsed2.pathname.slice(0, separatorIndex);
  const [rawMimeType, ...parameters2] = metadata.split(";");
  const mimeType = rawMimeType.toLowerCase();
  if (!mimeType.startsWith("image/") || !parameters2.some((parameter) => parameter.toLowerCase() === "base64")) {
    throw new Error("Image data URL must contain base64-encoded image data");
  }
  const encodedData = parsed2.pathname.slice(separatorIndex + 1);
  const data = Buffer.from(encodedData, "base64");
  if (data.length === 0) {
    throw new Error("Image data URL contains no image data");
  }
  return { data, mimeType };
}
var modelImageResizeOptions = (options2) => Object.assign(Object.assign({}, options2), { convertUnsupportedModelFormatsToPng: true });
var wasImagePartChecked = ({ checkedImageParts, part, payload }) => checkedImageParts.has(part) && checkedImageParts.get(part) === payload;
function resizeImagesInMessage(_a19) {
  return __awaiter20(this, arguments, void 0, function* ({ ctx, message, resizeOptions, checkedImageParts }) {
    var _b2;
    var _c2, _d;
    if (message.role === "user") {
      if (typeof message.content === "string" || !Array.isArray(message.content)) {
        return message;
      }
      let hasUpdates = false;
      const updatedContent = [];
      for (const part of message.content) {
        if (part.type === "image") {
          if (wasImagePartChecked({ checkedImageParts, part, payload: part.image })) {
            updatedContent.push(part);
            continue;
          }
          let imageBuffer;
          let originalMimeType = part.mimeType;
          let originalSize = typeof part.image === "string" ? Buffer.byteLength(part.image) : part.image instanceof Uint8Array ? part.image.length : 0;
          let representation;
          try {
            if (part.image instanceof Uint8Array) {
              imageBuffer = Buffer.from(part.image);
              originalSize = part.image.length;
              representation = "bytes";
            } else if (typeof part.image === "string" && part.image.slice(0, "data:image/".length).toLowerCase() === "data:image/") {
              const decoded = decodeImageDataUrl(part.image);
              imageBuffer = decoded.data;
              originalMimeType = decoded.mimeType;
              originalSize = decoded.data.length;
              representation = "data-url";
            } else {
              updatedContent.push(part);
              continue;
            }
            const resizedImage = yield resizeImageBufferIfNeeded(imageBuffer, modelImageResizeOptions(resizeOptions));
            const wasResized = resizedImage.data.length !== imageBuffer.length || resizedImage.mimeType !== originalMimeType;
            if (wasResized) {
              hasUpdates = true;
              logger3.info(ctx, "Resized image in user message", {
                originalSize,
                newSize: resizedImage.data.length,
                newMimeType: resizedImage.mimeType
              });
              const resizedPart = Object.assign(Object.assign({}, part), { image: representation === "data-url" ? `data:${resizedImage.mimeType};base64,${Buffer.from(resizedImage.data).toString("base64")}` : resizedImage.data, mimeType: resizedImage.mimeType });
              checkedImageParts.set(resizedPart, resizedPart.image);
              updatedContent.push(resizedPart);
            } else {
              checkedImageParts.set(part, part.image);
              updatedContent.push(part);
            }
          } catch (error41) {
            hasUpdates = true;
            logger3.error(ctx, "Failed to resize image, dropping it", error41, {
              originalSize
            });
            updatedContent.push({
              type: "text",
              text: `[image omitted: failed to process ${originalSize} bytes (${(_c2 = part.mimeType) !== null && _c2 !== void 0 ? _c2 : "unknown"})]`
            });
          }
        } else {
          updatedContent.push(part);
        }
      }
      if (hasUpdates) {
        return Object.assign(Object.assign({}, message), { content: updatedContent });
      }
      return message;
    }
    if (message.role === "tool") {
      if (!Array.isArray(message.content)) {
        return message;
      }
      let messageHasUpdates = false;
      const updatedContent = [...message.content];
      for (let partIndex = 0; partIndex < message.content.length; partIndex++) {
        const part = message.content[partIndex];
        if (part.type === "tool-result") {
          const expContent = part.experimental_content;
          if (!Array.isArray(expContent)) {
            continue;
          }
          let expContentHasUpdates = false;
          const updatedExpContent = [...expContent];
          for (let expContentIndex = 0; expContentIndex < expContent.length; expContentIndex++) {
            const expPart = expContent[expContentIndex];
            if (expPart.type === "image") {
              if (wasImagePartChecked({
                checkedImageParts,
                part: expPart,
                payload: expPart.data
              })) {
                continue;
              }
              let imageBuffer;
              if (typeof expPart.data === "string") {
                try {
                  imageBuffer = Buffer.from(expPart.data, "base64");
                } catch (e) {
                  logger3.error(ctx, "Failed to decode base64 image in tool result", e, {
                    partIndex,
                    expContentIndex
                  });
                  continue;
                }
              } else {
                continue;
              }
              try {
                const toolOverride = (_b2 = resizeOptions === null || resizeOptions === void 0 ? void 0 : resizeOptions.toolResultWebpOverrides) === null || _b2 === void 0 ? void 0 : _b2[part.toolName];
                const resizedImage = yield resizeImageBufferIfNeeded(imageBuffer, modelImageResizeOptions(toolOverride === void 0 ? resizeOptions : Object.assign(Object.assign({}, resizeOptions), toolOverride)));
                const wasResized = resizedImage.data.length !== imageBuffer.length || resizedImage.mimeType !== expPart.mimeType;
                if (wasResized) {
                  expContentHasUpdates = true;
                  messageHasUpdates = true;
                  logger3.info(ctx, "Resized image in tool result", {
                    partIndex,
                    expContentIndex,
                    originalSize: imageBuffer.length,
                    newSize: resizedImage.data.length,
                    newMimeType: resizedImage.mimeType
                  });
                  const resizedBase64 = Buffer.from(resizedImage.data).toString("base64");
                  const resizedPart = Object.assign(Object.assign({}, expPart), { data: resizedBase64, mimeType: resizedImage.mimeType });
                  checkedImageParts.set(resizedPart, resizedPart.data);
                  updatedExpContent[expContentIndex] = resizedPart;
                } else {
                  checkedImageParts.set(expPart, expPart.data);
                }
              } catch (error41) {
                expContentHasUpdates = true;
                messageHasUpdates = true;
                logger3.error(ctx, "Failed to resize image in tool result, dropping it", error41, {
                  partIndex,
                  expContentIndex,
                  originalSize: imageBuffer.length
                });
                updatedExpContent[expContentIndex] = {
                  type: "text",
                  text: `[image omitted: failed to process ${imageBuffer.length} bytes (${(_d = expPart.mimeType) !== null && _d !== void 0 ? _d : "unknown"})]`
                };
              }
            }
          }
          if (expContentHasUpdates) {
            updatedContent[partIndex] = Object.assign(Object.assign({}, part), { experimental_content: updatedExpContent });
          }
        }
      }
      if (messageHasUpdates) {
        return Object.assign(Object.assign({}, message), { content: updatedContent });
      }
    }
    return message;
  });
}
function resizeImagesInMessages(_a19) {
  return __awaiter20(this, arguments, void 0, function* ({ ctx, messages: messages2, resizeOptions, checkedImageParts }) {
    return asyncMapValues(messages2, (message) => resizeImagesInMessage({ ctx, message, resizeOptions, checkedImageParts }), { max: IMAGE_RESIZE_CONCURRENCY });
  });
}
var ImageResizingPromptExecutor = class extends BaseMiddleware {
  constructor({ innerExecutor, resizeOptions, checkedImageParts }) {
    super(innerExecutor);
    this.resizeOptions = resizeOptions;
    this.checkedImageParts = checkedImageParts;
  }
  // Wrap the stream method to resize images before streaming
  stream(ctx, invocationId, tools, options2) {
    const messages2 = this.innerExecutor.getMessages();
    const processAndStream = () => __awaiter20(this, void 0, void 0, function* () {
      const processedMessages = yield resizeImagesInMessages({
        ctx,
        messages: messages2,
        resizeOptions: this.resizeOptions,
        checkedImageParts: this.checkedImageParts
      });
      this.innerExecutor.clearMessages();
      this.innerExecutor.appendMessages(processedMessages);
      return this.innerExecutor.stream(ctx, invocationId, tools, options2);
    });
    const processingPromise = processAndStream();
    return {
      fullStream: (function() {
        return __asyncGenerator6(this, arguments, function* () {
          const result = yield __await6(processingPromise);
          yield __await6(yield* __asyncDelegator3(__asyncValues6(result.fullStream)));
        });
      })(),
      response: (() => __awaiter20(this, void 0, void 0, function* () {
        const result = yield processingPromise;
        return yield result.response;
      }))(),
      usage: (() => __awaiter20(this, void 0, void 0, function* () {
        const result = yield processingPromise;
        return yield result.usage;
      }))(),
      providerMetadata: (() => __awaiter20(this, void 0, void 0, function* () {
        const result = yield processingPromise;
        return yield result.providerMetadata;
      }))(),
      extendedUsage: (() => __awaiter20(this, void 0, void 0, function* () {
        const result = yield processingPromise;
        return yield result.extendedUsage;
      }))(),
      invocationId: (() => __awaiter20(this, void 0, void 0, function* () {
        const result = yield processingPromise;
        return yield result.invocationId;
      }))()
    };
  }
};
function createImageResizingMiddleware(resizeOptions) {
  const checkedImageParts = /* @__PURE__ */ new WeakMap();
  return (executor) => {
    return new ImageResizingPromptExecutor({
      innerExecutor: executor,
      resizeOptions,
      checkedImageParts
    });
  };
}
var imageResizingMiddleware = createImageResizingMiddleware();
