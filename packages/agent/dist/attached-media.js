init_privacy_mode_pb();
var DEFAULT_INLINE_VIDEO_MAX_BYTES = 15 * 1024 * 1024;
var DEFAULT_SIGNED_URL_VIDEO_MAX_BYTES = 15 * 1024 * 1024;
var GEMINI_VIDEO_SUBAGENT_MAX_BYTES = 1024 * 1024 * 1024;
function getInlineVideoMaxBytes(config2) {
  return config2.featureFlags?.geminiVideoAttachmentInlineMaxBytes ?? DEFAULT_INLINE_VIDEO_MAX_BYTES;
}
function getSignedUrlVideoMaxBytes(config2) {
  return config2.featureFlags?.geminiVideoAttachmentSignedUrlMaxBytes ?? DEFAULT_SIGNED_URL_VIDEO_MAX_BYTES;
}
function isSignedUrlStorageAllowed(privacyMode) {
  return privacyMode === PrivacyMode.NO_TRAINING || privacyMode === PrivacyMode.USAGE_DATA_TRAINING_ALLOWED || privacyMode === PrivacyMode.USAGE_CODEBASE_TRAINING_ALLOWED;
}
function isGeminiModelId(modelId) {
  if (!modelId) {
    return false;
  }
  return modelId.toLowerCase().includes("gemini");
}
async function uploadAttachedMediaToSignedUrl(options2) {
  const body = options2.data;
  const response = await fetch(options2.putUrl, {
    method: "PUT",
    body,
    headers: {
      "Content-Type": options2.mimeType
    },
    signal: options2.signal
  });
  if (!response.ok) {
    throw new Error(`Failed to upload attached media: ${response.status} ${response.statusText}`);
  }
}
