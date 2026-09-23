var CredentialFieldStop = class extends Error {
  field;
  constructor(field) {
    super(`stopped at a ${field} field; the browser agent never types credentials`);
    this.name = "CredentialFieldStop";
    this.field = field;
  }
};
var REDACTED_VALUE = 'value="<redacted>"';
var CREDENTIAL_NAME = /\b(?:password|passcode|passphrase|pass ?word|pin|otp|one[- ]?time|verification code|security code|auth(?:entication)? code|2fa|mfa|cvv|cvc|cvn|card number|credit card|expir(?:y|ation))\b/i;
function credentialFieldKind(element) {
  if (!element.kinds.includes("fill"))
    return void 0;
  if (element.line.includes(REDACTED_VALUE))
    return "credential";
  return credentialNameKind(element.name);
}
function credentialNameKind(name17) {
  const match2 = CREDENTIAL_NAME.exec(name17);
  return match2 === null ? void 0 : match2[0].toLowerCase();
}
