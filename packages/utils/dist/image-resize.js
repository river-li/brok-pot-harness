init_webp_codec();
var __awaiter24 = function(thisArg, _arguments, P2, generator) {
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
var MAX_IMAGE_DIMENSION = 1024;
var MAX_WEBP_IMAGE_DIMENSION = 1280;
var WEBP_PASSTHROUGH_DIMENSIONS = [
  { width: 1280, height: 800 },
  // macOS and Linux sidecars
  { width: 1456, height: 840 }
  // Windows sidecar
];
var MAX_IMAGE_SIZE_BYTES = 1024 * 1024;
var MIN_IMAGE_DIMENSION = 8;
var toUint8Array = (buffer) => {
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};
var getMimeType = (image2) => {
  switch (image2.mime) {
    case "image/png":
      return "image/png";
    case "image/bmp":
      return "image/bmp";
    case "image/tiff":
      return "image/tiff";
    case "image/x-ms-bmp":
      return "image/x-ms-bmp";
    case "image/gif":
      return "image/gif";
    case "image/jpeg":
      return "image/jpeg";
    default:
      return "image/png";
  }
};
function targetFitImageSize(width, height, maxDimension = MAX_IMAGE_DIMENSION) {
  if (width < 1 || height < 1) {
    return { width, height, needsResize: false };
  }
  const long = Math.max(width, height);
  if (long <= maxDimension) {
    return { width, height, needsResize: false };
  }
  const short = Math.min(width, height);
  if (short < MIN_IMAGE_DIMENSION) {
    return { width, height, needsResize: false };
  }
  let scale = maxDimension / long;
  let newWidth = Math.max(1, Math.round(width * scale));
  let newHeight = Math.max(1, Math.round(height * scale));
  if (newWidth < MIN_IMAGE_DIMENSION || newHeight < MIN_IMAGE_DIMENSION) {
    scale = MIN_IMAGE_DIMENSION / short;
    newWidth = Math.max(MIN_IMAGE_DIMENSION, Math.round(width * scale));
    newHeight = Math.max(MIN_IMAGE_DIMENSION, Math.round(height * scale));
  }
  return {
    width: newWidth,
    height: newHeight,
    needsResize: newWidth !== width || newHeight !== height
  };
}
var targetDimensions = (width, height, maxDimension = MAX_IMAGE_DIMENSION) => targetFitImageSize(width, height, maxDimension);
var resizeJimp = (image2, width, height) => {
  image2.resize({ w: width, h: height });
};
var resizeWebp = (imageData, options2) => __awaiter24(void 0, void 0, void 0, function* () {
  const dimensions = readWebpDimensions(imageData);
  if ((options2 === null || options2 === void 0 ? void 0 : options2.preserveWebpDimensions) === true && dimensions !== void 0) {
    return { data: toUint8Array(imageData), mimeType: "image/webp" };
  }
  const isModelCanvas = dimensions !== void 0 && WEBP_PASSTHROUGH_DIMENSIONS.some((canvas) => canvas.width === dimensions.width && canvas.height === dimensions.height);
  const withinDimensionCap = dimensions !== void 0 && (isModelCanvas || !targetDimensions(dimensions.width, dimensions.height, MAX_WEBP_IMAGE_DIMENSION).needsResize);
  if (withinDimensionCap && imageData.length <= MAX_IMAGE_SIZE_BYTES) {
    return { data: toUint8Array(imageData), mimeType: "image/webp" };
  }
  if ((options2 === null || options2 === void 0 ? void 0 : options2.webpWithoutCodec) === "passthrough" && !hasWebpCodec()) {
    return { data: toUint8Array(imageData), mimeType: "image/webp" };
  }
  const decoded = yield decodeWebp(imageData);
  const Jimp = yield getMinimalJimp();
  const image2 = Jimp.fromBitmap({
    data: Buffer.from(decoded.data),
    width: decoded.width,
    height: decoded.height
  });
  let { width, height, needsResize } = isModelCanvas ? {
    width: image2.bitmap.width,
    height: image2.bitmap.height,
    needsResize: false
  } : targetDimensions(image2.bitmap.width, image2.bitmap.height, MAX_WEBP_IMAGE_DIMENSION);
  if (needsResize) {
    resizeJimp(image2, width, height);
  }
  let resultBuffer = yield encodeWebp({
    data: image2.bitmap.data,
    width: image2.bitmap.width,
    height: image2.bitmap.height
  });
  while (resultBuffer.length > MAX_IMAGE_SIZE_BYTES && width > MIN_IMAGE_DIMENSION && height > MIN_IMAGE_DIMENSION) {
    width = Math.max(MIN_IMAGE_DIMENSION, Math.round(width * 0.8));
    height = Math.max(MIN_IMAGE_DIMENSION, Math.round(height * 0.8));
    resizeJimp(image2, width, height);
    resultBuffer = yield encodeWebp({
      data: image2.bitmap.data,
      width: image2.bitmap.width,
      height: image2.bitmap.height
    });
  }
  return { data: toUint8Array(resultBuffer), mimeType: "image/webp" };
});
var registeredRasterResizeCodec;
var resizeWithCodec = (_a19) => __awaiter24(void 0, [_a19], void 0, function* ({ codec, imageData, mimeType }) {
  const dimensions = yield codec.readOrientedDimensions(imageData);
  if (dimensions === void 0) {
    throw new Error(`Could not read ${mimeType} dimensions`);
  }
  let { width, height } = targetDimensions(dimensions.width, dimensions.height);
  let resultBuffer = yield codec.resize({
    data: imageData,
    mimeType,
    width,
    height
  });
  while (resultBuffer.length > MAX_IMAGE_SIZE_BYTES && width > MIN_IMAGE_DIMENSION && height > MIN_IMAGE_DIMENSION) {
    width = Math.max(MIN_IMAGE_DIMENSION, Math.round(width * 0.8));
    height = Math.max(MIN_IMAGE_DIMENSION, Math.round(height * 0.8));
    resultBuffer = yield codec.resize({
      data: imageData,
      mimeType,
      width,
      height
    });
  }
  return { data: toUint8Array(resultBuffer), mimeType };
});
var resizeImageBufferIfNeeded = (imageData, options2) => __awaiter24(void 0, void 0, void 0, function* () {
  if (isWebp(imageData)) {
    return resizeWebp(imageData, options2);
  }
  const header = readRasterDimensions(imageData);
  if (header !== void 0 && imageData.length <= MAX_IMAGE_SIZE_BYTES && !targetDimensions(header.width, header.height).needsResize) {
    return { data: toUint8Array(imageData), mimeType: header.mimeType };
  }
  if (header !== void 0 && registeredRasterResizeCodec !== void 0) {
    return resizeWithCodec({
      codec: registeredRasterResizeCodec,
      imageData,
      mimeType: header.mimeType
    });
  }
  const Jimp = yield getMinimalJimp();
  const image2 = yield Jimp.read(imageData);
  const sourceMimeType = getMimeType(image2);
  const outputMimeType = (options2 === null || options2 === void 0 ? void 0 : options2.convertUnsupportedModelFormatsToPng) === true && sourceMimeType !== "image/png" && sourceMimeType !== "image/jpeg" ? "image/png" : sourceMimeType;
  const { width, height, needsResize } = targetDimensions(image2.width, image2.height);
  if (!needsResize && imageData.length <= MAX_IMAGE_SIZE_BYTES && outputMimeType === sourceMimeType) {
    return {
      data: toUint8Array(imageData),
      mimeType: sourceMimeType
    };
  }
  let newWidth = width;
  let newHeight = height;
  if (needsResize) {
    resizeJimp(image2, newWidth, newHeight);
  }
  let resultBuffer = yield image2.getBuffer(outputMimeType);
  while (resultBuffer.length > MAX_IMAGE_SIZE_BYTES && newWidth > MIN_IMAGE_DIMENSION && newHeight > MIN_IMAGE_DIMENSION) {
    newWidth = Math.max(MIN_IMAGE_DIMENSION, Math.round(newWidth * 0.8));
    newHeight = Math.max(MIN_IMAGE_DIMENSION, Math.round(newHeight * 0.8));
    resizeJimp(image2, newWidth, newHeight);
    resultBuffer = yield image2.getBuffer(outputMimeType);
  }
  return { data: toUint8Array(resultBuffer), mimeType: outputMimeType };
});
