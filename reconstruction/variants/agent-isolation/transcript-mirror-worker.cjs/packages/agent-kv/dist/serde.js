/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-kv/dist/serde.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
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
function toHex(u8) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(u8).toString("hex");
  }
  let out = "";
  for (let i = 0; i < u8.length; i++) {
    out += HEX_LUT[u8[i]];
  }
  return out;
}

