/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/jimp-minimal.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __awaiter8 = function(thisArg, _arguments, P2, generator) {
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
function createJimpInstance() {
  return __awaiter8(this, void 0, void 0, function* () {
    const [{ createJimp: createJimp2 }, { default: png2 }, { default: jpeg2 }, { default: bmp2, msBmp: msBmp2 }, { default: gif2 }, { default: tiff2 }, { methods: resizeMethods }] = yield Promise.all([
      Promise.resolve().then(() => (init_esm5(), esm_exports2)),
      Promise.resolve().then(() => (init_esm6(), esm_exports3)),
      Promise.resolve().then(() => (init_esm7(), esm_exports4)),
      Promise.resolve().then(() => (init_esm9(), esm_exports5)),
      Promise.resolve().then(() => (init_esm10(), esm_exports7)),
      Promise.resolve().then(() => (init_esm11(), esm_exports8)),
      Promise.resolve().then(() => (init_esm12(), esm_exports9))
    ]);
    return createJimp2({
      formats: [png2, jpeg2, bmp2, msBmp2, gif2, tiff2],
      plugins: [resizeMethods]
    });
  });
}
var jimpPromise;
function getMinimalJimp() {
  if (jimpPromise === void 0) {
    const initPromise = createJimpInstance().catch((error3) => {
      if (jimpPromise === initPromise) {
        jimpPromise = void 0;
      }
      throw error3;
    });
    jimpPromise = initPromise;
  }
  return jimpPromise;
}

