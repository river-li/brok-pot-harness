/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/sand-cloud-agent-auto-review.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto78 = require("node:crypto");
init_smart_mode_classifier_exec_pb();
var SAND_CLOUD_AGENT_CLASSIFIER_TARGET_ACTION = "sand_cloud_agent";
var SAND_CLOUD_AGENT_CLASSIFIER_ERROR_REASON = "An error occurred while reviewing this cloud agent action. Please review manually.";
var SAND_CLOUD_AGENT_AUTO_REVIEW_ACTIONS = [
  "launch",
  "reply",
  "rename",
  "delete",
  "watch"
];
var REVIEWABLE_ACTIONS = new Set(SAND_CLOUD_AGENT_AUTO_REVIEW_ACTIONS);
function isSandCloudAgentAutoReviewAction(action) {
  return REVIEWABLE_ACTIONS.has(action);
}
function describeSandCloudAgentReviewImages(urls, images) {
  return images.map((image2, index) => ({
    url: image2.path ?? urls[index] ?? `image-${index}`,
    ...image2.mimeType !== void 0 ? { mimeType: image2.mimeType } : {},
    byteLength: image2.data.byteLength,
    sha256: (0, import_node_crypto78.createHash)("sha256").update(image2.data).digest("hex")
  }));
}
function describeSandCloudAgentReviewFiles(files) {
  return files.map((file2) => ({
    url: file2.path,
    kind: file2.kind,
    filename: file2.filename,
    mimeType: file2.mimeType,
    byteLength: file2.data.byteLength,
    sha256: (0, import_node_crypto78.createHash)("sha256").update(file2.data).digest("hex")
  }));
}
function buildSandCloudAgentReviewTarget(args, attachments = {}) {
  if (!isSandCloudAgentAutoReviewAction(args.action)) return void 0;
  const { images = [], files = [], sessionManaged } = attachments;
  const prompt = args.prompt?.trim() ?? "";
  const managed = sessionManaged === void 0 ? {} : { sessionManaged };
  const attachedFiles = files.length === 0 ? {} : { files };
  if (args.action === "rename") {
    const title = args.title?.trim() ?? "";
    if (title.length === 0) return void 0;
    return {
      action: args.action,
      prompt,
      title,
      ...args.agent_id !== void 0 ? { agentId: args.agent_id } : {},
      ...managed,
      images,
      ...attachedFiles
    };
  }
  if (args.action === "delete" || args.action === "watch") {
    const agentId = args.agent_id?.trim() ?? "";
    if (agentId.length === 0) return void 0;
    return { action: args.action, prompt, agentId, ...managed, images, ...attachedFiles };
  }
  if (prompt.length === 0) return void 0;
  const repoUrl = args.repo?.trim() || args.repo_url?.trim() || void 0;
  const isCanvas = args.is_canvas === true;
  return {
    action: args.action,
    prompt,
    ...repoUrl !== void 0 ? { repoUrl } : {},
    ...args.new_repo === true || isCanvas ? { newRepo: true } : {},
    ...isCanvas ? { isCanvas } : {},
    ...args.project === true ? { project: true } : {},
    ...args.starting_ref !== void 0 ? { startingRef: args.starting_ref } : {},
    ...args.model !== void 0 ? { model: args.model } : {},
    ...args.model_params !== void 0 ? { modelParams: args.model_params } : {},
    ...args.title !== void 0 ? { title: args.title } : {},
    ...args.environment !== void 0 ? { environment: args.environment } : {},
    ...args.agent_id !== void 0 ? { agentId: args.agent_id } : {},
    ...args.interrupt !== void 0 ? { interrupt: args.interrupt } : {},
    ...args.mode !== void 0 ? { mode: args.mode } : {},
    ...managed,
    images,
    ...attachedFiles
  };
}
function buildSandCloudAgentRiskTarget(args) {
  const { target } = args;
  return new SmartModeRiskTarget({
    action: SAND_CLOUD_AGENT_CLASSIFIER_TARGET_ACTION,
    arguments: structFromRecord({
      surface: "cloud_agent",
      action: target.action,
      prompt: target.prompt,
      repo_url: target.repoUrl,
      new_repo: target.newRepo,
      is_canvas: target.isCanvas,
      project: target.project,
      starting_ref: target.startingRef,
      model: target.model,
      model_params: target.modelParams,
      title: target.title,
      environment: target.environment,
      agent_id: target.agentId,
      interrupt: target.interrupt,
      mode: target.mode,
      session_managed: target.sessionManaged,
      image_count: target.images.length,
      images: target.images.map((image2) => ({
        url: image2.url,
        mime_type: image2.mimeType,
        byte_length: image2.byteLength,
        sha256: image2.sha256
      })),
      file_count: (target.files ?? []).length,
      files: (target.files ?? []).map((file2) => ({
        url: file2.url,
        kind: file2.kind,
        filename: file2.filename,
        mime_type: file2.mimeType,
        byte_length: file2.byteLength,
        sha256: file2.sha256
      })),
      project_permissions: buildProjectPermissionsContext({
        personalInstructions: args.personalInstructions,
        userAutoRunInstructions: args.userAutoRunInstructions,
        projectAutoRunInstructions: args.projectAutoRunInstructions
      })
    })
  });
}
var SAND_CLOUD_AGENT_REVIEW_SPEC = {
  surface: "cloud_agent",
  classifierErrorReason: SAND_CLOUD_AGENT_CLASSIFIER_ERROR_REASON,
  buildRiskTarget: buildSandCloudAgentRiskTarget,
  fingerprintPayload: (target) => ({
    action: target.action,
    prompt: target.prompt,
    repoUrl: target.repoUrl,
    newRepo: target.newRepo,
    isCanvas: target.isCanvas,
    project: target.project,
    startingRef: target.startingRef,
    model: target.model,
    modelParams: target.modelParams,
    title: target.title,
    environment: target.environment,
    agentId: target.agentId,
    interrupt: target.interrupt,
    mode: target.mode,
    images: target.images,
    files: target.files
  }),
  summarize: (target) => summarizeSandCloudAgentAction({
    ...target,
    imageCount: target.images.length,
    fileCount: (target.files ?? []).length
  }),
  abortPolicy: { kind: "deny", reason: "The cloud agent action was cancelled." }
};
async function reviewSandCloudAgentAction(args) {
  const decision = await runSandAutoReviewFlow({ ...args, spec: SAND_CLOUD_AGENT_REVIEW_SPEC });
  return decision.allowed === false ? decision : { allowed: true };
}

