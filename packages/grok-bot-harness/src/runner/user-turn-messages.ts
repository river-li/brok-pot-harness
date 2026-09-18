function resolveUserMessageId({
  id,
  transcriptMessageId
}) {
  return transcriptMessageId ?? (isOffRecordMessageId(id) ? id : `${SAND_OFF_RECORD_MESSAGE_ID_PREFIX}${id}`);
}
