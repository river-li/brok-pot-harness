/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/pending-tool-call-contract.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isToolCallContentPart(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const part = value;
  return part.type === "tool-call" && typeof part.toolCallId === "string" && typeof part.toolName === "string";
}
function isToolIdentifierOrUnknown(value) {
  return typeof value === "string" && value.length > 0;
}
function parseContract(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return void 0;
  }
  const raw = value;
  if (typeof raw.toolCallId !== "string" || typeof raw.outerToolName !== "string" || !isToolIdentifierOrUnknown(raw.toolIdentifier) || typeof raw.isDynamic !== "boolean" || !Array.isArray(raw.allowedToolNames) || !raw.allowedToolNames.every((name17) => typeof name17 === "string")) {
    return void 0;
  }
  const contract = {
    toolCallId: raw.toolCallId,
    outerToolName: raw.outerToolName,
    toolIdentifier: raw.toolIdentifier,
    isDynamic: raw.isDynamic,
    allowedToolNames: raw.allowedToolNames
  };
  if (typeof raw.effectiveToolName === "string") {
    contract.effectiveToolName = raw.effectiveToolName;
  }
  if (isToolIdentifierOrUnknown(raw.effectiveToolIdentifier)) {
    contract.effectiveToolIdentifier = raw.effectiveToolIdentifier;
  }
  return contract;
}
function readPendingToolExecutionContracts(message) {
  const raw = message.providerOptions?.cursor?.pendingToolExecutionContracts;
  const contracts = /* @__PURE__ */ new Map();
  if (raw === void 0 || raw === null || typeof raw !== "object") {
    return contracts;
  }
  for (const [toolCallId, value] of Object.entries(raw)) {
    const contract = parseContract(value);
    if (contract === void 0 || contract.toolCallId !== toolCallId) {
      continue;
    }
    contracts.set(toolCallId, contract);
  }
  return contracts;
}
function buildPendingToolExecutionContract(options2) {
  const descriptor2 = resolveEffectiveToolCallDescriptor({
    toolCallId: options2.toolCallId,
    toolName: options2.toolName,
    args: parseNativeToolArguments(options2.args) ?? {}
  }, options2.toolExecutionSet);
  const outerIdentity = options2.resolveIdentity({
    toolName: options2.toolName,
    args: options2.args
  }) ?? {
    toolIdentifier: "unknown",
    isDynamic: false
  };
  const effectiveToolName = descriptor2.effectiveNativeToolCall?.toolName;
  const effectiveArgs = descriptor2.effectiveNativeToolCall?.args;
  const effectiveIdentity = effectiveToolName === void 0 ? void 0 : options2.resolveIdentity({
    toolName: effectiveToolName,
    args: effectiveArgs
  }) ?? {
    toolIdentifier: "unknown",
    isDynamic: true
  };
  return {
    toolCallId: options2.toolCallId,
    outerToolName: options2.toolName,
    toolIdentifier: outerIdentity.toolIdentifier,
    isDynamic: outerIdentity.isDynamic || effectiveIdentity?.isDynamic === true,
    ...effectiveToolName !== void 0 ? {
      effectiveToolName,
      effectiveToolIdentifier: effectiveIdentity?.toolIdentifier ?? "unknown"
    } : {},
    allowedToolNames: [...options2.allowedToolNames]
  };
}
function enrichPendingToolCallJson(pendingMessage, options2) {
  try {
    const parsed2 = JSON.parse(pendingMessage);
    const contracts = {
      ...parsed2.providerOptions?.cursor?.pendingToolExecutionContracts ?? {}
    };
    if (Array.isArray(parsed2.content)) {
      for (const part of parsed2.content) {
        if (!isToolCallContentPart(part)) {
          continue;
        }
        contracts[part.toolCallId] = buildPendingToolExecutionContract({
          toolCallId: part.toolCallId,
          toolName: part.toolName,
          args: part.args,
          resolveIdentity: options2.resolveIdentity,
          toolExecutionSet: options2.toolExecutionSet,
          allowedToolNames: options2.allowedToolNames
        });
      }
    }
    const existingStartedAtMs = parsed2.providerOptions?.cursor?.pendingToolCallStartedAtMs;
    parsed2.providerOptions = {
      ...parsed2.providerOptions,
      cursor: {
        ...parsed2.providerOptions?.cursor,
        ...options2.pendingToolCallStartedAtMs !== void 0 ? {
          pendingToolCallStartedAtMs: existingStartedAtMs ?? options2.pendingToolCallStartedAtMs
        } : {},
        pendingToolExecutionContracts: contracts
      }
    };
    return JSON.stringify(parsed2);
  } catch {
    return pendingMessage;
  }
}
function getAdmittedEffectiveToolName(descriptor2, allowedToolNames) {
  return descriptor2.effectiveNativeToolCall !== void 0 && allowedToolNames?.has(descriptor2.toolName) === true ? descriptor2.effectiveNativeToolCall.toolName : void 0;
}
function collectPendingToolAdmission(options2) {
  const admittedEffectiveToolNames = /* @__PURE__ */ new Set();
  let allowedToolNames;
  for (const contract of options2.contracts) {
    allowedToolNames ??= new Set(contract.allowedToolNames);
    for (const name17 of contract.allowedToolNames) {
      allowedToolNames.add(name17);
    }
    admittedEffectiveToolNames.add(contract.outerToolName);
    if (contract.effectiveToolName !== void 0 && allowedToolNames.has(contract.outerToolName)) {
      admittedEffectiveToolNames.add(contract.effectiveToolName);
    }
  }
  return { allowedToolNames, admittedEffectiveToolNames };
}
function resolveDescriptorForPendingToolCall(options2) {
  const outerDescriptor = {
    toolCallId: options2.toolCallId,
    toolName: options2.toolName,
    args: parseNativeToolArguments(options2.args) ?? {}
  };
  if (options2.contract?.effectiveToolName !== void 0 && outerDescriptor.args !== null && typeof outerDescriptor.args === "object" && !Array.isArray(outerDescriptor.args)) {
    const outerArgs = outerDescriptor.args;
    const nestedArgs = outerArgs.namespace === CURSOR_DYNAMIC_TOOLS_NAMESPACE && outerArgs.toolName === options2.contract.effectiveToolName ? parseNativeToolArguments(outerArgs.arguments) : void 0;
    if (nestedArgs !== void 0) {
      return {
        ...outerDescriptor,
        effectiveNativeToolCall: {
          toolName: options2.contract.effectiveToolName,
          args: nestedArgs
        }
      };
    }
  }
  return resolveEffectiveToolCallDescriptor(outerDescriptor, options2.toolExecutionSet);
}
function expectedPendingToolIdentifier(contract) {
  return contract.effectiveToolIdentifier ?? contract.toolIdentifier;
}
function validatePendingToolContractIdentity(options2) {
  if (options2.contract.effectiveToolName !== void 0 && options2.descriptor.effectiveNativeToolCall === void 0) {
    return {
      ok: false,
      reason: `Pending tool contract mismatch for ${options2.descriptor.toolName}: expected effective tool ${options2.contract.effectiveToolName}, but none resolved`
    };
  }
  const effectiveToolName = getEffectiveToolCallName(options2.descriptor);
  const effectiveArgs = getEffectiveToolCallArgs(options2.descriptor);
  const actual = resolveToolCallIdentity({
    tool: options2.tool,
    args: effectiveArgs,
    isDirectDynamicTool: options2.descriptor.effectiveNativeToolCall !== void 0 || options2.directDynamicToolNames.has(effectiveToolName)
  });
  const expected = expectedPendingToolIdentifier(options2.contract);
  if (actual.toolIdentifier !== expected) {
    return {
      ok: false,
      reason: `Pending tool contract mismatch for ${effectiveToolName}: expected ${expected}, got ${actual.toolIdentifier}`
    };
  }
  return { ok: true };
}
function createPendingToolContractMismatchResult(descriptor2, reason) {
  return {
    role: "tool",
    id: descriptor2.toolCallId,
    content: [
      {
        type: "tool-result",
        toolName: descriptor2.toolName,
        toolCallId: descriptor2.toolCallId,
        result: reason
      }
    ]
  };
}

