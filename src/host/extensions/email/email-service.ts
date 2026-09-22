init_errors();
function createEmailService(deps) {
  const { client, deadline, logWarning } = deps;
  const rpcs = {
    listGrokBotEmailInboxes: (request5) => deadline.run((signal) => client.listGrokBotEmailInboxes(request5, { signal })),
    createGrokBotEmailInbox: (request5) => deadline.run((signal) => client.createGrokBotEmailInbox(request5, { signal })),
    searchGrokBotEmailThreads: (request5) => deadline.run((signal) => client.searchGrokBotEmailThreads(request5, { signal })),
    readGrokBotEmailThread: (request5) => deadline.run((signal) => client.readGrokBotEmailThread(request5, { signal })),
    readGrokBotEmailAttachment: (request5) => deadline.run((signal) => client.readGrokBotEmailAttachment(request5, { signal })),
    sendGrokBotEmail: (request5) => deadline.run((signal) => client.sendGrokBotEmail(request5, { signal }))
  };
  return createGrokBotEmailClientPort(rpcs, {
    reportUnexpectedError: (error42) => logWarning(`[sand:email] rpc failed (${errorLogTag(error42)})`)
  });
}
