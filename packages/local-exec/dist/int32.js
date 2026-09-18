var INT32_MIN2 = -(2 ** 31);
var INT32_MAX2 = 2 ** 31 - 1;
function clampInt32(n) {
  if (Number.isNaN(n)) {
    return 0;
  }
  if (n < INT32_MIN2) {
    return INT32_MIN2;
  }
  if (n > INT32_MAX2) {
    return INT32_MAX2;
  }
  return n;
}
function toOptionalDurationMsInt32(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return void 0;
  }
  return clampInt32(Math.trunc(value));
}
