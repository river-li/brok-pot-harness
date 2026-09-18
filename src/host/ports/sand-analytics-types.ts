function sandMessageLengthBucket(length) {
  if (length <= 0) return "empty";
  if (length < 20) return "xs";
  if (length < 100) return "s";
  if (length < 500) return "m";
  if (length < 2e3) return "l";
  return "xl";
}
