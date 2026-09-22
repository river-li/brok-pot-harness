/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/context/dist/browser-bridge.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var BYTE_TO_HEX, ID_ENTROPY_POOL, idEntropyPoolOffset;
var init_browser_bridge = __esm({
  "../packages/context/dist/browser-bridge.js"() {
    "use strict";
    BYTE_TO_HEX = Array.from({ length: 256 }, (_2, byte) => byte.toString(16).padStart(2, "0"));
    ID_ENTROPY_POOL = new Uint8Array(1024);
    idEntropyPoolOffset = ID_ENTROPY_POOL.length;
  }
});

