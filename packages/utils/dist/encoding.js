/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/encoding.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function readText(file2, encodingHint) {
  return __awaiter10(this, void 0, void 0, function* () {
    const buf = yield (0, import_promises3.readFile)(file2);
    const format4 = getFormatForBuffer(buf);
    if (format4.isBinaryFile) {
      throw new Error("Binary file cannot be decoded as text");
    }
    const cachedEncoding = _FILE_TO_ENCODING.get(file2);
    let encodingToUse;
    if (encodingHint) {
      encodingToUse = encodingHint;
    } else if (cachedEncoding) {
      encodingToUse = cachedEncoding;
    } else {
      encodingToUse = format4.encoding;
    }
    const { text: text2, encoding } = decodeBufferWithEncoding(buf, encodingToUse);
    const str3 = stripUtf8Bom(text2);
    setFileEncoding(file2, encoding === UTF8_ENCODING && hasUtf8Bom(buf) ? UTF8_BOM_ENCODING : encoding);
    if (format4.lineEnding === LineEnding.CRLF) {
      return str3.replaceAll("\r\n", "\n");
    }
    return str3;
  });
}
function getFormatForBuffer(header) {
  if (header.length === 0) {
    return getDefaultTextFormatForOS();
  }
  const utf16Encoding = detectUTF16Encoding(header);
  if (utf16Encoding) {
    return {
      encoding: utf16Encoding,
      lineEnding: determineLineEndingsForBuffer(header),
      isBinaryFile: false,
      isImageFile: false,
      isVideoFile: false
    };
  }
  const utf32Encoding = detectUTF32Encoding(header);
  if (utf32Encoding) {
    return {
      encoding: utf32Encoding,
      lineEnding: determineLineEndingsForBuffer(header),
      isBinaryFile: false,
      isImageFile: false,
      isVideoFile: false
    };
  }
  const isBinaryFile = !isBufferText(header);
  if (isBinaryFile) {
    return {
      encoding: "binary",
      lineEnding: LineEnding.LF,
      isBinaryFile: true,
      isImageFile: isBufferAnImage(header),
      isVideoFile: false
    };
  }
  if ((0, import_node_buffer.isUtf8)(header) && !header.includes(ESCAPE_BYTE)) {
    return {
      encoding: DETECTED_UTF8_ENCODING,
      lineEnding: determineLineEndingsForBuffer(header),
      isBinaryFile: false,
      isImageFile: false,
      isVideoFile: false
    };
  }
  const detect = import_jschardet.default.detect(header);
  let enc = detect.confidence > 0.7 ? detect.encoding : "utf-8";
  if (enc === "ascii") {
    enc = "utf-8";
  }
  return {
    encoding: enc !== null && enc !== void 0 ? enc : "utf-8",
    lineEnding: determineLineEndingsForBuffer(header),
    isBinaryFile: false,
    isImageFile: false,
    isVideoFile: false
  };
}
function determineLineEndingsForBuffer(buffer) {
  let crlfCount = 0;
  let lfOnlyCount = 0;
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === 10) {
      if (i > 0 && buffer[i - 1] === 13) {
        crlfCount++;
      } else {
        lfOnlyCount++;
      }
    }
  }
  if (crlfCount === 0 && lfOnlyCount === 0) {
    return LineEnding.LF;
  }
  const totalLineEndings = crlfCount + lfOnlyCount;
  const crlfPercentage = crlfCount / totalLineEndings * 100;
  return crlfPercentage >= 5 ? LineEnding.CRLF : LineEnding.LF;
}
function isBufferText(buffer) {
  const len = Math.min(4096, buffer.length);
  if (len === 0) {
    return true;
  }
  for (let i = 0; i < len; i++) {
    if (buffer[i] === 0) {
      return false;
    }
  }
  let nonPrintableCount = 0;
  for (let i = 0; i < len; i++) {
    const byte = buffer[i];
    if (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13) {
      nonPrintableCount++;
    }
  }
  const nonPrintablePercentage = nonPrintableCount / len * 100;
  return nonPrintablePercentage < 5;
}
function isBufferAnImage(buffer) {
  if (buffer.length < 4) {
    return false;
  }
  if (buffer.length >= 8 && buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71 && buffer[4] === 13 && buffer[5] === 10 && buffer[6] === 26 && buffer[7] === 10) {
    return true;
  }
  if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
    return true;
  }
  if (buffer.length >= 12 && buffer[0] === 82 && // R
  buffer[1] === 73 && // I
  buffer[2] === 70 && // F
  buffer[3] === 70 && // F
  buffer[8] === 87 && // W
  buffer[9] === 69 && // E
  buffer[10] === 66 && // B
  buffer[11] === 80) {
    return true;
  }
  if (buffer.length >= 6 && buffer[0] === 71 && // G
  buffer[1] === 73 && // I
  buffer[2] === 70 && // F
  buffer[3] === 56 && // 8
  (buffer[4] === 55 || buffer[4] === 57) && // 7 or 9
  buffer[5] === 97) {
    return true;
  }
  return false;
}
function getDefaultTextFormatForOS() {
  return {
    encoding: UTF8_ENCODING,
    lineEnding: process.platform === "win32" ? LineEnding.CRLF : LineEnding.LF,
    isBinaryFile: false,
    isImageFile: false,
    isVideoFile: false
  };
}
function setFileEncoding(path31, encoding) {
  if (_FILE_TO_ENCODING.has(path31)) {
    _FILE_TO_ENCODING.delete(path31);
  }
  _FILE_TO_ENCODING.set(path31, encoding);
  if (_FILE_TO_ENCODING.size <= MAX_FILE_ENCODINGS) {
    return;
  }
  const oldestKey = _FILE_TO_ENCODING.keys().next().value;
  if (oldestKey !== void 0) {
    _FILE_TO_ENCODING.delete(oldestKey);
  }
}
function decodeWithUtf8Fallback(buffer) {
  try {
    return { text: UTF8_DECODER.decode(buffer), encoding: UTF8_ENCODING };
  } catch (_a19) {
    return { text: LATIN1_DECODER.decode(buffer), encoding: LATIN1_ENCODING };
  }
}
function decodeBufferWithEncoding(buffer, encoding) {
  const normalizedEncoding = normalizeEncodingName(encoding);
  if (normalizedEncoding === UTF8_ENCODING || normalizedEncoding === UTF8_BOM_ENCODING || normalizedEncoding === "ascii") {
    const decoded = decodeWithUtf8Fallback(buffer);
    if (normalizedEncoding === UTF8_BOM_ENCODING && decoded.encoding === UTF8_ENCODING) {
      return { text: decoded.text, encoding: UTF8_BOM_ENCODING };
    }
    return decoded;
  }
  if (normalizedEncoding === LATIN1_ENCODING) {
    return { text: LATIN1_DECODER.decode(buffer), encoding: LATIN1_ENCODING };
  }
  try {
    const iconvEncoding = mapToIconvEncoding(normalizedEncoding);
    if (import_iconv_lite.default.encodingExists(iconvEncoding)) {
      const decoded = import_iconv_lite.default.decode(buffer, iconvEncoding);
      return { text: decoded, encoding: normalizedEncoding };
    }
  } catch (_a19) {
  }
  return decodeWithUtf8Fallback(buffer);
}
function detectUTF16Encoding(buffer) {
  if (buffer.length < 4) {
    return null;
  }
  if (buffer[0] === 255 && buffer[1] === 254 && !(buffer[2] === 0 && buffer[3] === 0)) {
    return "UTF-16LE";
  }
  if (buffer[0] === 254 && buffer[1] === 255) {
    return "UTF-16BE";
  }
  let utf16LEMatches = 0;
  let utf16BEMatches = 0;
  const samplesToCheck = Math.min(50, Math.floor(buffer.length / 2));
  for (let i = 0; i < samplesToCheck * 2; i += 2) {
    if (i + 1 >= buffer.length)
      break;
    if (buffer[i + 1] === 0) {
      const char = buffer[i];
      if (char >= 32 && char <= 126 || char === 9 || char === 10 || char === 13) {
        utf16LEMatches++;
      }
    }
    if (buffer[i] === 0) {
      const char = buffer[i + 1];
      if (char >= 32 && char <= 126 || char === 9 || char === 10 || char === 13) {
        utf16BEMatches++;
      }
    }
  }
  if (utf16LEMatches > samplesToCheck * 0.8) {
    return "UTF-16LE";
  }
  if (utf16BEMatches > samplesToCheck * 0.8) {
    return "UTF-16BE";
  }
  return null;
}
function hasUtf8Bom(buffer) {
  return buffer.length >= UTF8_BOM_BYTES.length && buffer[0] === UTF8_BOM_BYTES[0] && buffer[1] === UTF8_BOM_BYTES[1] && buffer[2] === UTF8_BOM_BYTES[2];
}
function detectUTF32Encoding(buffer) {
  if (buffer.length < 8) {
    return null;
  }
  if (buffer[0] === 0 && buffer[1] === 0 && buffer[2] === 254 && buffer[3] === 255) {
    return "UTF-32BE";
  }
  if (buffer[0] === 255 && buffer[1] === 254 && buffer[2] === 0 && buffer[3] === 0) {
    return "UTF-32LE";
  }
  let utf32BEMatches = 0;
  let utf32LEMatches = 0;
  const samplesToCheck = Math.min(50, Math.floor(buffer.length / 4));
  for (let i = 0; i < samplesToCheck * 4; i += 4) {
    if (i + 3 >= buffer.length)
      break;
    if (buffer[i] === 0 && buffer[i + 1] === 0 && buffer[i + 2] === 0) {
      const char = buffer[i + 3];
      if (char >= 32 && char <= 126 || char === 9 || char === 10 || char === 13) {
        utf32BEMatches++;
      }
    }
    if (buffer[i + 1] === 0 && buffer[i + 2] === 0 && buffer[i + 3] === 0) {
      const char = buffer[i];
      if (char >= 32 && char <= 126 || char === 9 || char === 10 || char === 13) {
        utf32LEMatches++;
      }
    }
  }
  if (utf32BEMatches > samplesToCheck * 0.8) {
    return "UTF-32BE";
  }
  if (utf32LEMatches > samplesToCheck * 0.8) {
    return "UTF-32LE";
  }
  return null;
}
var import_node_buffer, import_promises3, import_node_util, import_iconv_lite, import_jschardet, __awaiter10, LineEnding, VIDEO_EXTENSION_LIST, VIDEO_EXTENSIONS, UTF8_DECODER, LATIN1_DECODER, MAX_FILE_ENCODINGS, UTF8_BOM_BYTES, ESCAPE_BYTE, DETECTED_UTF8_ENCODING, _FILE_TO_ENCODING, BINARY_EXTENSIONS;
var init_encoding = __esm({
  "../packages/utils/dist/encoding.js"() {
    "use strict";
    import_node_buffer = require("node:buffer");
    import_promises3 = require("node:fs/promises");
    import_node_util = require("node:util");
    import_iconv_lite = __toESM(require_lib(), 1);
    import_jschardet = __toESM(require_jschardet(), 1);
    init_encoding_browser();
    __awaiter10 = function(thisArg, _arguments, P2, generator) {
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
    (function(LineEnding2) {
      LineEnding2["CRLF"] = "CRLF";
      LineEnding2["LF"] = "LF";
    })(LineEnding || (LineEnding = {}));
    VIDEO_EXTENSION_LIST = [
      ".mp4",
      ".webm",
      ".mov",
      ".avi",
      ".mkv",
      ".wmv",
      ".flv",
      ".m4v"
    ];
    VIDEO_EXTENSIONS = new Set(VIDEO_EXTENSION_LIST);
    UTF8_DECODER = new import_node_util.TextDecoder("utf-8", { fatal: true });
    LATIN1_DECODER = new import_node_util.TextDecoder("latin1");
    MAX_FILE_ENCODINGS = 100;
    UTF8_BOM_BYTES = Buffer.from([239, 187, 191]);
    ESCAPE_BYTE = 27;
    DETECTED_UTF8_ENCODING = "UTF-8";
    _FILE_TO_ENCODING = /* @__PURE__ */ new Map();
    BINARY_EXTENSIONS = /* @__PURE__ */ new Set([
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".webp",
      ".ico",
      ".bmp",
      ".svg",
      ".pdf",
      ".zip",
      ".tar",
      ".gz",
      ".exe",
      ".dll",
      ".so",
      ".dylib",
      ".bin",
      ...VIDEO_EXTENSION_LIST
    ]);
  }
});

