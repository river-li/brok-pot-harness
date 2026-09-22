/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/main.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/3
init_scheduling();

// @recovered-fragment 2/3
init_invariant();

// @recovered-fragment 3/3
var BOX_COPY_IN_ARG = "--box-copy-in";
async function runHostMain() {
  if (process.argv.includes(BOX_COPY_IN_ARG)) {
    process.exitCode = BOX_COPY_IN_EXIT_FAILED;
    let code;
    try {
      code = await executeBoxCopyInFromEnv(process.env);
    } catch (error42) {
      console.error("[box-copy-in] unexpected error (failing closed):", error42);
      code = BOX_COPY_IN_EXIT_FAILED;
    }
    process.exit(code);
  }
  const crashGuards = installProcessCrashGuards({ scope: "sand-host" });
  const lockResult = await acquireHostLock();
  if (lockResult.outcome === "took-over") {
    console.log(
      `[sand-host] took over ${getSandRootDir()} from live host pid ${lockResult.previousPid}`
    );
  } else if (lockResult.previousPid != null) {
    console.log(
      `[sand-host] reclaimed ${getSandRootDir()} lock (${lockResult.outcome}) from pid ${lockResult.previousPid}`
    );
  }
  const hostLock = lockResult.lock;
  const environment = readSandHostEnvironment(process.env);
  const host = new SandHost({ environment });
  crashGuards.setReporter((error42, kind) => host.reportProcessCrash(error42, kind));
  installInvariantReporter((report) => host.reportInvariantViolation(report));
  pinHostDiagnosticsReporter((diagnostic) => host.reportHostDiagnostic(diagnostic));
  let stage = "host_start";
  const gatewayStarted = Promise.withResolvers();
  try {
    await host.start({
      beforeResumeOwnership: async () => {
        installPolicyStopReporter((stop) => host.reportPolicyStopped(stop));
        stage = "gateway";
        const gatewayConfig2 = resolveGatewayServerConfig(process.env);
        const scheme2 = gatewayScheme(gatewayConfig2);
        const gateway2 = await startGatewayServer({
          api: host.getApi(),
          subscribe: (listener) => host.subscribe(listener),
          getHealth: () => host.getHealth(),
          onDesktopContact: () => host.noteDesktopContact(),
          prepareForUpgrade: () => host.prepareForUpgrade(),
          startedAt: host.startedAt,
          host: gatewayConfig2.host,
          port: gatewayConfig2.port,
          authToken: gatewayConfig2.authToken,
          tls: gatewayConfig2.tls,
          localExec: host.getLocalExecBridge(),
          webauthn: host.getWebAuthnBridge(),
          cookieOriginApproval: host.getCookieOriginApprovalBridge(),
          onCommandError: (report) => host.reportGatewayCommandError(report),
          onCommandComplete: (report) => host.reportGatewayCommandSuccess(report),
          sseGzipDisabled: environment.gatewaySseGzipDisabled
        });
        installShutdownHandlers(host, gateway2, hostLock);
        gatewayStarted.resolve({ gateway: gateway2, gatewayConfig: gatewayConfig2, scheme: scheme2 });
        stage = "host_start";
      }
    });
    const { gateway, gatewayConfig, scheme } = await gatewayStarted.promise;
    stage = "discovery";
    await writeGatewayDiscovery({
      port: gateway.port,
      pid: process.pid,
      startedAt: host.startedAt,
      scheme,
      host: gatewayConfig.host,
      token: gatewayConfig.authToken
    });
    host.telemetry.reportHostLog(
      "info",
      `[sand-host] gateway listening on ${scheme}://${gatewayConfig.host}:${gateway.port}${gatewayConfig.authToken != null ? " (auth required)" : ""}`
    );
    void host.reportBoxReady();
  } catch (error42) {
    const recorded = await createHostCrashMarkerStore().write(
      fatalStartupCrashMarker({
        stage,
        error: error42,
        startedAtMs: host.startedAt,
        crashedAtMs: Date.now()
      })
    );
    if (recorded !== "written") host.reportProcessCrash(error42, "fatal_startup");
    await host.flushTelemetryForFatalExit();
    hostLock.release();
    process.exit(1);
  }
}
function installShutdownHandlers(host, gateway, hostLock) {
  let isShuttingDown = false;
  const shutdown = (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    host.telemetry.reportHostLog("info", `[sand-host] received ${signal}, shutting down`);
    const watchdog = realClock.schedule(5e3, () => {
      host.reportProcessCrash(null, "shutdown_watchdog");
      void host.flushTelemetryForFatalExit().finally(() => {
        hostLock.release();
        process.exit(1);
      });
    });
    void (async () => {
      try {
        await gateway.close();
        await host.dispose();
        await clearGatewayDiscovery();
      } catch (error42) {
        host.reportProcessCrash(error42, "shutdown_error");
        await host.flushTelemetryForFatalExit();
      } finally {
        watchdog.dispose();
        hostLock.release();
        process.exit(0);
      }
    })();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
bootSandHost(runHostMain).catch((error42) => {
  console.error("[sand-host] fatal:", error42);
  process.exit(1);
});
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

image-q/dist/cjs/image-q.cjs:
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * cie94.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * ciede2000.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * cmetric.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * common.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * constants.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * ditherErrorDiffusionArray.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * euclidean.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * helper.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * hueStatistics.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * iq.ts - Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * lab2rgb.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * lab2xyz.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * manhattanNeuQuant.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * nearestColor.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * palette.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * pngQuant.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * point.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * pointContainer.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * rgb2hsl.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * rgb2lab.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * rgb2xyz.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * ssim.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * wuQuant.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * xyz2lab.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * xyz2rgb.ts - part of Image Quantization Library
   *)
  (**
   * @preserve
   * MIT License
   *
   * Copyright 2015-2018 Igor Bezkrovnyi
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to
   * deal in the Software without restriction, including without limitation the
   * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
   * sell copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
   * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
   * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
   * IN THE SOFTWARE.
   *
   * riemersma.ts - part of Image Quantization Library
   *)
  (**
   * @preserve TypeScript port:
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * colorHistogram.ts - part of Image Quantization Library
   *)
  (**
   * @preserve TypeScript port:
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * neuquant.ts - part of Image Quantization Library
   *)
  (**
   * @preserve TypeScript port:
   * Copyright 2015-2018 Igor Bezkrovnyi
   * All rights reserved. (MIT Licensed)
   *
   * rgbquant.ts - part of Image Quantization Library
   *)

is-extendable/index.js:
  (*!
   * is-extendable <https://github.com/jonschlinkert/is-extendable>
   *
   * Copyright (c) 2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

strip-bom-string/index.js:
  (*!
   * strip-bom-string <https://github.com/jonschlinkert/strip-bom-string>
   *
   * Copyright (c) 2015, 2017, Jon Schlinkert.
   * Released under the MIT License.
   *)

mime-db/index.js:
  (*!
   * mime-db
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2022 Douglas Christopher Wilson
   * MIT Licensed
   *)

mime-types/index.js:
  (*!
   * mime-types
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

long/umd/index.js:
  (**
   * @license
   * Copyright 2009 The Closure Library Authors
   * Copyright 2020 Daniel Wirtz / The long.js Authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * SPDX-License-Identifier: Apache-2.0
   *)

re2js/build/index.esm.js:
  (*!
   * re2js
   * RE2JS is the JavaScript port of RE2, a regular expression engine that provides linear time matching
   *
   * @version v1.2.2
   * @author Alexey Vasiliev
   * @homepage https://github.com/le0pard/re2js#readme
   * @repository github:le0pard/re2js
   * @license MIT
   *)
*/
