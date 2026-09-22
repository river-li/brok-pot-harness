/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/cloud-agents/replace-env/replace-env.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var replaceEnvToolModes = ["custom", "clean_slate", "default"];
var parametersSchema8 = external_exports.object({
  mode: external_exports.enum(replaceEnvToolModes).optional().describe("How to configure the replacement environment. Use `custom` (default) to provide a new install script and optional Dockerfile, `clean_slate` for the default base image with no install script or existing environment config, or `default` to re-read the repo/saved environment config without applying an override."),
  checkout_ref_overrides: external_exports.array(external_exports.object({
    repo_url: external_exports.string().describe("Repo to override. Any common form works (https/ssh/scp-style URL, `host/owner/repo`, or bare `owner/repo`); it is canonicalized before matching against the agent's repos."),
    ref: external_exports.string().describe("Branch, tag, or commit SHA to check out for this repo. A SHA results in a detached HEAD. It must already exist on the remote (commit and push first).")
  })).optional().describe("Optional, applies to all modes. Per-repo overrides for the git ref the replacement environment is rebuilt from, replacing whatever was pinned in the original start request. The ref determines where `.cursor/environment.json` is read from and the commit the new pod is built at. Only list the repos you want to override; unlisted repos keep their original ref. Commit and push your changes to the target ref first, since it is resolved from the remote. The tool call fails fast if a `repo_url` matches no known repo (or matches ambiguously) or if a `ref` is malformed; a ref that does not exist on the remote is not pre-checked and instead fails later while rebuilding the pod."),
  config: external_exports.object({
    install_script: external_exports.string().optional().describe("Required when mode is `custom`. Shell script to run while preparing the replacement environment. Use a single command for simple setups or a multiline script with one command per line for more complex installs. Leave unset for `clean_slate` and `default`."),
    dockerfile_contents: external_exports.string().optional().describe("Optional only when mode is `custom`. Inline Dockerfile contents used to build the replacement pod's base image before the install script runs. Leave unset to use the default base image. Ignored for `clean_slate` and `default`.")
  }).optional().describe("Environment configuration for `custom` mode: an install script and optional inline Dockerfile. Omit for `clean_slate` and `default`.")
}).superRefine((args, ctx) => {
  const mode = args.mode ?? "custom";
  if (mode === "custom" && (args.config?.install_script === void 0 || args.config.install_script.trim().length === 0)) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["config", "install_script"],
      message: "`install_script` must be a non-empty string in custom mode"
    });
  }
  if (mode === "custom" && args.config?.dockerfile_contents !== void 0 && args.config.dockerfile_contents.trim().length === 0) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["config", "dockerfile_contents"],
      message: "`dockerfile_contents` must be non-empty when provided in custom mode"
    });
  }
  args.checkout_ref_overrides?.forEach((override, index) => {
    if (override.repo_url.trim().length === 0) {
      ctx.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["checkout_ref_overrides", index, "repo_url"],
        message: "`repo_url` must be a non-empty string"
      });
    }
    if (override.ref.trim().length === 0) {
      ctx.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["checkout_ref_overrides", index, "ref"],
        message: "`ref` must be a non-empty string"
      });
    }
  });
}).describe("Replace the cloud-agent environment using an explicit mode: `custom`, `clean_slate`, or `default`.");

