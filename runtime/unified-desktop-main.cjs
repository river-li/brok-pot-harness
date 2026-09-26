"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { app } = require("electron");

const home = process.env.GBH_UNIFIED_HOME || path.join(app.getPath("appData"), "Brokpot");
const profile = path.join(home, "Local Desktop");
fs.mkdirSync(profile, { recursive: true, mode: 0o700 });
app.setPath("userData", profile);
const token = fs.readFileSync(path.join(home, "Local Server", "gateway-token"), "utf8").trim();
if (token.length < 32) throw new Error("The local Gateway token is invalid.");
Object.assign(process.env, {
  GROKBOT_LOCAL_MODE: "1",
  GROKBOT_LOCAL_VOICE: "1",
  GROKBOT_LOCAL_KEYCHAIN: "0",
  SAND_BACKEND_URL: "http://127.0.0.1:9",
  SAND_HOST_GATEWAY_URL: "http://127.0.0.1:1540",
  SAND_HOST_GATEWAY_TOKEN: token,
  SAND_HOST_GATEWAY_NETWORK_TOKEN: token,
  SAND_USER_DATA_DIR: profile,
  SAND_DISABLE_TELEMETRY: "1",
  SAND_DISABLE_ANALYTICS: "1",
  SAND_DEV_BOX_CONTROL_PLANE: "0",
  SAND_DEV_CONTROL_PORT: "0",
  SAND_ATTACH_PROD_BOX: "0",
});
delete process.env.LITELLM_API_KEY;
require("./dist/electron-main/main.cjs");
