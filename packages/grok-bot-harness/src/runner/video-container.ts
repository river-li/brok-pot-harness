/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/video-container.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var ASCII_MARKERS = [
  { offset: 4, text: "ftyp" },
  { offset: 0, text: "OggS" },
  { offset: 0, text: "FLV" },
  { offset: 8, text: "AVI " }
];
var BYTE_MARKERS = [
  /*
   * EBML header for WebM and Matroska.
   * https://ffmpeg.org/doxygen/8.0/matroska_8h_source.html
   */
  [26, 69, 223, 163],
  /*
   * ASF header for Windows Media.
   * https://ffmpeg.org/doxygen/8.0/asf__tags_8c_source.html
   */
  [48, 38, 178, 117],
  /*
   * MPEG program-stream pack header.
   * https://ffmpeg.org/doxygen/8.0/mpegvideodec_8c_source.html
   */
  [0, 0, 1, 186],
  /*
   * MPEG video elementary-stream sequence header.
   * https://ffmpeg.org/doxygen/8.0/mpegvideodec_8c_source.html
   */
  [0, 0, 1, 179]
];
function hasAsciiAt(bytes, offset, text2) {
  if (bytes.byteLength < offset + text2.length) return false;
  for (let index = 0; index < text2.length; index++) {
    if (bytes[offset + index] !== text2.charCodeAt(index)) return false;
  }
  return true;
}
function bytesLookLikeVideoContainer(bytes) {
  return ASCII_MARKERS.some((marker17) => hasAsciiAt(bytes, marker17.offset, marker17.text)) || BYTE_MARKERS.some(
    (marker17) => bytes.byteLength >= marker17.length && marker17.every((byte, index) => bytes[index] === byte)
  );
}

