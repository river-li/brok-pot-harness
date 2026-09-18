var CharCode = {
  NUL: 0,
  CR: 13,
  DASH: 45,
  ZERO: 48,
  NINE: 57,
  COLON: 58
};
var LineBounds = class {
  constructor() {
    this.lineEnd = 0;
    this.nextStart = 0;
  }
};
function nextRecordLineBounds(s3, start, out) {
  const n = s3.length;
  if (start >= n) {
    return false;
  }
  const nl = s3.indexOf("\n", start);
  if (nl !== -1) {
    for (let q2 = start; q2 < nl; q2++) {
      if (s3.charCodeAt(q2) === CharCode.CR && q2 + 1 !== nl) {
        out.lineEnd = q2;
        out.nextStart = q2 + 1;
        return true;
      }
    }
    const crlf = nl > start && s3.charCodeAt(nl - 1) === CharCode.CR;
    out.lineEnd = crlf ? nl - 1 : nl;
    out.nextStart = nl + 1;
    return true;
  }
  const cr2 = s3.indexOf("\r", start);
  if (cr2 !== -1) {
    out.lineEnd = cr2;
    out.nextStart = cr2 + 1;
    return true;
  }
  out.lineEnd = n;
  out.nextStart = n;
  return true;
}
function isDashDashLine(s3, start, end) {
  return end - start === 2 && s3.charCodeAt(start) === CharCode.DASH && s3.charCodeAt(start + 1) === CharCode.DASH;
}
