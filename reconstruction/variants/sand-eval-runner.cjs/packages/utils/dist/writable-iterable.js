/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/writable-iterable.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createWritableIterable() {
  const readQueue = [];
  const writeQueue = [];
  let closed2 = false;
  let error3;
  let nextResolve = () => {
  };
  let nextReject = () => {
  };
  const createNextPromise = () => {
    const promise = new Promise((resolve14, reject2) => {
      nextResolve = resolve14;
      nextReject = reject2;
    });
    promise.catch(() => {
    });
    return promise;
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
      return __awaiter4(this, void 0, void 0, function* () {
        if (closed2) {
          throw error3 !== null && error3 !== void 0 ? error3 : new WriteIterableClosedError("WritableIterable is closed");
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
      if (closed2)
        return;
      closed2 = true;
      error3 = err;
      rejectPendingWrites(err);
      drainReads({ done: true, value: void 0 }, err);
    },
    close() {
      if (closed2)
        return;
      closed2 = true;
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
          if (closed2) {
            if (error3) {
              return Promise.reject(error3);
            }
            return Promise.resolve({ done: true, value: void 0 });
          }
          return new Promise((resolve14, reject2) => {
            readQueue.push({ resolve: resolve14, reject: reject2 });
          });
        },
        throw(err) {
          closed2 = true;
          error3 = err;
          writeQueue.length = 0;
          rejectPendingWrites(err);
          drainReads({ done: true, value: void 0 }, err);
          return Promise.resolve({ done: true, value: void 0 });
        },
        return() {
          closed2 = true;
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
var __awaiter4, WriteIterableClosedError;
var init_writable_iterable = __esm({
  "../packages/utils/dist/writable-iterable.js"() {
    "use strict";
    __awaiter4 = function(thisArg, _arguments, P2, generator) {
      function adopt(value) {
        return value instanceof P2 ? value : new P2(function(resolve14) {
          resolve14(value);
        });
      }
      return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
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
          result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
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

