function mapToIconvEncoding(encoding) {
  return ENCODING_MAPPINGS[encoding] || encoding;
}
function stripUtf8Bom(text2) {
  return text2.startsWith("\uFEFF") ? text2.slice(1) : text2;
}
function normalizeEncodingName(encoding) {
  const normalized = encoding.toLowerCase();
  if (normalized === "latin-1") {
    return LATIN1_ENCODING;
  }
  if (normalized === "utf-8") {
    return UTF8_ENCODING;
  }
  if (normalized === "utf-8-bom" || normalized === "utf-8 bom") {
    return UTF8_BOM_ENCODING;
  }
  return normalized;
}
var UTF8_ENCODING, UTF8_BOM_ENCODING, LATIN1_ENCODING, ENCODING_MAPPINGS;
var init_encoding_browser = __esm({
  "../packages/utils/dist/encoding-browser.js"() {
    "use strict";
    UTF8_ENCODING = "utf8";
    UTF8_BOM_ENCODING = "utf8bom";
    LATIN1_ENCODING = "latin1";
    ENCODING_MAPPINGS = {
      // Windows codepages
      "windows-1250": "cp1250",
      "windows-1251": "cp1251",
      "windows-1252": "cp1252",
      "windows-1253": "cp1253",
      "windows-1254": "cp1254",
      "windows-1255": "cp1255",
      "windows-1256": "cp1256",
      "windows-1257": "cp1257",
      "windows-1258": "cp1258",
      // ISO-8859 family
      "iso-8859-1": "iso88591",
      "iso-8859-2": "iso88592",
      "iso-8859-5": "iso88595",
      "iso-8859-6": "iso88596",
      "iso-8859-7": "iso88597",
      "iso-8859-8": "iso88598",
      "iso-8859-9": "iso88599",
      "iso-8859-15": "iso885915",
      "iso-8859-16": "iso885916",
      // East Asian
      shift_jis: "shiftjis",
      "euc-jp": "eucjp",
      "euc-kr": "euckr",
      "iso-2022-jp": "iso2022jp",
      "iso-2022-kr": "iso2022kr",
      gb2312: "gb2312",
      gbk: "gbk",
      gb18030: "gb18030",
      big5: "big5",
      "big5-hkscs": "big5hkscs",
      // Cyrillic
      "koi8-r": "koi8r",
      "koi8-u": "koi8u",
      ibm855: "cp855",
      ibm866: "cp866",
      maccyrillic: "maccyrillic",
      // UTF encodings
      "utf-16le": "utf16le",
      "utf-16be": "utf16be",
      "utf-32le": "utf32le",
      "utf-32be": "utf32be",
      // Other
      johab: "johab",
      cp949: "cp949",
      cp932: "cp932"
    };
  }
});
