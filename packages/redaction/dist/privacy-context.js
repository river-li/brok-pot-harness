var _enforceRedactionGate;
function isGlobalEnforcementEnabled() {
  var _a19;
  return (_a19 = _enforceRedactionGate === null || _enforceRedactionGate === void 0 ? void 0 : _enforceRedactionGate()) !== null && _a19 !== void 0 ? _a19 : false;
}
function resolveEnforceRedaction(ctx, classification) {
  if (ctx.enforceRedaction === false) {
    return false;
  }
  if (ctx.enforceRedaction === true) {
    return true;
  }
  if (classification === DataClassification.CREDENTIALS || classification === DataClassification.UNSPECIFIED) {
    return true;
  }
  return ctx.privacyMode !== PrivacyMode2.UNSPECIFIED && isGlobalEnforcementEnabled();
}
function privacyContextFromMode(privacyMode, enforceRedaction) {
  return enforceRedaction !== void 0 ? { privacyMode, enforceRedaction } : { privacyMode };
}
function toPrivacyContext(modeOrContext) {
  if (typeof modeOrContext === "object" && modeOrContext !== null && "privacyMode" in modeOrContext) {
    return modeOrContext;
  }
  return privacyContextFromMode(modeOrContext);
}
