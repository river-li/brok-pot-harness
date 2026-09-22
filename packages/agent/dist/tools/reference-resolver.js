/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/reference-resolver.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var REFERENCE_PATTERN = new RegExp(String.raw`(?<!\\)\$(PROMPT_(${PROMPT_REFERENCE_ID_REGEX_SOURCE})|RESPONSE_([a-zA-Z0-9_-]+))(?![A-Za-z0-9_-])(?:\s*\[\s*(\d*)\s*:\s*(\d*)\s*\])?`, "g");
var REFERENCE_CHECK_PATTERN = new RegExp(String.raw`(?<!\\)\$(PROMPT(?!_)|PROMPT_${PROMPT_REFERENCE_ID_REGEX_SOURCE}|RESPONSE_[a-zA-Z0-9_-]+)(?![A-Za-z0-9_-])`);

