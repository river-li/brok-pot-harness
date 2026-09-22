/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-kv/dist/serde.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var decoder = new TextDecoder();
var encoder = new TextEncoder();
var Utf8Serde = class {
  serialize(value) {
    return encoder.encode(value);
  }
  deserialize(blob) {
    return decoder.decode(blob);
  }
  getBlobType() {
    return { kind: "string" };
  }
};
var utf8Serde = new Utf8Serde();
var ProtoSerde = class {
  constructor(proto) {
    this.proto = proto;
  }
  serialize(value) {
    return value.toBinary();
  }
  deserialize(blob) {
    return this.proto.fromBinary(blob);
  }
  getBlobType() {
    return { kind: "proto", typeName: this.proto.typeName };
  }
};
var HEX_LUT = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function fromHex(hex) {
  const clean = hex.trim().toLowerCase();
  if (clean.length % 2 !== 0)
    throw new Error("Invalid hex string length");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    out[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return out;
}

