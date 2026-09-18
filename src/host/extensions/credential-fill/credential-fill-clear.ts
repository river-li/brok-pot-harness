var import_node_crypto45 = require("node:crypto");
function passwordDigest(password) {
  return (0, import_node_crypto45.createHash)("sha256").update(password, "utf8").digest("hex");
}
async function clearFilledSecretsInPage(secrets, settle) {
  const collectInputs = () => {
    const inputs = [];
    const visit2 = (root) => {
      inputs.push(...root.querySelectorAll("input"));
      for (const element of root.querySelectorAll("*")) {
        if (element.shadowRoot !== null) visit2(element.shadowRoot);
      }
    };
    visit2(document);
    return inputs;
  };
  const subtle = globalThis.crypto?.subtle;
  const digestOf = async (value) => {
    if (subtle === void 0) return null;
    const bytes = new Uint8Array(await subtle.digest("SHA-256", new TextEncoder().encode(value)));
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  };
  const nativeValueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  )?.set;
  const valueless = /* @__PURE__ */ new Set([
    "button",
    "checkbox",
    "color",
    "file",
    "image",
    "radio",
    "range",
    "reset",
    "submit"
  ]);
  const holdsValue2 = (input) => !valueless.has(input.type.toLowerCase()) && input.value.length > 0;
  const holdsSecretValue = async (input) => {
    if (!holdsValue2(input)) return false;
    const digest = await digestOf(input.value);
    if (digest === null) return input.type.toLowerCase() === "password";
    return digest === secrets.passwordDigest || digest === secrets.oneTimeCodeDigest;
  };
  const splitCodeBoxes = async (inputs) => {
    const boxes = /* @__PURE__ */ new Set();
    const length = secrets.oneTimeCodeLength ?? 0;
    if (secrets.oneTimeCodeDigest === void 0 || length < 2) return boxes;
    const singles = inputs.filter((input) => holdsValue2(input) && input.value.length === 1);
    for (let start = 0; start + length <= singles.length; start += 1) {
      const window2 = singles.slice(start, start + length);
      const digest = await digestOf(window2.map((input) => input.value).join(""));
      if (digest !== secrets.oneTimeCodeDigest) continue;
      for (const box of window2) boxes.add(box);
    }
    return boxes;
  };
  const secretInputs = async () => {
    const inputs = collectInputs();
    const boxes = await splitCodeBoxes(inputs);
    const found = [];
    for (const input of inputs) {
      if (boxes.has(input) || await holdsSecretValue(input)) found.push(input);
    }
    return found;
  };
  const clearMatching = async () => {
    if (nativeValueSetter === void 0) return;
    for (const input of await secretInputs()) {
      nativeValueSetter.call(input, "");
      input.dispatchEvent(
        new InputEvent("input", { bubbles: true, composed: true, inputType: "insertText" })
      );
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };
  const residue = async () => (await secretInputs()).length > 0;
  await clearMatching();
  await settle();
  if (!await residue()) return { cleared: true };
  await clearMatching();
  await settle();
  return { cleared: !await residue() };
}
