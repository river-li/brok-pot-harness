function shouldRedact(privacyMode, classification) {
  if (classification === DataClassification.CREDENTIALS || classification === DataClassification.UNSPECIFIED) {
    return true;
  }
  if (classification === DataClassification.SAFE) {
    return false;
  }
  if (!SENSITIVE_CLASSIFICATIONS.includes(classification)) {
    return false;
  }
  switch (privacyMode) {
    case PrivacyMode2.USAGE_DATA_TRAINING_ALLOWED:
    case PrivacyMode2.USAGE_CODEBASE_TRAINING_ALLOWED:
      return false;
    case PrivacyMode2.NO_STORAGE:
    case PrivacyMode2.NO_TRAINING:
      return true;
    case PrivacyMode2.UNSPECIFIED:
      return true;
    default: {
      const _exhaustiveCheck = privacyMode;
      void _exhaustiveCheck;
      return true;
    }
  }
}
function formatRedacted(fieldName) {
  return `[redacted:${fieldName}]`;
}
function getRedactionAwareDisplayValue(options2) {
  const { privacyMode, classification, fieldName, unredactedValue } = options2;
  const enforceRedaction = resolveEnforceRedaction({ privacyMode, enforceRedaction: options2.enforceRedaction }, classification);
  if (!enforceRedaction) {
    return unredactedValue;
  }
  return shouldRedact(privacyMode, classification) ? formatRedacted(fieldName) : unredactedValue;
}
