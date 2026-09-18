var PNG_SIGNATURE = Buffer.from([
  137,
  80,
  78,
  71,
  13,
  10,
  26,
  10
]);
var PNG_IHDR_CHUNK_BYTES = 25;
var PNG_IEND_TRAILER = Buffer.from([
  0,
  0,
  0,
  0,
  73,
  69,
  78,
  68,
  174,
  66,
  96,
  130
]);
var readPngDimensions = (buffer) => {
  if (buffer.length < PNG_SIGNATURE.length + PNG_IHDR_CHUNK_BYTES + PNG_IEND_TRAILER.length || !buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE) || buffer.readUInt32BE(8) !== 13 || buffer.toString("ascii", 12, 16) !== "IHDR" || !buffer.subarray(buffer.length - PNG_IEND_TRAILER.length).equals(PNG_IEND_TRAILER)) {
    return void 0;
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  if (width < 1 || height < 1) {
    return void 0;
  }
  return { mimeType: "image/png", width, height };
};
var JPEG_START_OF_SCAN = 218;
var JPEG_END_OF_IMAGE = 217;
var isStandaloneJpegMarker = (marker17) => marker17 === 1 || marker17 >= 208 && marker17 <= 216;
var isDecodableJpegFrame = (marker17) => marker17 === 192 || marker17 === 193 || marker17 === 194;
var isUndecodableJpegFrame = (marker17) => marker17 >= 195 && marker17 <= 207 && marker17 !== 196 && marker17 !== 200 && marker17 !== 204;
var readJpegDimensions = (buffer) => {
  if (buffer.length < 4 || buffer[0] !== 255 || buffer[1] !== 216 || buffer[buffer.length - 2] !== 255 || buffer[buffer.length - 1] !== JPEG_END_OF_IMAGE) {
    return void 0;
  }
  let offset = 2;
  while (offset + 4 <= buffer.length) {
    if (buffer[offset] !== 255) {
      return void 0;
    }
    const marker17 = buffer[offset + 1];
    if (marker17 === 255) {
      offset += 1;
      continue;
    }
    if (isStandaloneJpegMarker(marker17)) {
      offset += 2;
      continue;
    }
    if (marker17 === JPEG_START_OF_SCAN || marker17 === JPEG_END_OF_IMAGE || isUndecodableJpegFrame(marker17)) {
      return void 0;
    }
    const segmentLength = buffer.readUInt16BE(offset + 2);
    if (segmentLength < 2) {
      return void 0;
    }
    if (isDecodableJpegFrame(marker17)) {
      if (segmentLength < 8 || offset + 9 > buffer.length) {
        return void 0;
      }
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      if (width < 1 || height < 1) {
        return void 0;
      }
      return { mimeType: "image/jpeg", width, height };
    }
    offset += 2 + segmentLength;
  }
  return void 0;
};
var readRasterDimensions = (buffer) => {
  var _a19;
  return (_a19 = readPngDimensions(buffer)) !== null && _a19 !== void 0 ? _a19 : readJpegDimensions(buffer);
};
