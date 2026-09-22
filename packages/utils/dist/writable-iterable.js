function createWritableIterable() {
  const readQueue = [];
  const writeQueue = [];
  let closed3 = false;
  let error42;
  let nextResolve = () => {
  };
  let nextReject = () => {
  };
  const createNextPromise = () => {
    const promise2 = new Promise((resolve29, reject2) => {
      nextResolve = resolve29;
      nextReject = reject2;
    });
    promise2.catch(() => {
    });
    return promise2;
  };
  let nextPromise = createNextPromise();
  function drainReads(result, err) {
    while (readQueue.length > 0) {
      const reader = readQueue.shift();
      if (err) {
        reader.reject(err);
      } else {
        reader.resolve(result);
      }
    }
  }
  function rejectPendingWrites(err) {
    writeQueue.length = 0;
    nextReject(err);
    nextPromise = Promise.reject(err);
    nextPromise.catch(() => {
    });
  }
  return {
    write(value) {
      return __awaiter12(this, void 0, void 0, function* () {
        if (closed3) {
          throw error42 !== null && error42 !== void 0 ? error42 : new WriteIterableClosedError("WritableIterable is closed");
        }
        const reader = readQueue.shift();
        if (reader) {
          reader.resolve({ done: false, value });
          if (readQueue.length > 0) {
            return;
          }
        } else {
          writeQueue.push(value);
        }
        const waitCount = writeQueue.length + 1;
        for (let i = 0; i < waitCount; i++) {
          yield nextPromise;
        }
      });
    },
    throw(err) {
      if (closed3)
        return;
      closed3 = true;
      error42 = err;
      rejectPendingWrites(err);
      drainReads({ done: true, value: void 0 }, err);
    },
    close() {
      if (closed3)
        return;
      closed3 = true;
      writeQueue.length = 0;
      nextResolve();
      nextPromise = Promise.reject(new WriteIterableClosedError("WritableIterable is closed"));
      nextPromise.catch(() => {
      });
      drainReads({ done: true, value: void 0 });
    },
    [Symbol.asyncIterator]() {
      return {
        next() {
          nextResolve();
          nextPromise = createNextPromise();
          const value = writeQueue.shift();
          if (value !== void 0) {
            return Promise.resolve({ done: false, value });
          }
          if (closed3) {
            if (error42) {
              return Promise.reject(error42);
            }
            return Promise.resolve({ done: true, value: void 0 });
          }
          return new Promise((resolve29, reject2) => {
            readQueue.push({ resolve: resolve29, reject: reject2 });
          });
        },
        throw(err) {
          closed3 = true;
          error42 = err;
          writeQueue.length = 0;
          rejectPendingWrites(err);
          drainReads({ done: true, value: void 0 }, err);
          return Promise.resolve({ done: true, value: void 0 });
        },
        return() {
          closed3 = true;
          writeQueue.length = 0;
          nextResolve();
          nextPromise = Promise.reject(new Error("Iterator was closed"));
          nextPromise.catch(() => {
          });
          drainReads({ done: true, value: void 0 });
          return Promise.resolve({ done: true, value: void 0 });
        }
      };
    }
  };
}
var __awaiter12, WriteIterableClosedError;
var init_writable_iterable = __esm({
  "../packages/utils/dist/writable-iterable.js"() {
    "use strict";
    __awaiter12 = function(thisArg, _arguments, P2, generator) {
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
    WriteIterableClosedError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "WriteIterableClosedError";
      }
    };
  }
});
