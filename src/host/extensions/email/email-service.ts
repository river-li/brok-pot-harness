init_errors();
function createEmailService(deps) {
  const { client, deadline, logWarning } = deps;
  const rpcs = {
    listGrokBotEmailInboxes: (request3) => deadline.run((signal) => client.listGrokBotEmailInboxes(request3, { signal })),
    createGrokBotEmailInbox: (request3) => deadline.run((signal) => client.createGrokBotEmailInbox(request3, { signal })),
    searchGrokBotEmailThreads: (request3) => deadline.run((signal) => client.searchGrokBotEmailThreads(request3, { signal })),
    readGrokBotEmailThread: (request3) => deadline.run((signal) => client.readGrokBotEmailThread(request3, { signal })),
    readGrokBotEmailAttachment: (request3) => deadline.run((signal) => client.readGrokBotEmailAttachment(request3, { signal })),
    sendGrokBotEmail: (request3) => deadline.run((signal) => client.sendGrokBotEmail(request3, { signal }))
  };
  return createGrokBotEmailClientPort(rpcs, {
    reportUnexpectedError: (error41) => logWarning(`[sand:email] rpc failed (${errorLogTag(error41)})`)
  });
}
