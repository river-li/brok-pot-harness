"use strict";

const form = document.getElementById("connection-form");
const urlInput = document.getElementById("gateway-url");
const tokenInput = document.getElementById("gateway-token");
const vncPortInput = document.getElementById("vnc-port");
const vncControlPortInput = document.getElementById("vnc-control-port");
const rememberInput = document.getElementById("remember");
const connectButton = document.getElementById("connect");
const status = document.getElementById("status");

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
      vncPort: Number(vncPortInput.value),
      vncControlPort: Number(vncControlPortInput.value),
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
