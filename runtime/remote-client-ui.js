"use strict";

const form = document.getElementById("connection-form");
const urlInput = document.getElementById("gateway-url");
const tokenInput = document.getElementById("gateway-token");
const vncPortInput = document.getElementById("vnc-port");
const vncControlPortInput = document.getElementById("vnc-control-port");
const rememberInput = document.getElementById("remember");
const connectButton = document.getElementById("connect");
const status = document.getElementById("status");
function updateConnectionMode() {
  const tunnel = urlInput.value.trim().toLowerCase().startsWith("http://");
  document.getElementById("display-tunnel-fields").hidden = !tunnel;
  document.getElementById("https-limitations").hidden = tunnel;
  vncPortInput.disabled = !tunnel;
  vncControlPortInput.disabled = !tunnel;
}
urlInput.addEventListener("input", updateConnectionMode);

function showStatus(message, isError = false) {
  status.textContent = message || "";
  status.classList.toggle("error", Boolean(isError));
}

function busy(value) {
  connectButton.disabled = value;
  connectButton.textContent = value ? "Connecting…" : "Connect";
}

async function initialize() {
  const initial = await window.remoteClient.getInitialState();
  if (initial.savedUrl) urlInput.value = initial.savedUrl;
  vncPortInput.value = String(initial.vncPort || 6180);
  vncControlPortInput.value = String(initial.vncControlPort || 6181);
  updateConnectionMode();
  if (initial.startupCode === "UNAUTHORIZED") tokenInput.placeholder = "Enter the rotated server token";
  if (initial.startupMessage) {
    showStatus(initial.startupMessage, true);
  } else if (initial.storageMessage) {
    showStatus(initial.storageMessage, true);
  }
  if (initial.hasSavedConnection) {
    busy(true);
    showStatus("Checking the saved server connection…");
    const result = await window.remoteClient.resumeSaved();
    if (result.launching) return;
    busy(false);
    if (result.gatewayUrl) urlInput.value = result.gatewayUrl;
    updateConnectionMode();
    if (result.code === "UNAUTHORIZED") tokenInput.placeholder = "Enter the rotated server token";
    showStatus(result.message || "Enter the current server token to connect.", true);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  busy(true);
  showStatus("Checking the authenticated Gateway…");
  try {
    const result = await window.remoteClient.connect({
      gatewayUrl: urlInput.value,
      token: tokenInput.value,
      remember: rememberInput.checked,
      vncPort: vncPortInput.disabled ? 6180 : Number(vncPortInput.value),
      vncControlPort: vncControlPortInput.disabled ? 6181 : Number(vncControlPortInput.value),
    });
    if (result.launching) {
      showStatus("Connected. Opening your server workspace…");
      return;
    }
    busy(false);
    showStatus(result.message || "Could not connect.", true);
  } catch (error) {
    busy(false);
    showStatus(error && error.message ? error.message : "Could not connect.", true);
  }
});

initialize().catch((error) => showStatus(error.message || "Could not load saved connection settings.", true));
