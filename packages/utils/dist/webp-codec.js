var registeredCodec, hasWebpCodec, requireCodec, isWebp, readWebpDimensions, decodeWebp, encodeWebp;
var init_webp_codec = __esm({
  "../packages/utils/dist/webp-codec.js"() {
    "use strict";
    hasWebpCodec = () => registeredCodec !== void 0;
    requireCodec = () => {
      if (registeredCodec === void 0) {
        throw new Error("webp codec not registered: registerWebpCodec() must be called by a Node server before decoding/encoding webp");
      }
      return registeredCodec;
    };
    isWebp = (buffer) => buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
    readWebpDimensions = (buffer) => {
      if (!isWebp(buffer) || buffer.length < 16) {
        return void 0;
      }
      const fourCC = buffer.toString("ascii", 12, 16);
      if (fourCC === "VP8 ") {
        if (buffer.length < 30 || buffer[23] !== 157 || buffer[24] !== 1 || buffer[25] !== 42) {
          return void 0;
        }
        return {
          width: (buffer[26] | buffer[27] << 8) & 16383,
          height: (buffer[28] | buffer[29] << 8) & 16383
        };
      }
      if (fourCC === "VP8L") {
        if (buffer.length < 25 || buffer[20] !== 47) {
          return void 0;
        }
        const bits = (buffer[21] | buffer[22] << 8 | buffer[23] << 16 | buffer[24] << 24) >>> 0;
        return {
          width: (bits & 16383) + 1,
          height: (bits >> 14 & 16383) + 1
        };
      }
      if (fourCC === "VP8X") {
        if (buffer.length < 30) {
          return void 0;
        }
        return {
          width: 1 + (buffer[24] | buffer[25] << 8 | buffer[26] << 16),
          height: 1 + (buffer[27] | buffer[28] << 8 | buffer[29] << 16)
        };
      }
      return void 0;
    };
    decodeWebp = (data) => requireCodec().decode(data);
    encodeWebp = (bitmap) => requireCodec().encode(bitmap);
  }
});
