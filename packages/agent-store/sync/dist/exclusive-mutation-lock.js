var __awaiter4 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var AGENT_STORE_EXCLUSIVE_MUTATION_LOCK_FILE_NAME = "exclusive-mutation.lock";
function exclusiveMutationLockPathForFilesDir(filesDir) {
  return path6.join(path6.dirname(path6.resolve(filesDir)), AGENT_STORE_SYNC_DIR_NAME, AGENT_STORE_EXCLUSIVE_MUTATION_LOCK_FILE_NAME);
}
function readAgentStoreExclusiveMutationClaimOwner(args) {
  return __awaiter4(this, void 0, void 0, function* () {
    return yield readActiveStoreLockOwner({
      lockPath: exclusiveMutationLockPathForFilesDir(args.filesDir)
    });
  });
}
