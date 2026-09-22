/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/promise-extras.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function asyncMapValues(array2, selector, options2) {
  return __awaiter6(this, void 0, void 0, function* () {
    const { max = 4 } = options2 !== null && options2 !== void 0 ? options2 : {};
    const promiseSelToObs = (idx) => (0, import_rxjs.defer)(() => (0, import_rxjs.from)(selector(array2[idx])).pipe((0, import_rxjs.map)((v2) => ({ idx, v: v2 }))));
    const ret = (0, import_rxjs.from)(array2.map((_2, idx) => idx)).pipe((0, import_rxjs.map)(promiseSelToObs), (0, import_rxjs.mergeAll)(max), (0, import_rxjs.reduce)((acc, kvp) => {
      acc[kvp.idx] = kvp.v;
      return acc;
    }, []));
    return (0, import_rxjs.firstValueFrom)(ret);
  });
}
function delay(ms2) {
  return new Promise((resolve14) => {
    setTimeout(resolve14, ms2);
  });
}
function withTimeout(promise, timeoutMs, message) {
  return (0, import_rxjs.firstValueFrom)((0, import_rxjs.from)(promise).pipe((0, import_rxjs.timeout)({
    first: timeoutMs,
    with: () => (0, import_rxjs.throwError)(() => new TimeoutError(message !== null && message !== void 0 ? message : `Promise timed out after ${timeoutMs}ms`))
  })));
}
var import_rxjs, __awaiter6, TimeoutError, PromiseQueue;
var init_promise_extras = __esm({
  "../packages/utils/dist/promise-extras.js"() {
    "use strict";
    import_rxjs = __toESM(require_cjs(), 1);
    __awaiter6 = function(thisArg, _arguments, P2, generator) {
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
    TimeoutError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "TimeoutError";
      }
    };
    PromiseQueue = class {
      /**
       * Creates a new PromiseQueue.
       *
       * @param options - Options for the operation
       * @param options.max - The maximum number of concurrent operations
       */
      constructor(options2) {
        this.opQueue = new import_rxjs.Subject();
        this.nextOperation = 1;
        const { max = 4 } = options2 !== null && options2 !== void 0 ? options2 : {};
        this.opResultStream = this.opQueue.pipe(
          (0, import_rxjs.mergeAll)(max),
          (0, import_rxjs.share)()
        );
        this.dispose = this.opResultStream.subscribe();
      }
      /**
       * Enqueue a new operation.
       *
       * @param block - The function to enqueue
       * @returns A promise that will resolve with the result of the operation
       */
      enqueue(block) {
        const id = this.nextOperation++;
        const op = (0, import_rxjs.defer)(() => (0, import_rxjs.from)(block()).pipe((0, import_rxjs.map)((v2) => ({ id, result: v2 })), (0, import_rxjs.catchError)((e) => (0, import_rxjs.of)({ id, error: e }))));
        const ret = (0, import_rxjs.firstValueFrom)(this.opResultStream.pipe((0, import_rxjs.filter)((op2) => op2.id === id))).then((e) => {
          if (e.error) {
            return Promise.reject(e.error);
          } else {
            return Promise.resolve(e.result);
          }
        });
        this.opQueue.next(op);
        return ret;
      }
      /**
       * Enqueue a list of operations.
       *
       * @param list - The list of items to enqueue
       * @param block - The function to enqueue
       * @returns A promise that will resolve with the result of the operation
       */
      enqueueList(list, block) {
        if (list.length === 0) {
          return Promise.resolve(/* @__PURE__ */ new Map());
        }
        return (0, import_rxjs.firstValueFrom)((0, import_rxjs.from)(list).pipe((0, import_rxjs.mergeMap)((x) => this.enqueue(() => block(x)).then((v2) => ({ key: x, value: v2 }))), (0, import_rxjs.reduce)((acc, kvp) => {
          acc.set(kvp.key, kvp.value);
          return acc;
        }, /* @__PURE__ */ new Map())));
      }
      /**
       * Close the queue and wait for all operations to complete. Once this is called,
       * the object is no longer usable.
       *
       * @returns A promise that will resolve when the queue is closed
       */
      close() {
        this.opQueue.complete();
        const ret = (0, import_rxjs.lastValueFrom)(this.opResultStream.pipe((0, import_rxjs.materialize)(), (0, import_rxjs.map)(() => void 0)));
        this.dispose.unsubscribe();
        return ret;
      }
    };
  }
});

