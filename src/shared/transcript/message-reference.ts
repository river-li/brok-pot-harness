var MESSAGE_ADDRESS_EXACT = /^t(?:\d+u(?:a\d+)?|(?:\d+|b)[as]\d+)$/;
function isMessageAddress(value) {
  return MESSAGE_ADDRESS_EXACT.test(value);
}
