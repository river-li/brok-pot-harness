/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/sand-eval-runner/main.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_promises28 = require("node:fs/promises");
var import_node_path69 = require("node:path");

// @recovered-fragment 2/2
var SandEvalRunnerConfigurationError = class extends SandDomainError {
  name = "SandEvalRunnerConfigurationError";
};
var failureRunId = "unknown";
var failureResult;
function readNamedArgument(name17) {
  const index = process.argv.indexOf(name17);
  const value = index < 0 ? void 0 : process.argv[index + 1];
  if (value == null || value.length === 0) {
    throw new SandEvalRunnerConfigurationError(`Missing required ${name17} argument`);
  }
  return value;
}
function readRequiredEnvironmentVariable(name17) {
  const value = consumeEnvironmentVariable(process.env, name17);
  if (value == null || value.length === 0) {
    throw new SandEvalRunnerConfigurationError(`Missing required ${name17} environment variable`);
  }
  return value;
}
function jsonReplacer3(_key, value) {
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Uint8Array) {
    return { encoding: "base64", data: Buffer.from(value).toString("base64") };
  }
  return value;
}
async function writeResult(path30, result) {
  await (0, import_promises28.mkdir)((0, import_node_path69.dirname)(path30), { recursive: true });
  const temporaryPath = `${path30}.${process.pid}.tmp`;
  await (0, import_promises28.writeFile)(temporaryPath, `${JSON.stringify(result, jsonReplacer3)}
`, "utf8");
  await (0, import_promises28.rename)(temporaryPath, path30);
}
async function main() {
  const requestPath = readNamedArgument("--request");
  const resultPath = readNamedArgument("--result");
  const request3 = sandEvalRunnerRequestSchema.parse(
    JSON.parse(await (0, import_promises28.readFile)(requestPath, "utf8"))
  );
  failureRunId = request3.runId;
  await (0, import_promises28.unlink)(requestPath);
  const accessToken = readRequiredEnvironmentVariable("SAND_EVAL_ACCESS_TOKEN");
  const inferenceProxyJwt = consumeEnvironmentVariable(process.env, "INFERENCE_PROXY_JWT");
  const machineId = process.env.SAND_EVAL_MACHINE_ID?.trim() || `sand-eval-${request3.runId}`;
  const inference = createSandEvalInference({
    backend: readSandProcessEnvironment(process.env).backend,
    getAccessToken: async () => accessToken,
    getMachineId: async () => machineId,
    model: request3.model,
    inferenceRequestContext: request3.inferenceRequestContext == null ? void 0 : { ...request3.inferenceRequestContext, inferenceProxyJwt }
  });
  const localMcp = request3.mcpConfigPath == null ? void 0 : await createLocalSandMcp({
    configPath: request3.mcpConfigPath,
    workspacePath: request3.workspacePath
  });
  const webSearchService = request3.webSearchFixtures == null ? void 0 : createFixtureAugmentedWebSearchService(request3.webSearchFixtures);
  const result = await runSandEvalRequest(request3, {
    inference,
    streamTuning: resolveSandStreamTuning(process.env),
    ...localMcp == null ? {} : { mcp: localMcp.mcp },
    ...webSearchService == null ? {} : { webSearchService }
  }).then((completedResult) => {
    failureResult = completedResult;
    return completedResult;
  }).finally(async () => {
    await localMcp?.close();
  });
  await writeResult(resultPath, result);
  if (result.status === "failed") process.exitCode = 1;
}
main().catch(async (error3) => {
  const result = createSandEvalRunnerFailureResult(failureRunId, error3, failureResult);
  try {
    const resultPath = readNamedArgument("--result");
    await writeResult(resultPath, result);
  } catch {
    process.stderr.write(`${JSON.stringify(result, jsonReplacer3)}
`);
  }
  process.exitCode = 1;
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
