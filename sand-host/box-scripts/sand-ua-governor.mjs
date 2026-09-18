import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import {
  BROWSER_FINGERPRINT_SPOOF_MARKER_PATH,
  UA_OWNER_STAMP_LENGTH,
  UA_OWNER_STAMP_PATH,
  UA_TOKEN_DISABLED_MARKER_PATH,
} from "./box-contract.generated.mjs";
import {
  connectBrowser,
  discoverMonitorPorts,
  getBrowserVersion,
  isCdpTargetGone,
  isConnectionRefused,
} from "./cdp-cookies.mjs";
import {
  PROFILES,
  SPOOF_PROFILE_NAMES,
  buildNewDocumentScript,
  buildUserAgentOverride,
  resolveProfileName,
} from "./sand-fingerprint-profiles.mjs";

const POLL_INTERVAL_MS = 100;
const DESKTOP_UA_TEMPLATE =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{MAJOR}.0.0.0 Safari/537.36";

function errorClass(error) {
  return (
    error?.code ?? error?.cause?.code ?? (error instanceof Error ? error.name : typeof error)
  );
}

const reportedOnce = new Set();

function reportOnce(message) {
  if (reportedOnce.has(message)) return;
  reportedOnce.add(message);
  console.error(message);
}

export function grokAgentUaToken(
  ownerStampFile = UA_OWNER_STAMP_PATH,
  tokenDisabledFile = UA_TOKEN_DISABLED_MARKER_PATH,
) {
  if (existsSync(tokenDisabledFile)) return "";
  let raw = "";
  try {
    raw = readFileSync(ownerStampFile, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") {
      reportOnce(`ua owner stamp at ${ownerStampFile} unreadable: ${errorClass(error)}`);
    }
  }
  const owner = (raw.split("\n", 1)[0] ?? "")
    .replace(/[^0-9a-f]/g, "")
    .slice(0, UA_OWNER_STAMP_LENGTH);
  return owner === "" ? "GrokAgent/1.0" : `GrokAgent/1.0 (u:${owner})`;
}

function chromeMajorOf(chromeVersion) {
  return chromeVersion.split(".", 1)[0];
}

function userAgentFromTemplate(template, chromeVersion, uaToken) {
  const base = template.replace("{MAJOR}", chromeMajorOf(chromeVersion));
  return uaToken === "" ? base : `${base} ${uaToken}`;
}

export function liveChromeProduct(browser) {
  const version = typeof browser?.chromeVersion === "string" ? browser.chromeVersion : "";
  if (/^\d+\.\d+\.\d+\.\d+$/.test(version)) return `Chrome/${version}`;
  return "Chrome/0.0.0.0";
}

export function desktopUserAgent(chromeVersion, uaToken = grokAgentUaToken()) {
  return userAgentFromTemplate(DESKTOP_UA_TEMPLATE, chromeVersion, uaToken);
}

export function desktopUserAgentOverride(browser, uaToken = grokAgentUaToken()) {
  const override = buildUserAgentOverride(liveChromeProduct(browser), PROFILES.linux);
  return {
    ...override,
    userAgent: uaToken === "" ? override.userAgent : `${override.userAgent} ${uaToken}`,
  };
}

export async function applyDesktopUaToTarget(
  browser,
  sessionId,
  uaToken = grokAgentUaToken(),
) {
  await browser.send(
    "Emulation.setUserAgentOverride",
    desktopUserAgentOverride(browser, uaToken),
    sessionId,
  );
}

export function resolveOsSpoofProfileName({
  envValue = process.env.SAND_BROWSER_FINGERPRINT_SPOOF,
  markerPath = BROWSER_FINGERPRINT_SPOOF_MARKER_PATH,
} = {}) {
  const fromEnv = resolveProfileName(envValue);
  if (fromEnv != null) return fromEnv;
  try {
    return resolveProfileName(readFileSync(markerPath, "utf8").split("\n", 1)[0]);
  } catch (error) {
    if (
      error == null ||
      typeof error !== "object" ||
      !("code" in error) ||
      error.code !== "ENOENT"
    ) {
      console.error(
        `fingerprint spoof marker read failed: ${error instanceof Error ? error.name : typeof error}`,
      );
    }
    return null;
  }
}

export function osSpoofUserAgentOverride(browser, profile, uaToken = grokAgentUaToken()) {
  const override = buildUserAgentOverride(liveChromeProduct(browser), profile);
  return {
    ...override,
    userAgent: uaToken === "" ? override.userAgent : `${override.userAgent} ${uaToken}`,
  };
}

export function spoofDocumentScriptMap(browser) {
  if (browser.spoofDocumentScripts == null) {
    browser.spoofDocumentScripts = new Map();
  }
  return browser.spoofDocumentScripts;
}

export async function removeSpoofDocumentScript(browser, sessionId) {
  const identifier = spoofDocumentScriptMap(browser).get(sessionId);
  if (identifier == null) return;
  try {
    await browser.send("Page.removeScriptToEvaluateOnNewDocument", { identifier }, sessionId);
  } catch (error) {
    console.error(
      `spoof script remove failed: ${error instanceof Error ? error.name : typeof error}`,
    );
  }
  spoofDocumentScriptMap(browser).delete(sessionId);
}

export async function applyOsSpoofToTarget(
  browser,
  sessionId,
  profile,
  uaToken = grokAgentUaToken(),
) {
  const script = buildNewDocumentScript(profile);
  const override = osSpoofUserAgentOverride(browser, profile, uaToken);
  await browser.send("Emulation.setUserAgentOverride", override, sessionId);
  try {
    await removeSpoofDocumentScript(browser, sessionId);
    await browser.send("Runtime.evaluate", { expression: script }, sessionId);
    await browser.send("Page.enable", {}, sessionId);
    const added = await browser.send(
      "Page.addScriptToEvaluateOnNewDocument",
      { source: script },
      sessionId,
    );
    if (typeof added?.identifier === "string") {
      spoofDocumentScriptMap(browser).set(sessionId, added.identifier);
    }
  } catch (error) {
    try {
      await applyDesktopUaToTarget(browser, sessionId, uaToken);
    } catch (rollbackError) {
      console.error(
        `os spoof rollback failed: ${rollbackError instanceof Error ? rollbackError.name : typeof rollbackError}`,
      );
    }
    throw error;
  }
}

export async function applyUaTreatmentToTarget(browser, sessionId, uaToken = grokAgentUaToken()) {
  const spoofName = browser.osSpoofProfile ?? resolveOsSpoofProfileName();
  if (spoofName != null && SPOOF_PROFILE_NAMES.includes(spoofName)) {
    await applyOsSpoofToTarget(browser, sessionId, PROFILES[spoofName], uaToken);
    return;
  }
  await removeSpoofDocumentScript(browser, sessionId);
  await applyDesktopUaToTarget(browser, sessionId, uaToken);
}

export async function configureUaGovernorBrowser(browser) {
  browser.attachedSessions = new Set();
  browser.onEvent(message => {
    const sessionId = message.params?.sessionId;
    if (typeof sessionId !== "string") return;
    if (message.method === "Target.detachedFromTarget") {
      browser.attachedSessions.delete(sessionId);
      return;
    }
    if (message.method !== "Target.attachedToTarget") return;
    browser.attachedSessions.add(sessionId);
    const reportUnlessGone = (step) => (error) => {
      if (isCdpTargetGone(error)) return;
      console.error(`${step} failed port=${browser.port}: ${errorClass(error)}`);
    };
    void applyUaTreatmentToTarget(browser, sessionId)
      .catch(reportUnlessGone("ua apply"))
      .finally(() => {
        void browser
          .send("Runtime.runIfWaitingForDebugger", {}, sessionId)
          .catch(reportUnlessGone("resume"));
      });
  });
  await browser.send("Target.setAutoAttach", {
    autoAttach: true,
    waitForDebuggerOnStart: true,
    flatten: true,
    filter: [{ type: "page", exclude: false }, { exclude: true }],
  });
}

export async function reapplyUaTreatment(browsers, uaToken) {
  for (const browser of browsers.values()) {
    if (browser.isClosed) continue;
    for (const sessionId of browser.attachedSessions ?? []) {
      await applyUaTreatmentToTarget(browser, sessionId, uaToken).catch((error) => {
        console.error(
          `ua re-apply failed port=${browser.port}: ${error instanceof Error ? error.name : typeof error}`,
        );
      });
    }
  }
}

async function main() {
  const browsers = new Map();
  let lastUaToken = grokAgentUaToken();
  let lastSpoofName = resolveOsSpoofProfileName();
  for (;;) {
    for (const port of discoverMonitorPorts()) {
      const existing = browsers.get(port);
      if (existing != null && !existing.isClosed) continue;
      try {
        const chromeVersion = await getBrowserVersion(port);
        const browser = await connectBrowser(port);
        browser.chromeVersion = chromeVersion;
        browser.osSpoofProfile = resolveOsSpoofProfileName();
        await configureUaGovernorBrowser(browser);
        browsers.set(port, browser);
      } catch (error) {
        if (!isConnectionRefused(error)) {
          reportOnce(`monitor on CDP port ${port} not governed: ${errorClass(error)}`);
        }
      }
    }
    for (const [port, browser] of browsers) {
      if (!browser.isClosed) continue;
      browsers.delete(port);
    }
    const uaToken = grokAgentUaToken();
    const spoofName = resolveOsSpoofProfileName();
    if (uaToken !== lastUaToken || spoofName !== lastSpoofName) {
      lastUaToken = uaToken;
      lastSpoofName = spoofName;
      for (const browser of browsers.values()) {
        browser.osSpoofProfile = spoofName;
      }
      await reapplyUaTreatment(browsers, uaToken);
    }
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

if (
  process.argv[1] != null &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  void main();
}
