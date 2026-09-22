/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redaction/dist/classification.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var DataClassification;
(function(DataClassification2) {
  DataClassification2["SAFE"] = "safe";
  DataClassification2["CODE"] = "code";
  DataClassification2["CREDENTIALS"] = "credentials";
  DataClassification2["PATH"] = "path";
  DataClassification2["PROVIDER_INFO"] = "provider_info";
  DataClassification2["UNSPECIFIED"] = "unspecified";
})(DataClassification || (DataClassification = {}));
var SENSITIVE_CLASSIFICATIONS = [
  DataClassification.CODE,
  DataClassification.CREDENTIALS,
  DataClassification.PATH,
  DataClassification.PROVIDER_INFO,
  DataClassification.UNSPECIFIED
];
var PrivacyCapability;
(function(PrivacyCapability2) {
  PrivacyCapability2["STORAGE_FOR_TRAINING"] = "storage_for_training";
  PrivacyCapability2["STORAGE_FOR_LOGGING"] = "storage_for_logging";
  PrivacyCapability2["STORAGE_FOR_USAGE"] = "storage_for_usage";
  PrivacyCapability2["UNSAFE_ALWAYS_ALLOWED"] = "unsafe_always_allowed";
})(PrivacyCapability || (PrivacyCapability = {}));
function allowedPurpose(privacyMode, purpose, classification) {
  if (classification === DataClassification.SAFE) {
    return true;
  }
  if (purpose === PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) {
    return true;
  }
  if (classification === DataClassification.CREDENTIALS || classification === DataClassification.UNSPECIFIED) {
    return false;
  }
  if (purpose !== PrivacyCapability.STORAGE_FOR_TRAINING && purpose !== PrivacyCapability.STORAGE_FOR_LOGGING && purpose !== PrivacyCapability.STORAGE_FOR_USAGE) {
    const _exhaustiveCheck = purpose;
    throw new Error(`Unknown purpose: ${purpose}`);
  }
  switch (privacyMode) {
    case PrivacyMode2.NO_STORAGE:
    case PrivacyMode2.UNSPECIFIED:
      return false;
    case PrivacyMode2.NO_TRAINING:
      if (purpose === PrivacyCapability.STORAGE_FOR_LOGGING) {
        return classification === DataClassification.PATH || classification === DataClassification.PROVIDER_INFO;
      }
      if (purpose === PrivacyCapability.STORAGE_FOR_TRAINING) {
        return false;
      }
      if (purpose === PrivacyCapability.STORAGE_FOR_USAGE) {
        return true;
      }
      throw new Error(`Unknown purpose: ${purpose}`);
    case PrivacyMode2.USAGE_DATA_TRAINING_ALLOWED:
    case PrivacyMode2.USAGE_CODEBASE_TRAINING_ALLOWED:
      return true;
    default: {
      const _exhaustiveCheck = privacyMode;
      throw new Error(`Unknown privacy mode: ${privacyMode}`);
    }
  }
}

