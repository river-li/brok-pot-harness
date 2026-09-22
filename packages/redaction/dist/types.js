/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redaction/dist/types.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __classPrivateFieldSet2 = function(receiver, state, value, kind, f2) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f2) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f2 : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f2.call(receiver, value) : f2 ? f2.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet2 = function(receiver, state, kind, f2) {
  if (kind === "a" && !f2) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f2 : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f2 : kind === "a" ? f2.call(receiver) : f2 ? f2.value : state.get(receiver);
};
var _RedactedString_instances;
var _a17;
var _RedactedString_value;
var _RedactedString_privacyContext;
var _RedactedString_displayValue;
var _RedactedString_rewrap;
var _RedactedString_logImplicitSerialization;
var _RedactedBytes_value;
var _RedactedBytes_privacyContext;
var _RedactedHash_value;
var _RedactedHash_hashDisplay;
var _RedactedHash_privacyContext;
var _RedactedValue_value;
var _RedactedValue_privacyContext;
var IS_DEV = typeof process !== "undefined" && process.env.NODE_ENV === "development" && process.env.VITEST !== "true";
function stringAtIndex(value, index) {
  const normalizedIndex = index < 0 ? value.length + index : index;
  if (normalizedIndex < 0 || normalizedIndex >= value.length) {
    return void 0;
  }
  return value[normalizedIndex];
}
var REDACTION_LOG_MESSAGES = {
  UNSPECIFIED_FIELD: "[PRIVACY REDACTION] unwrapping UNSPECIFIED field \u2014 classify this field",
  UNSPECIFIED_PRIVACY_MODE: "[PRIVACY REDACTION] unwrapping with PrivacyMode.UNSPECIFIED \u2014 resolve privacy mode",
  LOGGER_NOT_INITIALIZED: "[PRIVACY REDACTION] logger not initialized \u2014 call setRedactionLogger() at process startup",
  ENFORCEMENT_SKIPPED: "[PRIVACY REDACTION] would have been redacted but enforceRedaction is false",
  LOGGING_ERROR: "[PRIVACY REDACTION] error logging violation",
  IMPLICIT_SERIALIZATION: "[PRIVACY REDACTION] implicit serialization of would-be-redacted field",
  IMPLICIT_SERIALIZATION_DEV: "[PRIVACY REDACTION] ERROR: Redaction via implicit serialization caught in test, please call unwrap() explicitly"
};
function logUnspecifiedWarnings(info2) {
  if (info2.classification === DataClassification.UNSPECIFIED) {
    try {
      _logger === null || _logger === void 0 ? void 0 : _logger.info({
        redaction_field_name: info2.fieldName,
        redaction_classification: info2.classification
      }, REDACTION_LOG_MESSAGES.UNSPECIFIED_FIELD);
    } catch (err) {
      console.error(REDACTION_LOG_MESSAGES.LOGGING_ERROR, err);
    }
  }
  if (info2.privacyMode === PrivacyMode2.UNSPECIFIED) {
    try {
      _logger === null || _logger === void 0 ? void 0 : _logger.info({
        redaction_field_name: info2.fieldName,
        redaction_classification: info2.classification,
        redaction_privacy_mode: info2.privacyMode
      }, REDACTION_LOG_MESSAGES.UNSPECIFIED_PRIVACY_MODE);
    } catch (err) {
      console.error(REDACTION_LOG_MESSAGES.LOGGING_ERROR, err);
    }
  }
}
function logEnforcementSkipped(info2) {
  if (_logger === void 0) {
    console.error(REDACTION_LOG_MESSAGES.LOGGER_NOT_INITIALIZED);
  } else {
    try {
      _logger.info({
        redaction_field_name: info2.fieldName,
        redaction_classification: info2.classification,
        redaction_privacy_mode: info2.privacyMode,
        redaction_enforcement_skipped: true
      }, REDACTION_LOG_MESSAGES.ENFORCEMENT_SKIPPED);
    } catch (err) {
      console.error(REDACTION_LOG_MESSAGES.LOGGING_ERROR, err);
    }
  }
}
var _logger;
var RedactedString = class {
  constructor(value, classification, fieldName, modeOrContext) {
    _RedactedString_instances.add(this);
    _RedactedString_value.set(this, void 0);
    _RedactedString_privacyContext.set(this, void 0);
    const ctx = toPrivacyContext(modeOrContext);
    __classPrivateFieldSet2(this, _RedactedString_value, value, "f");
    __classPrivateFieldSet2(this, _RedactedString_privacyContext, ctx, "f");
    this.__classification = classification;
    this.__fieldName = fieldName;
    this.__privacyMode = ctx.privacyMode;
    this.__isRedacted = shouldRedact(ctx.privacyMode, classification);
  }
  // ============================================
  // Size properties
  // ============================================
  /** Returns the length of the original (unredacted) string. */
  get length() {
    return __classPrivateFieldGet2(this, _RedactedString_value, "f").length;
  }
  /** Returns true if the original (unredacted) string is empty. */
  get empty() {
    return __classPrivateFieldGet2(this, _RedactedString_value, "f").length === 0;
  }
  // ============================================
  // Core redaction methods
  // ============================================
  /** Returns a snapshot of the privacy context for propagation to new wrappers. */
  getPrivacyContext() {
    return __classPrivateFieldGet2(this, _RedactedString_privacyContext, "f").enforceRedaction !== void 0 ? {
      privacyMode: __classPrivateFieldGet2(this, _RedactedString_privacyContext, "f").privacyMode,
      enforceRedaction: __classPrivateFieldGet2(this, _RedactedString_privacyContext, "f").enforceRedaction
    } : { privacyMode: __classPrivateFieldGet2(this, _RedactedString_privacyContext, "f").privacyMode };
  }
  /**
   * Get the original, unredacted value.
   *
   * Uses allowedPurpose(privacyMode, purpose, classification) to determine if
   * unwrapping is permitted. Throws if not allowed (unless opts.redactUnallowedFieldsInsteadOfThrowing).
   *
   * @param purpose - The purpose for which the value is needed (e.g., STORAGE_FOR_USAGE for RPC response)
   * @param opts - Options; set redactUnallowedFieldsInsteadOfThrowing: true to return redacted placeholder instead of throwing when unwrap not allowed
   * @returns The original string value, or redacted placeholder when not allowed and opts.redactUnallowedFieldsInsteadOfThrowing is true
   * @throws Error if unwrap is not allowed and opts.redactUnallowedFieldsInsteadOfThrowing is false
   */
  unwrap(purpose, opts) {
    const info2 = {
      fieldName: this.__fieldName,
      classification: this.__classification,
      privacyMode: this.__privacyMode
    };
    logUnspecifiedWarnings(info2);
    if (allowedPurpose(this.__privacyMode, purpose, this.__classification)) {
      return __classPrivateFieldGet2(this, _RedactedString_value, "f");
    }
    const enforce = (opts === null || opts === void 0 ? void 0 : opts.enforcing) || resolveEnforceRedaction(__classPrivateFieldGet2(this, _RedactedString_privacyContext, "f"), this.__classification);
    if (!enforce && !IS_DEV) {
      logEnforcementSkipped(info2);
    }
    if (!enforce) {
      return __classPrivateFieldGet2(this, _RedactedString_value, "f");
    }
    if (opts === null || opts === void 0 ? void 0 : opts.redactUnallowedFieldsInsteadOfThrowing) {
      return formatRedacted(this.__fieldName);
    }
    throw new Error(`Unwrap not allowed for purpose ${purpose} with classification ${this.__classification} and privacy mode ${this.__privacyMode}`);
  }
  /**
   * Create a new RedactedString with the same metadata but different content.
   * Useful for transforming the value while preserving classification/privacy settings.
   */
  __clone(newValue) {
    return new _a17(newValue, this.__classification, `${this.__fieldName}.clone`, __classPrivateFieldGet2(this, _RedactedString_privacyContext, "f"));
  }
  /**
   * Transform the underlying value while preserving redaction metadata.
   * Safely unwraps, applies the transform, and re-wraps the result.
   *
   * In FP this is called `map`.
   *
   * @param fn - Function to transform the unredacted value
   */
  safeTransform(fn) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, fn(__classPrivateFieldGet2(this, _RedactedString_value, "f")));
  }
  // ============================================
  // String conversion (returns redacted form)
  // ============================================
  /** Returns redacted form like "[redacted:fieldName]" */
  toString() {
    __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_logImplicitSerialization).call(this, "toString");
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_displayValue).call(this);
  }
  /** Returns redacted form for JSON serialization */
  toJSON() {
    __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_logImplicitSerialization).call(this, "toJSON");
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_displayValue).call(this);
  }
  valueOf() {
    __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_logImplicitSerialization).call(this, "valueOf");
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_displayValue).call(this);
  }
  [(_RedactedString_value = /* @__PURE__ */ new WeakMap(), _RedactedString_privacyContext = /* @__PURE__ */ new WeakMap(), _RedactedString_instances = /* @__PURE__ */ new WeakSet(), _RedactedString_displayValue = function _RedactedString_displayValue2() {
    return getRedactionAwareDisplayValue({
      privacyMode: __classPrivateFieldGet2(this, _RedactedString_privacyContext, "f").privacyMode,
      classification: this.__classification,
      fieldName: this.__fieldName,
      unredactedValue: __classPrivateFieldGet2(this, _RedactedString_value, "f"),
      enforceRedaction: __classPrivateFieldGet2(this, _RedactedString_privacyContext, "f").enforceRedaction
    });
  }, _RedactedString_rewrap = function _RedactedString_rewrap2(newValue) {
    return new _a17(newValue, this.__classification, this.__fieldName, __classPrivateFieldGet2(this, _RedactedString_privacyContext, "f"));
  }, _RedactedString_logImplicitSerialization = function _RedactedString_logImplicitSerialization2(serializationPath) {
    if (!this.__isRedacted || resolveEnforceRedaction(__classPrivateFieldGet2(this, _RedactedString_privacyContext, "f"), this.__classification)) {
      return;
    }
    if (IS_DEV) {
      throw new Error(`${REDACTION_LOG_MESSAGES.IMPLICIT_SERIALIZATION_DEV} (field=${this.__fieldName}, classification=${this.__classification}, path=${serializationPath})`);
    }
    try {
      _logger === null || _logger === void 0 ? void 0 : _logger.info({
        redaction_field_name: this.__fieldName,
        redaction_classification: this.__classification,
        redaction_privacy_mode: this.__privacyMode,
        redaction_serialization_path: serializationPath
      }, REDACTION_LOG_MESSAGES.IMPLICIT_SERIALIZATION);
    } catch (_b2) {
    }
  }, Symbol.toPrimitive)](hint) {
    if (hint === "string" || hint === "default") {
      __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_logImplicitSerialization).call(this, "toPrimitive");
      return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_displayValue).call(this);
    }
    return NaN;
  }
  get [Symbol.toStringTag]() {
    return "RedactedString";
  }
  // ============================================
  // Boolean-returning methods (operate on original value)
  // ============================================
  /** Check if string starts with searchString */
  startsWith(searchString, position) {
    return __classPrivateFieldGet2(this, _RedactedString_value, "f").startsWith(searchString, position);
  }
  /** Check if string ends with searchString */
  endsWith(searchString, endPosition) {
    return __classPrivateFieldGet2(this, _RedactedString_value, "f").endsWith(searchString, endPosition);
  }
  /** Check if string includes searchString */
  includes(searchString, position) {
    return __classPrivateFieldGet2(this, _RedactedString_value, "f").includes(searchString, position);
  }
  // ============================================
  // String-returning methods (return RedactedString<C>, preserve classification)
  // ============================================
  /** Remove whitespace from both ends */
  trim() {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").trim());
  }
  /** Remove whitespace from start */
  trimStart() {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").trimStart());
  }
  /** Remove whitespace from start (alias) */
  trimLeft() {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").trimStart());
  }
  /** Remove whitespace from end */
  trimEnd() {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").trimEnd());
  }
  /** Remove whitespace from end (alias) */
  trimRight() {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").trimEnd());
  }
  /** Extract a section of the string */
  slice(start, end) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").slice(start, end));
  }
  /** Extract characters between two indices */
  substring(start, end) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").substring(start, end));
  }
  /** Extract a specified number of characters (deprecated) */
  substr(start, length) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").substr(start, length));
  }
  /** Convert to lowercase */
  toLowerCase() {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").toLowerCase());
  }
  /** Convert to uppercase */
  toUpperCase() {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").toUpperCase());
  }
  /** Convert to locale-aware lowercase */
  toLocaleLowerCase(locales) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").toLocaleLowerCase(locales));
  }
  /** Convert to locale-aware uppercase */
  toLocaleUpperCase(locales) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").toLocaleUpperCase(locales));
  }
  /** Replace occurrences of a pattern */
  replace(searchValue, replaceValue) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").replace(searchValue, replaceValue));
  }
  /** Replace all occurrences of a pattern */
  replaceAll(searchValue, replaceValue) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").replaceAll(searchValue, replaceValue));
  }
  /** Pad the start of the string */
  padStart(maxLength, fillString) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").padStart(maxLength, fillString));
  }
  /** Pad the end of the string */
  padEnd(maxLength, fillString) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").padEnd(maxLength, fillString));
  }
  /** Repeat the string */
  repeat(count) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").repeat(count));
  }
  /** Unicode normalize the string */
  normalize(form) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").normalize(form));
  }
  /** Concatenate strings */
  concat(...strings) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").concat(...strings));
  }
  /** Get character at position */
  charAt(pos) {
    return __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, __classPrivateFieldGet2(this, _RedactedString_value, "f").charAt(pos));
  }
  /** Get character at index (supports negative) */
  at(index) {
    const char = stringAtIndex(__classPrivateFieldGet2(this, _RedactedString_value, "f"), index);
    return char !== void 0 ? __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, char) : void 0;
  }
  // ============================================
  // Array-returning methods (return RedactedString<C>[], preserve classification)
  // ============================================
  /** Split string into array */
  split(separator, limit) {
    return __classPrivateFieldGet2(this, _RedactedString_value, "f").split(separator, limit).map((s3) => __classPrivateFieldGet2(this, _RedactedString_instances, "m", _RedactedString_rewrap).call(this, s3));
  }
  // ============================================
  // Number-returning methods
  // ============================================
  /** Find index of searchString */
  indexOf(searchString, position) {
    return __classPrivateFieldGet2(this, _RedactedString_value, "f").indexOf(searchString, position);
  }
  /** Find last index of searchString */
  lastIndexOf(searchString, position) {
    return __classPrivateFieldGet2(this, _RedactedString_value, "f").lastIndexOf(searchString, position);
  }
  /** Search for a match */
  search(regexp) {
    return __classPrivateFieldGet2(this, _RedactedString_value, "f").search(regexp);
  }
  /** Compare strings in locale-aware manner */
  localeCompare(that, locales, options2) {
    return __classPrivateFieldGet2(this, _RedactedString_value, "f").localeCompare(that, locales, options2);
  }
};
_a17 = RedactedString;
var RedactedBytes = class _RedactedBytes {
  constructor(value, classification, fieldName, modeOrContext) {
    _RedactedBytes_value.set(this, void 0);
    _RedactedBytes_privacyContext.set(this, void 0);
    const ctx = toPrivacyContext(modeOrContext);
    __classPrivateFieldSet2(this, _RedactedBytes_value, value, "f");
    __classPrivateFieldSet2(this, _RedactedBytes_privacyContext, ctx, "f");
    this.__classification = classification;
    this.__fieldName = fieldName;
    this.__privacyMode = ctx.privacyMode;
    this.__isRedacted = shouldRedact(ctx.privacyMode, classification);
  }
  /** Returns a snapshot of the privacy context for propagation to new wrappers. */
  getPrivacyContext() {
    return __classPrivateFieldGet2(this, _RedactedBytes_privacyContext, "f").enforceRedaction !== void 0 ? {
      privacyMode: __classPrivateFieldGet2(this, _RedactedBytes_privacyContext, "f").privacyMode,
      enforceRedaction: __classPrivateFieldGet2(this, _RedactedBytes_privacyContext, "f").enforceRedaction
    } : { privacyMode: __classPrivateFieldGet2(this, _RedactedBytes_privacyContext, "f").privacyMode };
  }
  /**
   * Get the original, unredacted bytes.
   *
   * Uses allowedPurpose(privacyMode, purpose, classification) to determine if
   * unwrapping is permitted. Throws if not allowed (unless opts.redactUnallowedFieldsInsteadOfThrowing).
   *
   * @param purpose - The purpose for which the value is needed
   * @param opts - Options; set redactUnallowedFieldsInsteadOfThrowing: true to return empty bytes instead of throwing when unwrap not allowed
   * @returns The original bytes value, or empty bytes when not allowed and opts.redactUnallowedFieldsInsteadOfThrowing is true
   * @throws Error if unwrap is not allowed and opts.redactUnallowedFieldsInsteadOfThrowing is false
   */
  unwrap(purpose, opts) {
    const info2 = {
      fieldName: this.__fieldName,
      classification: this.__classification,
      privacyMode: this.__privacyMode
    };
    logUnspecifiedWarnings(info2);
    if (allowedPurpose(this.__privacyMode, purpose, this.__classification)) {
      return __classPrivateFieldGet2(this, _RedactedBytes_value, "f");
    }
    const enforce = (opts === null || opts === void 0 ? void 0 : opts.enforcing) || resolveEnforceRedaction(__classPrivateFieldGet2(this, _RedactedBytes_privacyContext, "f"), this.__classification);
    if (!enforce && !IS_DEV) {
      logEnforcementSkipped(info2);
    }
    if (!enforce) {
      return __classPrivateFieldGet2(this, _RedactedBytes_value, "f");
    }
    if (opts === null || opts === void 0 ? void 0 : opts.redactUnallowedFieldsInsteadOfThrowing) {
      return new Uint8Array(0);
    }
    throw new Error(`Unwrap not allowed for purpose ${purpose} with classification ${this.__classification} and privacy mode ${this.__privacyMode}`);
  }
  /**
   * Create a new RedactedBytes with the same metadata but different content.
   * Useful for transforming the value while preserving classification/privacy settings.
   *
   * @param newValue - The new bytes value to wrap
   */
  __clone(newValue) {
    return new _RedactedBytes(newValue, this.__classification, this.__fieldName, __classPrivateFieldGet2(this, _RedactedBytes_privacyContext, "f"));
  }
  /** Returns true if the original (unredacted) bytes is empty. */
  get empty() {
    return __classPrivateFieldGet2(this, _RedactedBytes_value, "f").length === 0;
  }
  /** Returns the length of the original (unredacted) bytes. */
  get length() {
    return __classPrivateFieldGet2(this, _RedactedBytes_value, "f").length;
  }
  /**
   * Transform the underlying value while preserving redaction metadata.
   * Safely unwraps, applies the transform, and re-wraps the result.
   *
   * In FP this is called `map`.
   *
   * @param fn - Function to transform the unredacted value
   */
  safeTransform(fn) {
    return new _RedactedBytes(fn(__classPrivateFieldGet2(this, _RedactedBytes_value, "f")), this.__classification, this.__fieldName, __classPrivateFieldGet2(this, _RedactedBytes_privacyContext, "f"));
  }
};
_RedactedBytes_value = /* @__PURE__ */ new WeakMap(), _RedactedBytes_privacyContext = /* @__PURE__ */ new WeakMap();
_RedactedHash_value = /* @__PURE__ */ new WeakMap(), _RedactedHash_hashDisplay = /* @__PURE__ */ new WeakMap(), _RedactedHash_privacyContext = /* @__PURE__ */ new WeakMap();
function isRedactedString(value) {
  return value instanceof RedactedString;
}
_RedactedValue_value = /* @__PURE__ */ new WeakMap(), _RedactedValue_privacyContext = /* @__PURE__ */ new WeakMap();

