"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("brokpot", Object.freeze({
  initial: () => ipcRenderer.invoke("unified:initial"),
  choose: (input) => ipcRenderer.invoke("unified:choose", input),
  onProgress: (listener) => ipcRenderer.on("unified:progress", (_event, message) => listener(message)),
  onFailure: (listener) => ipcRenderer.on("unified:failure", (_event, message) => listener(message)),
}));
