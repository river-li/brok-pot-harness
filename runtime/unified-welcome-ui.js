"use strict";
let mode = null;
let configured = false;
const status = document.getElementById("status");
const submit = document.getElementById("continue");
function choose(next) {
  mode = next;
  for (const name of ["local", "remote"]) document.getElementById(name).classList.toggle("selected", name === mode);
  document.getElementById("settings").classList.toggle("open", mode === "local" && !configured);
  submit.disabled = false;
  status.textContent = "";
}
for (const name of ["local", "remote"]) document.getElementById(name).addEventListener("click", () => choose(name));
window.brokpot.initial().then((state) => {
  configured = state.configured;
  if (state.selectedMode) choose(state.selectedMode);
}).catch((error) => { status.textContent = error.message; status.classList.add("error"); });
window.brokpot.onProgress((message) => { status.textContent = message; status.classList.remove("error"); });
window.brokpot.onFailure((message) => { status.textContent = message; status.classList.add("error"); submit.disabled = false; });
submit.addEventListener("click", async () => {
  if (!mode) return;
  submit.disabled = true;
  status.textContent = mode === "local" ? "Preparing your local runtime…" : "Opening server connection…";
  status.classList.remove("error");
  const settings = mode === "local" && !configured ? {
    url: document.getElementById("url").value.trim(),
    model: document.getElementById("model").value.trim(),
    key: document.getElementById("key").value.trim(),
  } : null;
  const result = await window.brokpot.choose({ mode, settings });
  if (result.error) { status.textContent = result.error; status.classList.add("error"); submit.disabled = false; }
});
