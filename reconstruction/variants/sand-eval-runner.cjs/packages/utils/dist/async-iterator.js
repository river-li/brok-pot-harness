/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/async-iterator.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function getFirstItem(iterable) {
  return __awaiter(this, void 0, void 0, function* () {
    const iterator = iterable[Symbol.asyncIterator]();
    const first = yield iterator.next();
    if (first.done) {
      return void 0;
    }
    const rest = {
      [Symbol.asyncIterator]() {
        return __asyncGenerator(this, arguments, function* _a20() {
          for (; ; ) {
            const next = yield __await(iterator.next());
            if (next.done)
              return yield __await(void 0);
            yield yield __await(next.value);
          }
        });
      }
    };
    return { firstItem: first.value, rest };
  });
}
var __awaiter, __await, __asyncGenerator;
var init_async_iterator = __esm({
  "../packages/utils/dist/async-iterator.js"() {
    "use strict";
    __awaiter = function(thisArg, _arguments, P2, generator) {
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
    __await = function(v2) {
      return this instanceof __await ? (this.v = v2, this) : new __await(v2);
    };
    __asyncGenerator = function(thisArg, _arguments, generator) {
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
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject2) : settle(q2[0][2], r);
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
  }
});

