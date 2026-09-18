init_errors();
var BotTemplateShareEmptyResponse = class extends SandDomainError {
  name = "BotTemplateShareEmptyResponse";
  constructor(rpc) {
    super(`${rpc} returned no template`);
  }
};
var BotTemplateShareBlobUploadFailed = class extends SandDomainError {
  name = "BotTemplateShareBlobUploadFailed";
  constructor(detail) {
    super(`Grok Bot template blob upload failed: ${detail}`);
  }
};
var BotTemplateShareBlobDownloadFailed = class extends SandDomainError {
  name = "BotTemplateShareBlobDownloadFailed";
  constructor(detail) {
    super(`Grok Bot template blob download failed: ${detail}`);
  }
};
var BotTemplateShareRecipeInvalid = class extends SandDomainError {
  name = "BotTemplateShareRecipeInvalid";
  constructor(detail, options2) {
    super(`Grok Bot template recipe is invalid: ${detail}`, options2);
  }
};
