/** Adapts the existing desktop account interface to one local workspace.
 * The legacy UI's `logged-in` discriminator means workspace ready here; no JWT,
 * vendor account, entitlement request, keychain entry or token renewal is used.
 */
import { hostname } from "node:os";
import { mintLocalVoiceCredential } from "./voice-credential.js";
import { createLocalMachineLabelClient } from "./desktop-machines.js";
type Options = Record<string, any>;
const status = {
  kind: "logged-in",
  authId: "grokbot-local",
  email: "local@localhost",
  displayName: "Local workspace",
  profileReady: true,
  localMode: true,
};
const access = {
  state: "granted",
  reason: "none",
  privacyDisclaimerRequired: false,
  purchasableTiers: [],
  localMode: true,
};
const unavailable = async (): Promise<never> => {
  throw new Error("This account service is unavailable in local mode.");
};
const noop = () => {};
const subscribe = () => noop;
const auth = {
  getStatus: async () => ({ ...status }),
  subscribe,
  subscribeLoginFlight: subscribe,
  getLoginFlight: () => ({ kind: "idle" }),
  cancelLoginFlight: noop,
  getValidAccessToken: unavailable,
  peekAccessToken: async () => null,
  getBestEffortAccessToken: async () => null,
  getSelectedTeamId: async () => undefined,
  getSelectedTeamSnapshot: async () => ({ kind: "clear" }),
  getTeamId: async () => undefined,
  noteUnauthenticatedResponse: noop,
  dispose: noop,
};
export function createLocalAuthWiring(options: Options) {
  let freshness = 0;
  // Vendor onboarding covers accounts, payment and provisioning. The local
  // workspace already owns its Box; keep the regular agent and settings UI.
  options.settingsStore.setHasSeenOnboarding(true);
  return {
    ensureCursorAuthService: async () => auth,
    deliverCursorAuthStatus: (_service: unknown, next: Options) =>
      options.emitAuthStatus({ ...next, freshness: ++freshness }),
    currentAuthStatusFreshness: () => freshness,
    supersedeSelectedTeamSync: noop,
    resyncSelectedTeam: async () => "push-skipped",
  };
}
export function createLocalAccountPort(options: Options) {
  return {
    getAuthStatus: async () => ({
      ...status,
      freshness: options.currentAuthStatusFreshness(),
    }),
    getSandAccess: async () => ({ ...access }),
    getSandAccessFresh: async () => ({ ...access }),
    getLoginFlight: auth.getLoginFlight,
    cancelLoginFlight: noop,
    login: unavailable,
    logout: unavailable,
    addAccount: unavailable,
    switchAccount: unavailable,
    removeAccount: unavailable,
    updateAccountName: unavailable,
    listAccounts: async () => ({
      accounts: [],
      activeAccountId: null,
      corrupt: false,
    }),
    getAvatar: async () => null,
    getMachines: () => options.readLocalMachines(),
    getSelectedTeam: async () => ({
      selectedTeamId: undefined,
      memberships: [],
      isLoading: false,
    }),
    listTeamMemberships: async () => [],
    checkTeamAccess: unavailable,
    selectTeam: unavailable,
    ackTeamFallback: noop,
    updateMachineLabel: (args: { machineId: string; label: string }) =>
      options.updateLocalMachineLabel(args),
    updateMachineLocalToolPermission: unavailable,
    getCurrentMachineMessagesEnabled: async () => false,
    updateCurrentMachineMessagesEnabled: unavailable,
    getWeeklyUsage: async () => null,
    getUsageSummary: async () => null,
    getEnterpriseUsage: async () => null,
    getOriginPrStatus: async () => null,
    getPrReviewPreferences: async () => ({}),
    getPrivacyModeEnabled: async () => true,
    mintVoiceCallCredential: mintLocalVoiceCredential,
    invokeDashboardAction: unavailable,
    cancelTrial: unavailable,
    setSpendLimit: unavailable,
  };
}
export function createLocalMachineRuntime(options: {
  getMachineId: () => Promise<string>;
  getLocalToolPermissionChoice: () => "ask" | "always" | "never";
}) {
  const labels = createLocalMachineLabelClient();
  const machine = async () => {
    const machineId = await options.getMachineId();
    return {
      machineId,
      label:
        (await labels.get(machineId)) ??
        (hostname().trim() || process.platform),
      isCurrent: true,
      localToolPermission: options.getLocalToolPermissionChoice(),
      messagesEnabled: false,
    };
  };
  // The renderer must recognize its own machine before recording a one-shot
  // approval. Returning an empty cloud roster loses that native approval and
  // also resets the saved choice to Ask during the host settings resync.
  return {
    registration: { observe: noop, ensure: async () => true, dispose: noop },
    isStorageAllowed: async () => true,
    readMachines: async () => [await machine()],
    updateLabel: async ({
      machineId,
      label,
    }: {
      machineId: string;
      label: string;
    }) => {
      if (machineId !== (await options.getMachineId()))
        throw new Error("Only this local machine can be renamed.");
      await labels.set(machineId, label);
      return machine();
    },
    readMessagesEnabled: async () => false,
    updateMessagesEnabled: unavailable,
  };
}
