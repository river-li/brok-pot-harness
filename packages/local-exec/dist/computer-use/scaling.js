/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/computer-use/scaling.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CoordinateScaler = class {
  constructor(config2) {
    this.config = config2;
    const displayRatio = config2.display.width / config2.display.height;
    const apiRatio = config2.api.width / config2.api.height;
    const ratioDiff = Math.abs(displayRatio - apiRatio);
    if (ratioDiff > 0.02) {
      throw new Error(`Aspect ratio mismatch: display=${displayRatio.toFixed(3)}, api=${apiRatio.toFixed(3)}`);
    }
    this.xScaleUp = config2.display.width / config2.api.width;
    this.yScaleUp = config2.display.height / config2.api.height;
    this.xScaleDown = config2.api.width / config2.display.width;
    this.yScaleDown = config2.api.height / config2.display.height;
  }
  /**
   * Scale from API coordinates to display coordinates.
   * Used when executing mouse actions.
   */
  apiToDisplay(x, y) {
    return {
      x: Math.round(x * this.xScaleUp),
      y: Math.round(y * this.yScaleUp)
    };
  }
  /**
   * Scale from display coordinates to API coordinates.
   * Used when reporting cursor position.
   */
  displayToApi(x, y) {
    return {
      x: Math.round(x * this.xScaleDown),
      y: Math.round(y * this.yScaleDown)
    };
  }
  get apiWidth() {
    return this.config.api.width;
  }
  get apiHeight() {
    return this.config.api.height;
  }
  get displayWidth() {
    return this.config.display.width;
  }
  get displayHeight() {
    return this.config.display.height;
  }
};

