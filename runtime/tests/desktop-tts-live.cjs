/* Uses the original settings/preview UI and real local CPU speech service.
 * The media observer records native playback events; it does not replace audio.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { desktopFixture } = require("./desktop-fixture.cjs");

(async () => {
  const root = path.resolve(__dirname, "../..");
  const base = "http://127.0.0.1:1540";
  const token = fs
    .readFileSync(path.join(root, ".runtime/gateway-token"), "utf8")
    .trim();
  const profile = path.join(root, ".runtime/tests/desktop-tts-" + randomUUID());
  const api = async (method, args = {}) => {
    const response = await fetch(`${base}/api/${method}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(25000),
    });
    assert.equal(response.status, 200, `${method} status`);
    return response.json();
  };
  let agent, ui;
  try {
    ({ agent } = await api("createAgent", {
      name: "Local voice preview test",
      description: "Temporary local voice preview verification.",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
    }));
    await api("setAgentVoice", { id: agent.id, voiceId: "altair" });
    ui = await desktopFixture({ root, profile, base, token });
    await ui.waitFor(
      () => ui.click("View conversation details"),
      15000,
      "Bot settings",
    );
    await ui.waitFor(
      () => ui.click("Local Altair"),
      10000,
      "local voice selection",
    );
    await ui.evaluate(`(() => {
      window.ttsEvents = [];
      const observed = new WeakSet(), original = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function(...args) {
        window.ttsAudio = this;
        if (!observed.has(this)) {
          observed.add(this);
          for (const event of ['playing','ended','pause','error']) this.addEventListener(event, () =>
            window.ttsEvents.push({event, time:this.currentTime, duration:this.duration, wav:this.src.startsWith('data:audio/wav;'), code:this.error?.code}));
        }
        return original.apply(this,args);
      };
    })()`);
    await ui.waitFor(
      () =>
        ui.evaluate(
          "[...document.querySelectorAll('button')].filter(b=>b.getAttribute('aria-label')?.startsWith('Play the Local ')).length === 28",
        ),
      5000,
      "all local preview choices",
    );
    await ui.waitFor(
      () => ui.click("Play the Local Altair preview"),
      5000,
      "settled preview menu",
    );
    await ui.waitFor(
      () => ui.evaluate("window.ttsEvents.some(e=>e.event==='ended')"),
      25000,
      "native audio completion",
    );
    const first = await ui.evaluate("window.ttsEvents");
    assert.ok(
      first.some((e) => e.event === "playing" && e.wav && e.duration > 0.2),
    );
    assert.ok(first.some((e) => e.event === "ended" && e.time > 0.2));
    assert.ok(first.every((e) => e.event !== "error"));
    console.log(
      "PASS retained preview → authenticated gateway → real local synthesis → native audio playing/ended.",
    );
    await ui.evaluate("window.ttsEvents=[]");
    await ui.waitFor(
      () => ui.click("Play the Local Ara preview"),
      5000,
      "second preview button",
    );
    await ui.waitFor(
      () => ui.evaluate("window.ttsEvents.some(e=>e.event==='playing')"),
      25000,
      "second voice playback",
    );
    await ui.waitFor(
      () => ui.click("Stop the Local Ara preview"),
      1500,
      "stop button",
    );
    await ui.waitFor(
      () =>
        ui.evaluate(
          "window.ttsAudio.paused && window.ttsEvents.some(e=>e.event==='pause')",
        ),
      2000,
      "preview stop",
    );
    await ui.waitFor(
      () =>
        ui.clickElement(
          "[...document.querySelectorAll('[role=option]')].find(e=>e.innerText.trim()==='Local Ara')",
        ),
      5000,
      "voice selection",
    );
    await ui.waitFor(
      async () =>
        (await api("listAgents")).find((a) => a.id === agent.id)?.voiceId ===
        "ara",
      5000,
      "saved local voice ID",
    );
    await ui.screenshot(path.join(profile, "preview-settings.png"));
    await ui.close();
    ui = null;
    ui = await desktopFixture({ root, profile, base, token });
    await ui.waitFor(
      () => ui.click("View conversation details"),
      15000,
      "settings after restart",
    );
    await ui.waitFor(
      () =>
        ui.evaluate(
          "[...document.querySelectorAll('[role=combobox]')].some(e=>e.innerText.trim()==='Local Ara')",
        ),
      10000,
      "voice retained across restart",
    );
    assert.ok(
      await ui.evaluate(
        "document.body.innerText.includes('Live calls are not available yet.')",
      ),
    );
    await ui.screenshot(path.join(profile, "preview-restarted.png"));
    console.log(
      "PASS preview stop, original voice selection/save and desktop restart persistence.",
    );
    console.log("Diagnostics:", profile);
  } catch (error) {
    if (ui) {
      console.error(
        await ui
          .evaluate(
            "JSON.stringify({text:document.body.innerText.slice(-2000),buttons:[...document.querySelectorAll('button')].slice(-35).map(b=>({label:b.getAttribute('aria-label'),text:b.innerText}))})",
          )
          .catch(() => "UI unavailable"),
      );
      await ui.screenshot(path.join(profile, "failure.png")).catch(() => {});
      console.error("Diagnostics:", profile);
    }
    throw error;
  } finally {
    if (ui) await ui.close();
    if (agent) await api("deleteAgent", { id: agent.id });
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
