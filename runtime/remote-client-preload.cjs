"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("remoteClient", Object.freeze({
  getInitialState: () => ipcRenderer.invoke("remote-client:initial-state"),
  resumeSaved: () => ipcRenderer.invoke("remote-client:resume-saved"),
  connect: (connection) => ipcRenderer.invoke("remote-client:connect", connection),
}));
