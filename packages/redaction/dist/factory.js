function createRedactedString(value, classification, fieldName, modeOrContext) {
  return new RedactedString(value, classification, fieldName, modeOrContext);
}
function createRedactedBytes(value, classification, fieldName, modeOrContext) {
  return new RedactedBytes(value, classification, fieldName, modeOrContext);
}
function safeString(value) {
  return createRedactedString(value, DataClassification.SAFE, "safe", PrivacyMode2.USAGE_CODEBASE_TRAINING_ALLOWED);
}
var CLASSIFICATION_STRICTNESS = {
  [DataClassification.CREDENTIALS]: 4,
  [DataClassification.UNSPECIFIED]: 4,
  [DataClassification.CODE]: 3,
  [DataClassification.PATH]: 2,
  [DataClassification.PROVIDER_INFO]: 2,
  [DataClassification.SAFE]: 1
};
var PRIVACY_MODE_STRICTNESS = {
  [PrivacyMode2.UNSPECIFIED]: 5,
  [PrivacyMode2.NO_STORAGE]: 4,
  [PrivacyMode2.NO_TRAINING]: 3,
  [PrivacyMode2.USAGE_DATA_TRAINING_ALLOWED]: 2,
  [PrivacyMode2.USAGE_CODEBASE_TRAINING_ALLOWED]: 1
};
