/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../dune/src/internal/rpc/schema.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toValidator(expects, check2) {
  return {
    expects,
    check: check2,
    "~standard": {
      version: 1,
      vendor: "dune",
      validate: (value) => {
        const result = check2(value, []);
        return result.ok ? { value: result.value } : {
          issues: [
            {
              message: `must be ${result.expected}, got ${result.received}`,
              path: result.path
            }
          ]
        };
      }
    }
  };
}

