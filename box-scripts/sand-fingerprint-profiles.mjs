export const PROFILES = {
  linux: {
    uaPlatformToken: "X11; Linux x86_64",
    navigatorPlatform: "Linux x86_64",
    metadataPlatform: "Linux",
    platformVersion: "",
    architecture: "x86",
    bitness: "64",
    wow64: false,
    webglVendor: "Google Inc. (Google)",
    webglRenderer:
      "ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (LLVM 16.0.0) (0x0000C0DE)), SwiftShader driver)",
  },
  windows: {
    uaPlatformToken: "Windows NT 10.0; Win64; x64",
    navigatorPlatform: "Win32",
    metadataPlatform: "Windows",
    platformVersion: "10.0.0",
    architecture: "x86",
    bitness: "64",
    wow64: false,
    webglVendor: "Google Inc. (Intel)",
    webglRenderer:
      "ANGLE (Intel, Intel(R) UHD Graphics 630 (0x00003E9B) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    hardwareConcurrency: 8,
    deviceMemory: 8,
    maxTouchPoints: 0,
  },
  mac: {
    uaPlatformToken: "Macintosh; Intel Mac OS X 10_15_7",
    navigatorPlatform: "MacIntel",
    metadataPlatform: "macOS",
    platformVersion: "14.5.0",
    architecture: "x86",
    bitness: "64",
    wow64: false,
    webglVendor: "Google Inc. (Intel)",
    webglRenderer:
      "ANGLE (Intel, ANGLE Metal Renderer: Intel(R) Iris(TM) Plus Graphics 640, Unspecified Version)",
    hardwareConcurrency: 8,
    deviceMemory: 8,
    maxTouchPoints: 0,
  },
};

export const SPOOF_PROFILE_NAMES = Object.freeze(["windows", "mac"]);

export function resolveProfileName(raw) {
  const v = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (v === "windows" || v === "1" || v === "on" || v === "true") return "windows";
  if (v === "mac" || v === "macos" || v === "osx") return "mac";
  return null;
}

const GREASE = { brand: "Not=A?Brand", short: "99", full: "99.0.0.0" };

export function chromeProductFromUserAgentProduct(product) {
  const m = /Chrome\/(\d+)\.(\d+)\.(\d+)\.(\d+)/.exec(product ?? "");
  if (m == null) return { major: "0", full: "0.0.0.0" };
  return { major: m[1], full: `${m[1]}.${m[2]}.${m[3]}.${m[4]}` };
}

function buildUserAgentMetadata(product, profile) {
  const { major, full } = chromeProductFromUserAgentProduct(product);
  return {
    brands: [
      { brand: GREASE.brand, version: GREASE.short },
      { brand: "Google Chrome", version: major },
      { brand: "Chromium", version: major },
    ],
    fullVersionList: [
      { brand: GREASE.brand, version: GREASE.full },
      { brand: "Google Chrome", version: full },
      { brand: "Chromium", version: full },
    ],
    fullVersion: full,
    platform: profile.metadataPlatform,
    platformVersion: profile.platformVersion,
    architecture: profile.architecture,
    model: "",
    mobile: false,
    bitness: profile.bitness,
    wow64: profile.wow64,
  };
}

export function buildUserAgentOverride(product, profile) {
  const { major } = chromeProductFromUserAgentProduct(product);
  return {
    userAgent: `Mozilla/5.0 (${profile.uaPlatformToken}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.0.0 Safari/537.36`,
    acceptLanguage: "en-US,en",
    platform: profile.navigatorPlatform,
    userAgentMetadata: buildUserAgentMetadata(product, profile),
  };
}

function navigatorNumberPin(name, value) {
  return `
    try {
      const getter = function ${name}() { return ${JSON.stringify(value)}; };
      masked.add(getter);
      Object.defineProperty(Navigator.prototype, ${JSON.stringify(name)}, {
        get: getter, enumerable: true, configurable: true,
      });
    } catch (e) {}`;
}

export function buildNewDocumentScript(profile) {
  const hardwarePins = [];
  if (typeof profile.hardwareConcurrency === "number") {
    hardwarePins.push(navigatorNumberPin("hardwareConcurrency", profile.hardwareConcurrency));
  }
  if (typeof profile.deviceMemory === "number") {
    hardwarePins.push(navigatorNumberPin("deviceMemory", profile.deviceMemory));
  }
  if (typeof profile.maxTouchPoints === "number") {
    hardwarePins.push(navigatorNumberPin("maxTouchPoints", profile.maxTouchPoints));
  }
  return `(() => {
  const VENDOR = ${JSON.stringify(profile.webglVendor)};
  const RENDERER = ${JSON.stringify(profile.webglRenderer)};
  const PLATFORM = ${JSON.stringify(profile.navigatorPlatform)};
  const UNMASKED_VENDOR = 0x9245, UNMASKED_RENDERER = 0x9246;
  const nativeToString = Function.prototype.toString;
  const masked = new WeakSet();
  const fakeToString = function toString() {
    if (masked.has(this)) {
      return "function " + (this.name || "") + "() { [native code] }";
    }
    return nativeToString.call(this);
  };
  masked.add(fakeToString);
  try {
    Object.defineProperty(Function.prototype, "toString", {
      value: fakeToString, writable: true, configurable: true,
    });
  } catch (e) {}
  const patchGetParameter = (proto) => {
    if (!proto || !proto.getParameter) return;
    const original = proto.getParameter;
    if (masked.has(original)) return;
    const wrapped = function getParameter(pname) {
      if (pname === UNMASKED_VENDOR) return VENDOR;
      if (pname === UNMASKED_RENDERER) return RENDERER;
      return original.call(this, pname);
    };
    masked.add(wrapped);
    try {
      Object.defineProperty(proto, "getParameter", {
        value: wrapped, writable: true, configurable: true,
      });
    } catch (e) {}
  };
  try { patchGetParameter(WebGLRenderingContext.prototype); } catch (e) {}
  try { patchGetParameter(WebGL2RenderingContext.prototype); } catch (e) {}
  try {
    const platformGetter = function platform() { return PLATFORM; };
    masked.add(platformGetter);
    Object.defineProperty(Navigator.prototype, "platform", {
      get: platformGetter, enumerable: true, configurable: true,
    });
  } catch (e) {}
${hardwarePins.join("")}
})();`;
}
