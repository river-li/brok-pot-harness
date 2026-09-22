/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-core/dist/transport/mcp-url-utils.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var BIGINT_ZERO2, BIGINT_EIGHT, BIGINT_SIXTEEN, IPV4_LOW_HEXTET_MASK, DNS_LABEL_PATTERN, HOSTNAME_ALLOWLIST_PATTERN_REGEX, WILDCARD_HOST_ALLOWLIST_PATTERN_REGEX, IPV4_SEGMENT_PATTERN, IPV4_LITERAL_REGEX, CIDR_ALLOWLIST_PATTERN_REGEX;
var init_mcp_url_utils = __esm({
  "../packages/mcp-core/dist/transport/mcp-url-utils.js"() {
    "use strict";
    BIGINT_ZERO2 = BigInt(0);
    BIGINT_EIGHT = BigInt(8);
    BIGINT_SIXTEEN = BigInt(16);
    IPV4_LOW_HEXTET_MASK = BigInt(65535);
    DNS_LABEL_PATTERN = "[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?";
    HOSTNAME_ALLOWLIST_PATTERN_REGEX = new RegExp(`^(?:${DNS_LABEL_PATTERN}\\.)*${DNS_LABEL_PATTERN}$`);
    WILDCARD_HOST_ALLOWLIST_PATTERN_REGEX = new RegExp(`^\\*\\.(?:${DNS_LABEL_PATTERN}\\.)*${DNS_LABEL_PATTERN}$`);
    IPV4_SEGMENT_PATTERN = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)";
    IPV4_LITERAL_REGEX = new RegExp(`^${IPV4_SEGMENT_PATTERN}(?:\\.${IPV4_SEGMENT_PATTERN}){3}$`);
    CIDR_ALLOWLIST_PATTERN_REGEX = new RegExp(`^(?:${IPV4_SEGMENT_PATTERN}(?:\\.${IPV4_SEGMENT_PATTERN}){3}|[0-9a-f:]+)\\/\\d{1,3}$`);
  }
});

