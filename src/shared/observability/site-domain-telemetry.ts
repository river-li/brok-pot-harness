init_proto();
function siteDomainTelemetryAllowed(mode) {
  switch (mode) {
    case PrivacyMode.USAGE_DATA_TRAINING_ALLOWED:
    case PrivacyMode.USAGE_CODEBASE_TRAINING_ALLOWED:
      return true;
    case PrivacyMode.NO_STORAGE:
    case PrivacyMode.NO_TRAINING:
    case PrivacyMode.UNSPECIFIED:
    case void 0:
      return false;
    default:
      return false;
  }
}
