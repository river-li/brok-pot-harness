/** A local workspace has no vendor account or renewable vendor credential. */
export function createLocalHostAuth(getMachineId: () => Promise<string> | string) {
  const unavailable = async (): Promise<never> => {
    throw new Error('Vendor account services are disabled in local mode. Configure the Responses API instead.');
  };
  return {
    getAccessToken: unavailable,
    getGrokBotToken: unavailable,
    getBestEffortAccessToken: async () => null,
    peekAccessToken: () => null,
    peekBoxIdentityCredential: () => null,
    getTeamId: async () => undefined,
    getLastRenewalEvent: () => null,
    getMachineId,
    subscribeToRenewal: () => () => {},
    getUserFullName: () => undefined,
  };
}
