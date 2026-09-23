var SIMPLE_ESCAPES = {
  '"': '"',
  "\\": "\\",
  "/": "/",
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "	"
};
var JsonStringContentStream = class {
  constructor() {
    this.inString = false;
    this.inEscape = false;
  }
  push(chunk) {
    let out = "";
    for (const char of chunk) {
      if (!this.inString) {
        if (char === '"') {
          this.inString = true;
        }
        continue;
      }
      if (this.unicodeHex !== void 0) {
        this.unicodeHex += char;
        if (this.unicodeHex.length === 4) {
          const codeUnit = Number.parseInt(this.unicodeHex, 16);
          if (!Number.isNaN(codeUnit)) {
            out += String.fromCharCode(codeUnit);
          }
          this.unicodeHex = void 0;
        }
        continue;
      }
      if (this.inEscape) {
        this.inEscape = false;
        if (char === "u") {
          this.unicodeHex = "";
        } else {
          out += SIMPLE_ESCAPES[char] ?? char;
        }
        continue;
      }
      if (char === "\\") {
        this.inEscape = true;
      } else if (char === '"') {
        this.inString = false;
        out += "\n";
      } else {
        out += char;
      }
    }
    return out;
  }
};
