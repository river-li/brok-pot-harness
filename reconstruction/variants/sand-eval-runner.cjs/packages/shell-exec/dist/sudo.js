/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/sudo.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function shouldEnableSudoAskpass(env) {
  if (isWindows2) {
    return false;
  }
  return !!env?.SUDO_ASKPASS;
}
function getSudoAliasInjection(env) {
  return shouldEnableSudoAskpass(env) ? `${SUDO_ALIAS}; ` : "";
}
function transformSudoCommand(command) {
  const result = [];
  let i = 0;
  while (i < command.length) {
    const isCommandStart = i === 0 || command.slice(Math.max(0, i - 2), i) === "&&" || command.slice(Math.max(0, i - 2), i) === "||" || command[i - 1] === "|" || command[i - 1] === ";";
    const lookbackStart = Math.max(0, i - 10);
    const lookback = command.slice(lookbackStart, i);
    const isAfterOperator = /(?:&&|\|\||[|;])\s*$/.test(lookback) || i === 0 && /^\s*$/.test(lookback);
    if ((isCommandStart || isAfterOperator) && command.slice(i, i + 4) === "sudo") {
      const afterSudo = i + 4;
      if (afterSudo >= command.length || /\s/.test(command[afterSudo])) {
        let j2 = afterSudo;
        while (j2 < command.length && /\s/.test(command[j2])) {
          j2++;
        }
        let hasAFlag = false;
        if (j2 < command.length && command[j2] === "-") {
          let flagEnd = j2 + 1;
          while (flagEnd < command.length && /[^\s]/.test(command[flagEnd])) {
            flagEnd++;
          }
          const flag = command.slice(j2, flagEnd);
          hasAFlag = /^-[a-zA-Z]*A[a-zA-Z]*$/.test(flag);
        }
        if (hasAFlag) {
          result.push("sudo");
          i = afterSudo;
        } else {
          result.push("sudo -A");
          i = afterSudo;
        }
        continue;
      }
    }
    result.push(command[i]);
    i++;
  }
  return result.join("");
}
var isWindows2, SUDO_ALIAS;
var init_sudo = __esm({
  "../packages/shell-exec/dist/sudo.js"() {
    "use strict";
    isWindows2 = process.platform === "win32";
    SUDO_ALIAS = "alias sudo='sudo -A'";
  }
});

