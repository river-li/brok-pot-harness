/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/replayable-async-iterable.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __awaiter7, __asyncValues, __await2, __asyncGenerator2, ReplayableAsyncIterable;
var init_replayable_async_iterable = __esm({
  "../packages/utils/dist/replayable-async-iterable.js"() {
    "use strict";
    __awaiter7 = function(thisArg, _arguments, P2, generator) {
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
    __asyncValues = function(o) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var m2 = o[Symbol.asyncIterator], i;
      return m2 ? m2.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
      }, i);
      function verb(n) {
        i[n] = o[n] && function(v2) {
          return new Promise(function(resolve14, reject2) {
            v2 = o[n](v2), settle(resolve14, reject2, v2.done, v2.value);
          });
        };
      }
      function settle(resolve14, reject2, d, v2) {
        Promise.resolve(v2).then(function(v3) {
          resolve14({ value: v3, done: d });
        }, reject2);
      }
    };
    __await2 = function(v2) {
      return this instanceof __await2 ? (this.v = v2, this) : new __await2(v2);
    };
    __asyncGenerator2 = function(thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var g2 = generator.apply(thisArg, _arguments || []), i, q2 = [];
      return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
        return this;
      }, i;
      function awaitReturn(f2) {
        return function(v2) {
          return Promise.resolve(v2).then(f2, reject2);
        };
      }
      function verb(n, f2) {
        if (g2[n]) {
          i[n] = function(v2) {
            return new Promise(function(a, b2) {
              q2.push([n, v2, a, b2]) > 1 || resume(n, v2);
            });
          };
          if (f2) i[n] = f2(i[n]);
        }
      }
      function resume(n, v2) {
        try {
          step(g2[n](v2));
        } catch (e) {
          settle(q2[0][3], e);
        }
      }
      function step(r) {
        r.value instanceof __await2 ? Promise.resolve(r.value.v).then(fulfill, reject2) : settle(q2[0][2], r);
      }
      function fulfill(value) {
        resume("next", value);
      }
      function reject2(value) {
        resume("throw", value);
      }
      function settle(f2, v2) {
        if (f2(v2), q2.shift(), q2.length) resume(q2[0][0], q2[0][1]);
      }
    };
    ReplayableAsyncIterable = class {
      constructor(source) {
        this.buffer = [];
        this.closed = false;
        this.waiters = [];
        void this.consume(source);
      }
      consume(source) {
        return __awaiter7(this, void 0, void 0, function* () {
          var _a20, source_1, source_1_1;
          var _b2, e_1, _c2, _d;
          try {
            try {
              for (_a20 = true, source_1 = __asyncValues(source); source_1_1 = yield source_1.next(), _b2 = source_1_1.done, !_b2; _a20 = true) {
                _d = source_1_1.value;
                _a20 = false;
                const value = _d;
                this.buffer.push(value);
                const toNotify = this.waiters;
                this.waiters = [];
                for (const waiter of toNotify) {
                  waiter();
                }
              }
            } catch (e_1_1) {
              e_1 = { error: e_1_1 };
            } finally {
              try {
                if (!_a20 && !_b2 && (_c2 = source_1.return)) yield _c2.call(source_1);
              } finally {
                if (e_1) throw e_1.error;
              }
            }
          } catch (e) {
            this.error = e instanceof Error ? e : new Error(String(e));
          } finally {
            this.closed = true;
            const toNotify = this.waiters;
            this.waiters = [];
            for (const waiter of toNotify) {
              waiter();
            }
          }
        });
      }
      [Symbol.asyncIterator]() {
        return __asyncGenerator2(this, arguments, function* _a20() {
          let index = 0;
          while (true) {
            while (index < this.buffer.length) {
              yield yield __await2(this.buffer[index]);
              index++;
            }
            if (this.closed) {
              if (this.error !== void 0) {
                throw this.error;
              }
              return yield __await2(void 0);
            }
            yield __await2(new Promise((resolve14) => {
              this.waiters.push(resolve14);
            }));
          }
        });
      }
    };
  }
});

