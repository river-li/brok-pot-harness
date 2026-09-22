/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/resource-provider.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createResource(remoteImplementation, controlledImplementation) {
  return {
    symbol: /* @__PURE__ */ Symbol(),
    remoteImplementation,
    registerControlledImplementation: controlledImplementation
  };
}
var RemoteResourceAccessor = class {
  constructor(remoteExecManager) {
    this.remoteExecManager = remoteExecManager;
  }
  get(resource) {
    return resource.remoteImplementation(this.remoteExecManager);
  }
};
var ResourceDescriptor = class {
  constructor(resource, value) {
    this.resource = resource;
    this.value = value;
  }
};
function resourceEntry(resource, implementation) {
  return [resource, implementation];
}
var RegistryResourceAccessor = class {
  constructor() {
    this.resources = /* @__PURE__ */ new Map();
  }
  register(resource, value) {
    this.resources.set(resource.symbol, new ResourceDescriptor(resource, value));
  }
  get(resource) {
    var _a19;
    return (_a19 = this.resources.get(resource.symbol)) === null || _a19 === void 0 ? void 0 : _a19.value;
  }
  entries() {
    return Array.from(this.resources.values()).map((value) => [value.resource, value.value]);
  }
};
var CombinedResourceAccessor = class {
  constructor(baseAccessor, localResourceEntries) {
    this.baseAccessor = baseAccessor;
    this.localResources = /* @__PURE__ */ new Map();
    for (const [resource, implementation] of localResourceEntries) {
      this.localResources.set(resource.symbol, {
        resource,
        implementation
      });
    }
  }
  get(resource) {
    const localEntry = this.localResources.get(resource.symbol);
    if (localEntry) {
      return localEntry.implementation;
    }
    return this.baseAccessor.get(resource);
  }
};

