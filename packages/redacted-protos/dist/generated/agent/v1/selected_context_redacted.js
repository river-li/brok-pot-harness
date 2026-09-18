init_selected_context_pb();
function toRedactedSelectedImage(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    uuid: msg.uuid,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    dimension: msg.dimension !== void 0 ? toRedactedSelectedImage_Dimension(msg.dimension, privacyMode) : void 0,
    mimeType: msg.mimeType,
    dataOrBlobId: toRedactedSelectedImage_data_or_blob_id(msg.dataOrBlobId, privacyMode)
  };
}
function toRedactedSelectedImage_data_or_blob_id(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "blobId":
      return { case: "blobId", value: oneof.value };
    case "data":
      return { case: "data", value: createRedactedBytes(oneof.value, DataClassification.CODE, "data", privacyMode) };
    case "blobIdWithData":
      return { case: "blobIdWithData", value: toRedactedSelectedImage_BlobIdWithData(oneof.value, privacyMode) };
    case "promptUploadRef":
      return { case: "promptUploadRef", value: toRedactedPromptUploadRef(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSelectedImage(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedImage({
    uuid: msg.uuid,
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    dimension: msg.dimension !== void 0 ? fromRedactedSelectedImage_Dimension(msg.dimension, purpose, opts) : void 0,
    mimeType: msg.mimeType,
    dataOrBlobId: fromRedactedSelectedImage_data_or_blob_id(msg.dataOrBlobId, purpose, opts)
  });
}
function fromRedactedSelectedImage_data_or_blob_id(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "blobId":
      return { case: "blobId", value: oneof.value };
    case "data":
      return { case: "data", value: oneof.value.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }) };
    case "blobIdWithData":
      return { case: "blobIdWithData", value: fromRedactedSelectedImage_BlobIdWithData(oneof.value, purpose, opts) };
    case "promptUploadRef":
      return { case: "promptUploadRef", value: fromRedactedPromptUploadRef(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSelectedImage_BlobIdWithData(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    blobId: msg.blobId,
    data: createRedactedBytes(msg.data, DataClassification.CODE, "data", privacyMode)
  };
}
function fromRedactedSelectedImage_BlobIdWithData(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedImage_BlobIdWithData({
    blobId: msg.blobId,
    data: msg.data.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSelectedImage_Dimension(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    width: msg.width,
    height: msg.height
  };
}
function fromRedactedSelectedImage_Dimension(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedImage_Dimension({
    width: msg.width,
    height: msg.height
  });
}
function toRedactedPromptUploadRef(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    uploadId: msg.uploadId
  };
}
function fromRedactedPromptUploadRef(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PromptUploadRef({
    uploadId: msg.uploadId
  });
}
function toRedactedSelectedDocument(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    uuid: msg.uuid,
    filename: createRedactedString(msg.filename, DataClassification.PATH, "filename", privacyMode),
    mimeType: msg.mimeType,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    dataOrBlobId: toRedactedSelectedDocument_data_or_blob_id(msg.dataOrBlobId, privacyMode)
  };
}
function toRedactedSelectedDocument_data_or_blob_id(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "blobId":
      return { case: "blobId", value: oneof.value };
    case "data":
      return { case: "data", value: createRedactedBytes(oneof.value, DataClassification.CODE, "data", privacyMode) };
    case "blobIdWithData":
      return { case: "blobIdWithData", value: toRedactedSelectedDocument_BlobIdWithData(oneof.value, privacyMode) };
    case "promptUploadRef":
      return { case: "promptUploadRef", value: toRedactedPromptUploadRef(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSelectedDocument(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedDocument({
    uuid: msg.uuid,
    filename: msg.filename.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    mimeType: msg.mimeType,
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    dataOrBlobId: fromRedactedSelectedDocument_data_or_blob_id(msg.dataOrBlobId, purpose, opts)
  });
}
function fromRedactedSelectedDocument_data_or_blob_id(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "blobId":
      return { case: "blobId", value: oneof.value };
    case "data":
      return { case: "data", value: oneof.value.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }) };
    case "blobIdWithData":
      return { case: "blobIdWithData", value: fromRedactedSelectedDocument_BlobIdWithData(oneof.value, purpose, opts) };
    case "promptUploadRef":
      return { case: "promptUploadRef", value: fromRedactedPromptUploadRef(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSelectedDocument_BlobIdWithData(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    blobId: msg.blobId,
    data: createRedactedBytes(msg.data, DataClassification.CODE, "data", privacyMode)
  };
}
function fromRedactedSelectedDocument_BlobIdWithData(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedDocument_BlobIdWithData({
    blobId: msg.blobId,
    data: msg.data.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSelectedVideo(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    uuid: msg.uuid,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    fps: msg.fps,
    mimeType: msg.mimeType,
    filename: createRedactedString(msg.filename, DataClassification.PATH, "filename", privacyMode),
    materializeToFilesystem: msg.materializeToFilesystem,
    dataOrBlobId: toRedactedSelectedVideo_data_or_blob_id(msg.dataOrBlobId, privacyMode)
  };
}
function toRedactedSelectedVideo_data_or_blob_id(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "blobId":
      return { case: "blobId", value: oneof.value };
    case "data":
      return { case: "data", value: createRedactedBytes(oneof.value, DataClassification.CODE, "data", privacyMode) };
    case "blobIdWithData":
      return { case: "blobIdWithData", value: toRedactedSelectedVideo_BlobIdWithData(oneof.value, privacyMode) };
    case "signedUrl":
      return { case: "signedUrl", value: toRedactedSelectedVideo_SignedUrl(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSelectedVideo(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedVideo({
    uuid: msg.uuid,
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    fps: msg.fps,
    mimeType: msg.mimeType,
    filename: msg.filename.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    materializeToFilesystem: msg.materializeToFilesystem,
    dataOrBlobId: fromRedactedSelectedVideo_data_or_blob_id(msg.dataOrBlobId, purpose, opts)
  });
}
function fromRedactedSelectedVideo_data_or_blob_id(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "blobId":
      return { case: "blobId", value: oneof.value };
    case "data":
      return { case: "data", value: oneof.value.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }) };
    case "blobIdWithData":
      return { case: "blobIdWithData", value: fromRedactedSelectedVideo_BlobIdWithData(oneof.value, purpose, opts) };
    case "signedUrl":
      return { case: "signedUrl", value: fromRedactedSelectedVideo_SignedUrl(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSelectedVideo_BlobIdWithData(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    blobId: msg.blobId,
    data: createRedactedBytes(msg.data, DataClassification.CODE, "data", privacyMode)
  };
}
function fromRedactedSelectedVideo_BlobIdWithData(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedVideo_BlobIdWithData({
    blobId: msg.blobId,
    data: msg.data.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSelectedVideo_SignedUrl(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    url: createRedactedString(msg.url, DataClassification.CREDENTIALS, "url", privacyMode),
    key: msg.key,
    expiresAtUnixMs: msg.expiresAtUnixMs,
    refreshAfterUnixMs: msg.refreshAfterUnixMs,
    conversationId: msg.conversationId
  };
}
function fromRedactedSelectedVideo_SignedUrl(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedVideo_SignedUrl({
    url: msg.url.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    key: msg.key,
    expiresAtUnixMs: msg.expiresAtUnixMs,
    refreshAfterUnixMs: msg.refreshAfterUnixMs,
    conversationId: msg.conversationId
  });
}
function toRedactedExtraContextEntry(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    dataOrBlobId: toRedactedExtraContextEntry_data_or_blob_id(msg.dataOrBlobId, privacyMode)
  };
}
function toRedactedExtraContextEntry_data_or_blob_id(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "data":
      return { case: "data", value: createRedactedString(oneof.value, DataClassification.CODE, "data", privacyMode) };
    case "blobId":
      return { case: "blobId", value: oneof.value };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedExtraContextEntry(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ExtraContextEntry({
    dataOrBlobId: fromRedactedExtraContextEntry_data_or_blob_id(msg.dataOrBlobId, purpose, opts)
  });
}
function fromRedactedExtraContextEntry_data_or_blob_id(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "data":
      return { case: "data", value: oneof.value.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }) };
    case "blobId":
      return { case: "blobId", value: oneof.value };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSelectedFile(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode),
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    relativePath: msg.relativePath !== void 0 ? createRedactedString(msg.relativePath, DataClassification.PATH, "relative_path", privacyMode) : void 0
  };
}
function fromRedactedSelectedFile(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedFile({
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    relativePath: msg.relativePath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSelectedCodeSelection(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode),
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    relativePath: msg.relativePath !== void 0 ? createRedactedString(msg.relativePath, DataClassification.PATH, "relative_path", privacyMode) : void 0,
    range: msg.range !== void 0 ? toRedactedRange(msg.range, privacyMode) : void 0
  };
}
function fromRedactedSelectedCodeSelection(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedCodeSelection({
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    relativePath: msg.relativePath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    range: msg.range !== void 0 ? fromRedactedRange(msg.range, purpose, opts) : void 0
  });
}
function toRedactedSelectedTerminal(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode),
    title: msg.title !== void 0 ? createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode) : void 0,
    path: msg.path !== void 0 ? createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode) : void 0
  };
}
function fromRedactedSelectedTerminal(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedTerminal({
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    title: msg.title?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    path: msg.path?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSelectedTerminalSelection(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode),
    title: msg.title !== void 0 ? createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode) : void 0,
    path: msg.path !== void 0 ? createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode) : void 0,
    range: msg.range !== void 0 ? toRedactedRange(msg.range, privacyMode) : void 0
  };
}
function fromRedactedSelectedTerminalSelection(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedTerminalSelection({
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    title: msg.title?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    path: msg.path?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    range: msg.range !== void 0 ? fromRedactedRange(msg.range, purpose, opts) : void 0
  });
}
function toRedactedSelectedFolder(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    relativePath: msg.relativePath !== void 0 ? createRedactedString(msg.relativePath, DataClassification.PATH, "relative_path", privacyMode) : void 0,
    directoryTree: msg.directoryTree !== void 0 ? toRedactedLsDirectoryTreeNode(msg.directoryTree, privacyMode) : void 0
  };
}
function fromRedactedSelectedFolder(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedFolder({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    relativePath: msg.relativePath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    directoryTree: msg.directoryTree !== void 0 ? fromRedactedLsDirectoryTreeNode(msg.directoryTree, purpose, opts) : void 0
  });
}
function toRedactedSelectedExternalLink(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    url: msg.url,
    uuid: msg.uuid,
    pdfContent: msg.pdfContent !== void 0 ? createRedactedString(msg.pdfContent, DataClassification.CODE, "pdf_content", privacyMode) : void 0,
    isPdf: msg.isPdf,
    filename: msg.filename !== void 0 ? createRedactedString(msg.filename, DataClassification.PATH, "filename", privacyMode) : void 0,
    blobId: msg.blobId
  };
}
function fromRedactedSelectedExternalLink(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedExternalLink({
    url: msg.url,
    uuid: msg.uuid,
    pdfContent: msg.pdfContent?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    isPdf: msg.isPdf,
    filename: msg.filename?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    blobId: msg.blobId !== void 0 ? msg.blobId : void 0
  });
}
function toRedactedSelectedCursorRule(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    rule: msg.rule !== void 0 ? toRedactedCursorRule(msg.rule, privacyMode) : void 0
  };
}
function fromRedactedSelectedCursorRule(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedCursorRule({
    rule: msg.rule !== void 0 ? fromRedactedCursorRule(msg.rule, purpose, opts) : void 0
  });
}
function toRedactedSelectedGitDiff(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode),
    fullContentLengthCharCount: msg.fullContentLengthCharCount
  };
}
function fromRedactedSelectedGitDiff(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedGitDiff({
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    fullContentLengthCharCount: msg.fullContentLengthCharCount
  });
}
function toRedactedSelectedGitDiffFromBranchToMain(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode),
    fullContentLengthCharCount: msg.fullContentLengthCharCount
  };
}
function fromRedactedSelectedGitDiffFromBranchToMain(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedGitDiffFromBranchToMain({
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    fullContentLengthCharCount: msg.fullContentLengthCharCount
  });
}
function toRedactedSelectedGitCommit(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    sha: msg.sha,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode),
    description: msg.description !== void 0 ? createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode) : void 0,
    diff: createRedactedString(msg.diff, DataClassification.CODE, "diff", privacyMode)
  };
}
function fromRedactedSelectedGitCommit(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedGitCommit({
    sha: msg.sha,
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    description: msg.description?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    diff: msg.diff.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSelectedPullRequest(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    number: msg.number,
    url: msg.url,
    title: msg.title !== void 0 ? createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode) : void 0,
    folderPath: createRedactedString(msg.folderPath, DataClassification.PATH, "folder_path", privacyMode),
    summaryJson: msg.summaryJson !== void 0 ? createRedactedString(msg.summaryJson, DataClassification.CODE, "summary_json", privacyMode) : void 0,
    description: msg.description !== void 0 ? createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode) : void 0,
    blobId: msg.blobId
  };
}
function fromRedactedSelectedPullRequest(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedPullRequest({
    number: msg.number,
    url: msg.url,
    title: msg.title?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    folderPath: msg.folderPath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    summaryJson: msg.summaryJson?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    description: msg.description?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    blobId: msg.blobId !== void 0 ? msg.blobId : void 0
  });
}
function toRedactedSelectedGitPRDiffSelection(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    prUrl: msg.prUrl,
    filePath: createRedactedString(msg.filePath, DataClassification.PATH, "file_path", privacyMode),
    startLine: msg.startLine,
    endLine: msg.endLine,
    diffContent: msg.diffContent !== void 0 ? createRedactedString(msg.diffContent, DataClassification.CODE, "diff_content", privacyMode) : void 0,
    blobId: msg.blobId
  };
}
function fromRedactedSelectedGitPRDiffSelection(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedGitPRDiffSelection({
    prUrl: msg.prUrl,
    filePath: msg.filePath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    startLine: msg.startLine,
    endLine: msg.endLine,
    diffContent: msg.diffContent?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    blobId: msg.blobId !== void 0 ? msg.blobId : void 0
  });
}
function toRedactedSelectedPluginCapabilityRef(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    pluginId: msg.pluginId,
    capabilityType: msg.capabilityType,
    sourcePath: createRedactedString(msg.sourcePath, DataClassification.PATH, "source_path", privacyMode),
    snapshotToken: createRedactedString(msg.snapshotToken, DataClassification.CREDENTIALS, "snapshot_token", privacyMode),
    resolvedCommitSha: msg.resolvedCommitSha
  };
}
function fromRedactedSelectedPluginCapabilityRef(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedPluginCapabilityRef({
    pluginId: msg.pluginId,
    capabilityType: msg.capabilityType,
    sourcePath: msg.sourcePath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    snapshotToken: msg.snapshotToken.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    resolvedCommitSha: msg.resolvedCommitSha
  });
}
function toRedactedSelectedCursorCommand(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    name: msg.name,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode),
    pluginCapability: msg.pluginCapability !== void 0 ? toRedactedSelectedPluginCapabilityRef(msg.pluginCapability, privacyMode) : void 0,
    fullPath: msg.fullPath !== void 0 ? createRedactedString(msg.fullPath, DataClassification.PATH, "full_path", privacyMode) : void 0,
    displayName: msg.displayName
  };
}
function fromRedactedSelectedCursorCommand(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedCursorCommand({
    name: msg.name,
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    pluginCapability: msg.pluginCapability !== void 0 ? fromRedactedSelectedPluginCapabilityRef(msg.pluginCapability, purpose, opts) : void 0,
    fullPath: msg.fullPath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    displayName: msg.displayName
  });
}
function toRedactedSelectedDocumentation(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    docId: msg.docId,
    name: msg.name
  };
}
function fromRedactedSelectedDocumentation(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedDocumentation({
    docId: msg.docId,
    name: msg.name
  });
}
function toRedactedSelectedPastChat(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    agentId: msg.agentId,
    name: msg.name
  };
}
function fromRedactedSelectedPastChat(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedPastChat({
    agentId: msg.agentId,
    name: msg.name
  });
}
function toRedactedRecentAgent(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    name: msg.name,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    overview: msg.overview !== void 0 ? createRedactedString(msg.overview, DataClassification.CODE, "overview", privacyMode) : void 0
  };
}
function fromRedactedRecentAgent(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecentAgent({
    name: msg.name,
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    overview: msg.overview?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedRecentAgentsContext(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    recentAgents: msg.recentAgents.map((v2) => toRedactedRecentAgent(v2, privacyMode))
  };
}
function fromRedactedRecentAgentsContext(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecentAgentsContext({
    recentAgents: msg.recentAgents.map((v2) => fromRedactedRecentAgent(v2, purpose, opts))
  });
}
function toRedactedCallFrame(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    functionName: msg.functionName !== void 0 ? createRedactedString(msg.functionName, DataClassification.CODE, "function_name", privacyMode) : void 0,
    url: msg.url,
    lineNumber: msg.lineNumber,
    columnNumber: msg.columnNumber
  };
}
function fromRedactedCallFrame(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CallFrame({
    functionName: msg.functionName?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    url: msg.url,
    lineNumber: msg.lineNumber,
    columnNumber: msg.columnNumber
  });
}
function toRedactedStackTrace(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    callFrames: msg.callFrames.map((v2) => toRedactedCallFrame(v2, privacyMode)),
    rawStackTrace: msg.rawStackTrace !== void 0 ? createRedactedString(msg.rawStackTrace, DataClassification.CODE, "raw_stack_trace", privacyMode) : void 0
  };
}
function fromRedactedStackTrace(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StackTrace({
    callFrames: msg.callFrames.map((v2) => fromRedactedCallFrame(v2, purpose, opts)),
    rawStackTrace: msg.rawStackTrace?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSelectedConsoleLog(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode),
    timestamp: msg.timestamp,
    level: msg.level,
    clientName: msg.clientName,
    sessionId: msg.sessionId,
    stackTrace: msg.stackTrace !== void 0 ? toRedactedStackTrace(msg.stackTrace, privacyMode) : void 0,
    objectDataJson: msg.objectDataJson !== void 0 ? createRedactedString(msg.objectDataJson, DataClassification.CODE, "object_data_json", privacyMode) : void 0
  };
}
function fromRedactedSelectedConsoleLog(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedConsoleLog({
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    timestamp: msg.timestamp,
    level: msg.level,
    clientName: msg.clientName,
    sessionId: msg.sessionId,
    stackTrace: msg.stackTrace !== void 0 ? fromRedactedStackTrace(msg.stackTrace, purpose, opts) : void 0,
    objectDataJson: msg.objectDataJson?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSelectedUIElement(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    element: createRedactedString(msg.element, DataClassification.CODE, "element", privacyMode),
    xpath: createRedactedString(msg.xpath, DataClassification.CODE, "xpath", privacyMode),
    textContent: createRedactedString(msg.textContent, DataClassification.CODE, "text_content", privacyMode),
    extra: createRedactedString(msg.extra, DataClassification.CODE, "extra", privacyMode),
    component: msg.component !== void 0 ? createRedactedString(msg.component, DataClassification.CODE, "component", privacyMode) : void 0,
    componentPropsJson: msg.componentPropsJson !== void 0 ? createRedactedString(msg.componentPropsJson, DataClassification.CODE, "component_props_json", privacyMode) : void 0
  };
}
function fromRedactedSelectedUIElement(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedUIElement({
    element: msg.element.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    xpath: msg.xpath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    textContent: msg.textContent.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    extra: msg.extra.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    component: msg.component?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    componentPropsJson: msg.componentPropsJson?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSelectedSubagent(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    name: msg.name
  };
}
function fromRedactedSelectedSubagent(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedSubagent({
    name: msg.name
  });
}
function toRedactedSelectedBrowser(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    browserId: msg.browserId,
    url: msg.url,
    pageTitle: msg.pageTitle !== void 0 ? createRedactedString(msg.pageTitle, DataClassification.CODE, "page_title", privacyMode) : void 0
  };
}
function fromRedactedSelectedBrowser(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedBrowser({
    browserId: msg.browserId,
    url: msg.url,
    pageTitle: msg.pageTitle?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSelectedAgenticGitActionCommitParams(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    filesToCommit: msg.filesToCommit.map((v2) => createRedactedString(v2, DataClassification.PATH, "files_to_commit", privacyMode)),
    filesToExcludeFromCommit: msg.filesToExcludeFromCommit.map((v2) => createRedactedString(v2, DataClassification.PATH, "files_to_exclude_from_commit", privacyMode)),
    shouldStageAllChanges: msg.shouldStageAllChanges,
    createPrDraft: msg.createPrDraft,
    filesToCommitWithStatus: msg.filesToCommitWithStatus.map((v2) => toRedactedSelectedAgenticGitFileWithStatus(v2, privacyMode)),
    filesToExcludeFromCommitWithStatus: msg.filesToExcludeFromCommitWithStatus.map((v2) => toRedactedSelectedAgenticGitFileWithStatus(v2, privacyMode))
  };
}
function fromRedactedSelectedAgenticGitActionCommitParams(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedAgenticGitActionCommitParams({
    filesToCommit: msg.filesToCommit.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    filesToExcludeFromCommit: msg.filesToExcludeFromCommit.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    shouldStageAllChanges: msg.shouldStageAllChanges,
    createPrDraft: msg.createPrDraft,
    filesToCommitWithStatus: msg.filesToCommitWithStatus.map((v2) => fromRedactedSelectedAgenticGitFileWithStatus(v2, purpose, opts)),
    filesToExcludeFromCommitWithStatus: msg.filesToExcludeFromCommitWithStatus.map((v2) => fromRedactedSelectedAgenticGitFileWithStatus(v2, purpose, opts))
  });
}
function toRedactedSelectedAgenticGitActionCreateBranchParams(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSelectedAgenticGitActionCreateBranchParams(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedAgenticGitActionCreateBranchParams({});
}
function toRedactedSelectedAgenticGitFileWithStatus(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    status: msg.status
  };
}
function fromRedactedSelectedAgenticGitFileWithStatus(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedAgenticGitFileWithStatus({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    status: msg.status
  });
}
function toRedactedSelectedAgenticGitActionPushParams(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    filesToPush: msg.filesToPush.map((v2) => createRedactedString(v2, DataClassification.PATH, "files_to_push", privacyMode)),
    createPrDraft: msg.createPrDraft
  };
}
function fromRedactedSelectedAgenticGitActionPushParams(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedAgenticGitActionPushParams({
    filesToPush: msg.filesToPush.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    createPrDraft: msg.createPrDraft
  });
}
function toRedactedSelectedAgenticGitActionFixMergeConflictsParams(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    baseBranch: msg.baseBranch,
    prUrl: msg.prUrl
  };
}
function fromRedactedSelectedAgenticGitActionFixMergeConflictsParams(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedAgenticGitActionFixMergeConflictsParams({
    baseBranch: msg.baseBranch,
    prUrl: msg.prUrl
  });
}
function toRedactedSelectedAgenticGitActionBabysitPrInCloudParams(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    baseBranch: msg.baseBranch
  };
}
function fromRedactedSelectedAgenticGitActionBabysitPrInCloudParams(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedAgenticGitActionBabysitPrInCloudParams({
    baseBranch: msg.baseBranch
  });
}
function toRedactedSelectedAgenticGitActionUpdateBranchParams(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    baseBranch: msg.baseBranch
  };
}
function fromRedactedSelectedAgenticGitActionUpdateBranchParams(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedAgenticGitActionUpdateBranchParams({
    baseBranch: msg.baseBranch
  });
}
function toRedactedSelectedAgenticGitActionPullLocallyParams(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    remoteBranch: msg.remoteBranch
  };
}
function fromRedactedSelectedAgenticGitActionPullLocallyParams(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedAgenticGitActionPullLocallyParams({
    remoteBranch: msg.remoteBranch
  });
}
function toRedactedSelectedAgenticGitAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    branchContext: msg.branchContext !== void 0 ? toRedactedSelectedGitBranchContext(msg.branchContext, privacyMode) : void 0,
    pathToTemplateFile: msg.pathToTemplateFile !== void 0 ? createRedactedString(msg.pathToTemplateFile, DataClassification.PATH, "path_to_template_file", privacyMode) : void 0,
    pathToTemplateDir: msg.pathToTemplateDir !== void 0 ? createRedactedString(msg.pathToTemplateDir, DataClassification.PATH, "path_to_template_dir", privacyMode) : void 0,
    params: toRedactedSelectedAgenticGitAction_params(msg.params, privacyMode)
  };
}
function toRedactedSelectedAgenticGitAction_params(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "commitParams":
      return { case: "commitParams", value: toRedactedSelectedAgenticGitActionCommitParams(oneof.value, privacyMode) };
    case "commitAndPushParams":
      return { case: "commitAndPushParams", value: toRedactedSelectedAgenticGitActionCommitParams(oneof.value, privacyMode) };
    case "pushParams":
      return { case: "pushParams", value: toRedactedSelectedAgenticGitActionPushParams(oneof.value, privacyMode) };
    case "createPrParams":
      return { case: "createPrParams", value: toRedactedSelectedAgenticGitActionPushParams(oneof.value, privacyMode) };
    case "createPrWithChangesParams":
      return { case: "createPrWithChangesParams", value: toRedactedSelectedAgenticGitActionCommitParams(oneof.value, privacyMode) };
    case "fixMergeConflictsParams":
      return { case: "fixMergeConflictsParams", value: toRedactedSelectedAgenticGitActionFixMergeConflictsParams(oneof.value, privacyMode) };
    case "babysitPrInCloudParams":
      return { case: "babysitPrInCloudParams", value: toRedactedSelectedAgenticGitActionBabysitPrInCloudParams(oneof.value, privacyMode) };
    case "applyLocallyParams":
      return { case: "applyLocallyParams", value: toRedactedSelectedAgenticGitActionPullLocallyParams(oneof.value, privacyMode) };
    case "checkoutBranchParams":
      return { case: "checkoutBranchParams", value: toRedactedSelectedAgenticGitActionPullLocallyParams(oneof.value, privacyMode) };
    case "createBranchAndCommitParams":
      return { case: "createBranchAndCommitParams", value: toRedactedSelectedAgenticGitActionCommitParams(oneof.value, privacyMode) };
    case "createBranchCommitAndPushParams":
      return { case: "createBranchCommitAndPushParams", value: toRedactedSelectedAgenticGitActionCommitParams(oneof.value, privacyMode) };
    case "updateBranchParams":
      return { case: "updateBranchParams", value: toRedactedSelectedAgenticGitActionUpdateBranchParams(oneof.value, privacyMode) };
    case "createBranchParams":
      return { case: "createBranchParams", value: toRedactedSelectedAgenticGitActionCreateBranchParams(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSelectedAgenticGitAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedAgenticGitAction({
    branchContext: msg.branchContext !== void 0 ? fromRedactedSelectedGitBranchContext(msg.branchContext, purpose, opts) : void 0,
    pathToTemplateFile: msg.pathToTemplateFile?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    pathToTemplateDir: msg.pathToTemplateDir?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    params: fromRedactedSelectedAgenticGitAction_params(msg.params, purpose, opts)
  });
}
function fromRedactedSelectedAgenticGitAction_params(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "commitParams":
      return { case: "commitParams", value: fromRedactedSelectedAgenticGitActionCommitParams(oneof.value, purpose, opts) };
    case "commitAndPushParams":
      return { case: "commitAndPushParams", value: fromRedactedSelectedAgenticGitActionCommitParams(oneof.value, purpose, opts) };
    case "pushParams":
      return { case: "pushParams", value: fromRedactedSelectedAgenticGitActionPushParams(oneof.value, purpose, opts) };
    case "createPrParams":
      return { case: "createPrParams", value: fromRedactedSelectedAgenticGitActionPushParams(oneof.value, purpose, opts) };
    case "createPrWithChangesParams":
      return { case: "createPrWithChangesParams", value: fromRedactedSelectedAgenticGitActionCommitParams(oneof.value, purpose, opts) };
    case "fixMergeConflictsParams":
      return { case: "fixMergeConflictsParams", value: fromRedactedSelectedAgenticGitActionFixMergeConflictsParams(oneof.value, purpose, opts) };
    case "babysitPrInCloudParams":
      return { case: "babysitPrInCloudParams", value: fromRedactedSelectedAgenticGitActionBabysitPrInCloudParams(oneof.value, purpose, opts) };
    case "applyLocallyParams":
      return { case: "applyLocallyParams", value: fromRedactedSelectedAgenticGitActionPullLocallyParams(oneof.value, purpose, opts) };
    case "checkoutBranchParams":
      return { case: "checkoutBranchParams", value: fromRedactedSelectedAgenticGitActionPullLocallyParams(oneof.value, purpose, opts) };
    case "createBranchAndCommitParams":
      return { case: "createBranchAndCommitParams", value: fromRedactedSelectedAgenticGitActionCommitParams(oneof.value, purpose, opts) };
    case "createBranchCommitAndPushParams":
      return { case: "createBranchCommitAndPushParams", value: fromRedactedSelectedAgenticGitActionCommitParams(oneof.value, purpose, opts) };
    case "updateBranchParams":
      return { case: "updateBranchParams", value: fromRedactedSelectedAgenticGitActionUpdateBranchParams(oneof.value, purpose, opts) };
    case "createBranchParams":
      return { case: "createBranchParams", value: fromRedactedSelectedAgenticGitActionCreateBranchParams(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSelectedGitBranchContext(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    currentBranch: msg.currentBranch,
    baseBranch: msg.baseBranch,
    agentBranchPrefix: msg.agentBranchPrefix
  };
}
function fromRedactedSelectedGitBranchContext(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedGitBranchContext({
    currentBranch: msg.currentBranch,
    baseBranch: msg.baseBranch,
    agentBranchPrefix: msg.agentBranchPrefix
  });
}
function toRedactedSelectedContext(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    selectedImages: msg.selectedImages.map((v2) => toRedactedSelectedImage(v2, privacyMode)),
    invocationContext: msg.invocationContext !== void 0 ? toRedactedInvocationContext(msg.invocationContext, privacyMode) : void 0,
    extraContext: msg.extraContext.map((v2) => createRedactedString(v2, DataClassification.CODE, "extra_context", privacyMode)),
    extraContextEntries: msg.extraContextEntries.map((v2) => toRedactedExtraContextEntry(v2, privacyMode)),
    files: msg.files.map((v2) => toRedactedSelectedFile(v2, privacyMode)),
    codeSelections: msg.codeSelections.map((v2) => toRedactedSelectedCodeSelection(v2, privacyMode)),
    terminals: msg.terminals.map((v2) => toRedactedSelectedTerminal(v2, privacyMode)),
    terminalSelections: msg.terminalSelections.map((v2) => toRedactedSelectedTerminalSelection(v2, privacyMode)),
    folders: msg.folders.map((v2) => toRedactedSelectedFolder(v2, privacyMode)),
    externalLinks: msg.externalLinks.map((v2) => toRedactedSelectedExternalLink(v2, privacyMode)),
    cursorRules: msg.cursorRules.map((v2) => toRedactedSelectedCursorRule(v2, privacyMode)),
    gitDiff: msg.gitDiff !== void 0 ? toRedactedSelectedGitDiff(msg.gitDiff, privacyMode) : void 0,
    gitDiffFromBranchToMain: msg.gitDiffFromBranchToMain !== void 0 ? toRedactedSelectedGitDiffFromBranchToMain(msg.gitDiffFromBranchToMain, privacyMode) : void 0,
    cursorCommands: msg.cursorCommands.map((v2) => toRedactedSelectedCursorCommand(v2, privacyMode)),
    documentations: msg.documentations.map((v2) => toRedactedSelectedDocumentation(v2, privacyMode)),
    uiElements: msg.uiElements.map((v2) => toRedactedSelectedUIElement(v2, privacyMode)),
    consoleLogs: msg.consoleLogs.map((v2) => toRedactedSelectedConsoleLog(v2, privacyMode)),
    gitCommits: msg.gitCommits.map((v2) => toRedactedSelectedGitCommit(v2, privacyMode)),
    pastChats: msg.pastChats.map((v2) => toRedactedSelectedPastChat(v2, privacyMode)),
    gitPrDiffSelections: msg.gitPrDiffSelections.map((v2) => toRedactedSelectedGitPRDiffSelection(v2, privacyMode)),
    selectedPullRequests: msg.selectedPullRequests.map((v2) => toRedactedSelectedPullRequest(v2, privacyMode)),
    selectedSubagents: msg.selectedSubagents.map((v2) => toRedactedSelectedSubagent(v2, privacyMode)),
    selectedVideos: msg.selectedVideos.map((v2) => toRedactedSelectedVideo(v2, privacyMode)),
    selectedBrowsers: msg.selectedBrowsers.map((v2) => toRedactedSelectedBrowser(v2, privacyMode)),
    selectedDocuments: msg.selectedDocuments.map((v2) => toRedactedSelectedDocument(v2, privacyMode)),
    selectedSkills: msg.selectedSkills.map((v2) => toRedactedAgentSkill(v2, privacyMode)),
    recentAgentsContext: msg.recentAgentsContext !== void 0 ? toRedactedRecentAgentsContext(msg.recentAgentsContext, privacyMode) : void 0,
    selectedAgenticGitAction: msg.selectedAgenticGitAction !== void 0 ? toRedactedSelectedAgenticGitAction(msg.selectedAgenticGitAction, privacyMode) : void 0
  };
}
function fromRedactedSelectedContext(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelectedContext({
    selectedImages: msg.selectedImages.map((v2) => fromRedactedSelectedImage(v2, purpose, opts)),
    invocationContext: msg.invocationContext !== void 0 ? fromRedactedInvocationContext(msg.invocationContext, purpose, opts) : void 0,
    extraContext: msg.extraContext.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    extraContextEntries: msg.extraContextEntries.map((v2) => fromRedactedExtraContextEntry(v2, purpose, opts)),
    files: msg.files.map((v2) => fromRedactedSelectedFile(v2, purpose, opts)),
    codeSelections: msg.codeSelections.map((v2) => fromRedactedSelectedCodeSelection(v2, purpose, opts)),
    terminals: msg.terminals.map((v2) => fromRedactedSelectedTerminal(v2, purpose, opts)),
    terminalSelections: msg.terminalSelections.map((v2) => fromRedactedSelectedTerminalSelection(v2, purpose, opts)),
    folders: msg.folders.map((v2) => fromRedactedSelectedFolder(v2, purpose, opts)),
    externalLinks: msg.externalLinks.map((v2) => fromRedactedSelectedExternalLink(v2, purpose, opts)),
    cursorRules: msg.cursorRules.map((v2) => fromRedactedSelectedCursorRule(v2, purpose, opts)),
    gitDiff: msg.gitDiff !== void 0 ? fromRedactedSelectedGitDiff(msg.gitDiff, purpose, opts) : void 0,
    gitDiffFromBranchToMain: msg.gitDiffFromBranchToMain !== void 0 ? fromRedactedSelectedGitDiffFromBranchToMain(msg.gitDiffFromBranchToMain, purpose, opts) : void 0,
    cursorCommands: msg.cursorCommands.map((v2) => fromRedactedSelectedCursorCommand(v2, purpose, opts)),
    documentations: msg.documentations.map((v2) => fromRedactedSelectedDocumentation(v2, purpose, opts)),
    uiElements: msg.uiElements.map((v2) => fromRedactedSelectedUIElement(v2, purpose, opts)),
    consoleLogs: msg.consoleLogs.map((v2) => fromRedactedSelectedConsoleLog(v2, purpose, opts)),
    gitCommits: msg.gitCommits.map((v2) => fromRedactedSelectedGitCommit(v2, purpose, opts)),
    pastChats: msg.pastChats.map((v2) => fromRedactedSelectedPastChat(v2, purpose, opts)),
    gitPrDiffSelections: msg.gitPrDiffSelections.map((v2) => fromRedactedSelectedGitPRDiffSelection(v2, purpose, opts)),
    selectedPullRequests: msg.selectedPullRequests.map((v2) => fromRedactedSelectedPullRequest(v2, purpose, opts)),
    selectedSubagents: msg.selectedSubagents.map((v2) => fromRedactedSelectedSubagent(v2, purpose, opts)),
    selectedVideos: msg.selectedVideos.map((v2) => fromRedactedSelectedVideo(v2, purpose, opts)),
    selectedBrowsers: msg.selectedBrowsers.map((v2) => fromRedactedSelectedBrowser(v2, purpose, opts)),
    selectedDocuments: msg.selectedDocuments.map((v2) => fromRedactedSelectedDocument(v2, purpose, opts)),
    selectedSkills: msg.selectedSkills.map((v2) => fromRedactedAgentSkill(v2, purpose, opts)),
    recentAgentsContext: msg.recentAgentsContext !== void 0 ? fromRedactedRecentAgentsContext(msg.recentAgentsContext, purpose, opts) : void 0,
    selectedAgenticGitAction: msg.selectedAgenticGitAction !== void 0 ? fromRedactedSelectedAgenticGitAction(msg.selectedAgenticGitAction, purpose, opts) : void 0
  });
}
function toRedactedInvocationContext(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    data: toRedactedInvocationContext_data(msg.data, privacyMode)
  };
}
function toRedactedInvocationContext_data(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "slackThread":
      return { case: "slackThread", value: toRedactedInvocationContext_SlackThread(oneof.value, privacyMode) };
    case "githubPr":
      return { case: "githubPr", value: toRedactedInvocationContext_GithubPR(oneof.value, privacyMode) };
    case "ideState":
      return { case: "ideState", value: toRedactedInvocationContext_IdeState(oneof.value, privacyMode) };
    case "microsoftTeamsThread":
      return { case: "microsoftTeamsThread", value: toRedactedInvocationContext_MicrosoftTeamsThread(oneof.value, privacyMode) };
    case "blobId":
      return { case: "blobId", value: oneof.value };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedInvocationContext(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new InvocationContext({
    data: fromRedactedInvocationContext_data(msg.data, purpose, opts)
  });
}
function fromRedactedInvocationContext_data(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "slackThread":
      return { case: "slackThread", value: fromRedactedInvocationContext_SlackThread(oneof.value, purpose, opts) };
    case "githubPr":
      return { case: "githubPr", value: fromRedactedInvocationContext_GithubPR(oneof.value, purpose, opts) };
    case "ideState":
      return { case: "ideState", value: fromRedactedInvocationContext_IdeState(oneof.value, purpose, opts) };
    case "microsoftTeamsThread":
      return { case: "microsoftTeamsThread", value: fromRedactedInvocationContext_MicrosoftTeamsThread(oneof.value, purpose, opts) };
    case "blobId":
      return { case: "blobId", value: oneof.value };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedInvocationContext_SlackThread(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    thread: createRedactedString(msg.thread, DataClassification.CODE, "thread", privacyMode),
    channelName: msg.channelName,
    channelPurpose: msg.channelPurpose !== void 0 ? createRedactedString(msg.channelPurpose, DataClassification.CODE, "channel_purpose", privacyMode) : void 0,
    channelTopic: msg.channelTopic !== void 0 ? createRedactedString(msg.channelTopic, DataClassification.CODE, "channel_topic", privacyMode) : void 0,
    senderName: msg.senderName !== void 0 ? createRedactedString(msg.senderName, DataClassification.CODE, "sender_name", privacyMode) : void 0,
    senderId: msg.senderId,
    senderType: msg.senderType,
    isDirectlyAddressed: msg.isDirectlyAddressed
  };
}
function fromRedactedInvocationContext_SlackThread(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new InvocationContext_SlackThread({
    thread: msg.thread.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    channelName: msg.channelName,
    channelPurpose: msg.channelPurpose?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    channelTopic: msg.channelTopic?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    senderName: msg.senderName?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    senderId: msg.senderId,
    senderType: msg.senderType,
    isDirectlyAddressed: msg.isDirectlyAddressed
  });
}
function toRedactedInvocationContext_MicrosoftTeamsThread(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    thread: createRedactedString(msg.thread, DataClassification.CODE, "thread", privacyMode),
    channelName: msg.channelName,
    teamName: msg.teamName,
    channelDescription: msg.channelDescription !== void 0 ? createRedactedString(msg.channelDescription, DataClassification.CODE, "channel_description", privacyMode) : void 0,
    teamDescription: msg.teamDescription !== void 0 ? createRedactedString(msg.teamDescription, DataClassification.CODE, "team_description", privacyMode) : void 0
  };
}
function fromRedactedInvocationContext_MicrosoftTeamsThread(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new InvocationContext_MicrosoftTeamsThread({
    thread: msg.thread.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    channelName: msg.channelName,
    teamName: msg.teamName,
    channelDescription: msg.channelDescription?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    teamDescription: msg.teamDescription?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedInvocationContext_GithubPR(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    title: createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode),
    description: createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode),
    comments: createRedactedString(msg.comments, DataClassification.CODE, "comments", privacyMode),
    ciFailures: msg.ciFailures !== void 0 ? createRedactedString(msg.ciFailures, DataClassification.CODE, "ci_failures", privacyMode) : void 0
  };
}
function fromRedactedInvocationContext_GithubPR(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new InvocationContext_GithubPR({
    title: msg.title.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    description: msg.description.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    comments: msg.comments.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    ciFailures: msg.ciFailures?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedInvocationContext_IdeState(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    visibleFiles: msg.visibleFiles.map((v2) => toRedactedInvocationContext_IdeState_File(v2, privacyMode)),
    recentlyViewedFiles: msg.recentlyViewedFiles.map((v2) => toRedactedInvocationContext_IdeState_File(v2, privacyMode)),
    currentlyViewedPrs: msg.currentlyViewedPrs.map((v2) => toRedactedInvocationContext_IdeState_ViewedPullRequest(v2, privacyMode))
  };
}
function fromRedactedInvocationContext_IdeState(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new InvocationContext_IdeState({
    visibleFiles: msg.visibleFiles.map((v2) => fromRedactedInvocationContext_IdeState_File(v2, purpose, opts)),
    recentlyViewedFiles: msg.recentlyViewedFiles.map((v2) => fromRedactedInvocationContext_IdeState_File(v2, purpose, opts)),
    currentlyViewedPrs: msg.currentlyViewedPrs.map((v2) => fromRedactedInvocationContext_IdeState_ViewedPullRequest(v2, purpose, opts))
  });
}
function toRedactedInvocationContext_IdeState_File(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    relativePath: msg.relativePath !== void 0 ? createRedactedString(msg.relativePath, DataClassification.PATH, "relative_path", privacyMode) : void 0,
    cursorPosition: msg.cursorPosition !== void 0 ? toRedactedInvocationContext_IdeState_File_CursorPosition(msg.cursorPosition, privacyMode) : void 0,
    totalLines: msg.totalLines,
    activeCommand: msg.activeCommand !== void 0 ? createRedactedString(msg.activeCommand, DataClassification.CODE, "active_command", privacyMode) : void 0
  };
}
function fromRedactedInvocationContext_IdeState_File(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new InvocationContext_IdeState_File({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    relativePath: msg.relativePath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    cursorPosition: msg.cursorPosition !== void 0 ? fromRedactedInvocationContext_IdeState_File_CursorPosition(msg.cursorPosition, purpose, opts) : void 0,
    totalLines: msg.totalLines,
    activeCommand: msg.activeCommand?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedInvocationContext_IdeState_File_CursorPosition(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    line: msg.line,
    text: createRedactedString(msg.text, DataClassification.CODE, "text", privacyMode)
  };
}
function fromRedactedInvocationContext_IdeState_File_CursorPosition(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new InvocationContext_IdeState_File_CursorPosition({
    line: msg.line,
    text: msg.text.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedInvocationContext_IdeState_ViewedPullRequest(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    number: msg.number,
    url: msg.url,
    title: msg.title !== void 0 ? createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode) : void 0,
    folderPath: msg.folderPath !== void 0 ? createRedactedString(msg.folderPath, DataClassification.PATH, "folder_path", privacyMode) : void 0,
    summaryJson: msg.summaryJson !== void 0 ? createRedactedString(msg.summaryJson, DataClassification.CODE, "summary_json", privacyMode) : void 0,
    description: msg.description !== void 0 ? createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode) : void 0
  };
}
function fromRedactedInvocationContext_IdeState_ViewedPullRequest(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new InvocationContext_IdeState_ViewedPullRequest({
    number: msg.number,
    url: msg.url,
    title: msg.title?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    folderPath: msg.folderPath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    summaryJson: msg.summaryJson?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    description: msg.description?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
