init_errors();
var artifactsReported = createCounter("grok_bot.cloud_agent.artifacts_reported", {
  description: "Artifacts a finished cloud agent run listed under its artifacts dir when Grok Bot read the completion; one increment per listed file",
  labelNames: ["harness", "kind"]
});
var artifactsCited = createCounter("grok_bot.cloud_agent.artifacts_cited", {
  description: "Listed artifacts the cloud agent's final report cited, the set Grok Bot surfaces in its reply; one increment per cited file",
  labelNames: ["harness", "kind"]
});
var artifactCopy = createCounter("grok_bot.cloud_agent.artifact_copy", {
  description: "Copy-to-box outcome per cited artifact on the completion path: copied, write_failed, or skipped with the plan or fetch reason",
  labelNames: ["harness", "kind", "outcome", "reason"]
});
function recordArtifactMetrics(metrics2, record2) {
  if (metrics2 === void 0) return;
  try {
    record2(metrics2);
  } catch (error42) {
    process.stderr.write(
      `sand.cloud_agent.artifact_metrics_failed error_class=${errorLogTag(error42)}
`
    );
  }
}
function cloudAgentArtifactCopyOutcome(reason) {
  return reason === "write-failed" ? "write_failed" : "skipped";
}
function recordArtifactsListed(metrics2, artifacts) {
  for (const artifact of artifacts) {
    artifactsReported.increment(metrics2.ctx, 1, {
      harness: metrics2.harness,
      kind: getFilePreviewKind(artifact.path)
    });
  }
}
function recordArtifactsCited(metrics2, plan) {
  const cited = [
    ...plan.planned.map((entry) => entry.artifact.path),
    ...plan.skipped.map((entry) => entry.path)
  ];
  for (const path31 of cited) {
    artifactsCited.increment(metrics2.ctx, 1, {
      harness: metrics2.harness,
      kind: getFilePreviewKind(path31)
    });
  }
}
function recordCloudAgentArtifactCopies(metrics2, outcome) {
  for (const artifact of outcome.synced) {
    artifactCopy.increment(metrics2.ctx, 1, {
      harness: metrics2.harness,
      kind: getFilePreviewKind(artifact.boxPath),
      outcome: "copied",
      reason: "none"
    });
  }
  for (const artifact of outcome.skipped) {
    artifactCopy.increment(metrics2.ctx, 1, {
      harness: metrics2.harness,
      kind: getFilePreviewKind(artifact.path),
      outcome: cloudAgentArtifactCopyOutcome(artifact.reason),
      reason: artifact.reason
    });
  }
}
var MAX_SYNCED_CLOUD_AGENT_ARTIFACTS = 12;
var MAX_SYNCED_CLOUD_AGENT_ARTIFACT_BYTES = 20 * 1024 * 1024;
var MAX_SYNCED_CLOUD_AGENT_ARTIFACTS_TOTAL_BYTES = 48 * 1024 * 1024;
function cloudAgentArtifactsBoxDir(bcId) {
  return `${SAND_CLOUD_AGENT_ARTIFACTS_BOX_ROOT}/${bcId}`;
}
function cloudAgentArtifactBoxPath(args) {
  const withoutRoot = args.absolutePath.startsWith(CLOUD_AGENT_ARTIFACTS_DIR) ? args.absolutePath.slice(CLOUD_AGENT_ARTIFACTS_DIR.length) : args.absolutePath;
  const segments = withoutRoot.split("/").filter((segment) => segment.length > 0 && segment !== ".");
  if (segments.length === 0 || segments.includes("..")) {
    return null;
  }
  return `${cloudAgentArtifactsBoxDir(args.bcId)}/${segments.join("/")}`;
}
function citedCloudAgentArtifacts(text2, artifacts) {
  const cited = new Set(
    citedCloudAgentArtifactPaths(
      text2,
      artifacts.map((artifact) => artifact.path)
    )
  );
  return artifacts.filter((artifact) => cited.has(artifact.path));
}
function planCloudAgentArtifacts(args) {
  const skipped2 = [];
  const planned = [];
  let plannedBytes = 0;
  for (const artifact of citedCloudAgentArtifacts(args.summary, args.artifacts)) {
    if (planned.length >= MAX_SYNCED_CLOUD_AGENT_ARTIFACTS) {
      skipped2.push({ ...artifact, reason: "over-count-limit" });
      continue;
    }
    if (artifact.sizeBytes > MAX_SYNCED_CLOUD_AGENT_ARTIFACT_BYTES) {
      skipped2.push({ ...artifact, reason: "over-size-limit" });
      continue;
    }
    if (plannedBytes + artifact.sizeBytes > MAX_SYNCED_CLOUD_AGENT_ARTIFACTS_TOTAL_BYTES) {
      skipped2.push({ ...artifact, reason: "over-total-budget" });
      continue;
    }
    const boxPath = cloudAgentArtifactBoxPath({ bcId: args.bcId, absolutePath: artifact.path });
    if (boxPath == null) {
      skipped2.push({ ...artifact, reason: "unsafe-path" });
      continue;
    }
    plannedBytes += artifact.sizeBytes;
    planned.push({ artifact, boxPath });
  }
  return { planned, skipped: skipped2 };
}
function plannedCloudAgentArtifactFiles(bcId, planned) {
  const dirPrefix = `${cloudAgentArtifactsBoxDir(bcId)}/`;
  return planned.map((entry) => ({
    relativePath: entry.boxPath.startsWith(dirPrefix) ? entry.boxPath.slice(dirPrefix.length) : entry.boxPath,
    boxPath: entry.boxPath,
    absolutePath: entry.artifact.path,
    sizeBytes: entry.artifact.sizeBytes
  }));
}
async function syncCloudAgentArtifactsToBox(args) {
  const skipped2 = [];
  const skip = (artifact, reason, sizeBytes = artifact.sizeBytes) => {
    skipped2.push({ path: artifact.path, sizeBytes, reason });
  };
  const candidates = args.planned;
  const fetched = await Promise.all(
    candidates.map(async (candidate) => {
      try {
        return await args.api.getArtifactBytes({
          bcId: args.bcId,
          absolutePath: candidate.artifact.path
        });
      } catch (error42) {
        return { failure: error42 };
      }
    })
  );
  const admitted = [];
  let totalBytes = 0;
  for (const [index, candidate] of candidates.entries()) {
    const content = fetched[index];
    if (content == null || "failure" in content) {
      skip(candidate.artifact, "fetch-failed");
      continue;
    }
    if (content.bytes.byteLength > MAX_SYNCED_CLOUD_AGENT_ARTIFACT_BYTES) {
      skip(candidate.artifact, "over-size-limit", content.bytes.byteLength);
      continue;
    }
    if (totalBytes + content.bytes.byteLength > MAX_SYNCED_CLOUD_AGENT_ARTIFACTS_TOTAL_BYTES) {
      skip(candidate.artifact, "over-total-budget", content.bytes.byteLength);
      continue;
    }
    totalBytes += content.bytes.byteLength;
    admitted.push({
      artifact: candidate.artifact,
      boxPath: candidate.boxPath,
      bytes: content.bytes
    });
  }
  const written = await Promise.all(
    admitted.map(async (entry) => {
      try {
        await args.writeBoxFile(entry.boxPath, entry.bytes);
        return { synced: { boxPath: entry.boxPath, sizeBytes: entry.bytes.byteLength } };
      } catch (error42) {
        return { failed: entry.artifact, sizeBytes: entry.bytes.byteLength, cause: error42 };
      }
    })
  );
  const synced = [];
  for (const result of written) {
    if ("failed" in result) {
      skip(result.failed, "write-failed", result.sizeBytes);
      continue;
    }
    synced.push(result.synced);
  }
  return { synced, skipped: skipped2 };
}
function formatCloudAgentArtifactsNote(bcId, outcome) {
  if (outcome.synced.length === 0 && outcome.skipped.length === 0) {
    return null;
  }
  const lines2 = [];
  if (outcome.synced.length > 0) {
    lines2.push(
      `The ${outcome.synced.length} artifact(s) the cloud agent's report references are copied to ${cloudAgentArtifactsBoxDir(bcId)}/ on your box:`,
      ...outcome.synced.map((artifact) => `- ${artifact.boxPath} (${artifact.sizeBytes} bytes)`),
      `These are files on your own box. Attach them to your completion message as SendMessage/SendToUser attachments, using each listed box path as a file:// url (file://${cloudAgentArtifactsBoxDir(bcId)}/\u2026). Never attach the cloud agent's own /opt/cursor/artifacts/\u2026 paths \u2014 they are on its VM, not your box.`
    );
  }
  if (outcome.skipped.length > 0) {
    lines2.push(
      `Not copied (${outcome.skipped.length}): ${outcome.skipped.map((artifact) => `${artifact.path} (${artifact.reason})`).join(
        ", "
      )}. For oversized artifacts, use the cursor.com-hosted URL from the run's PR body instead.`
    );
  }
  return lines2.join("\n");
}
async function augmentWatchResultWithArtifacts(args) {
  try {
    const summary = args.result.summary ?? "";
    if (summary.length === 0) {
      return args.result;
    }
    const artifacts = await args.api.listArtifacts(args.bcId);
    recordArtifactMetrics(args.metrics, (metrics2) => recordArtifactsListed(metrics2, artifacts));
    const plan = planCloudAgentArtifacts({ bcId: args.bcId, summary, artifacts });
    recordArtifactMetrics(args.metrics, (metrics2) => recordArtifactsCited(metrics2, plan));
    if (plan.planned.length === 0 && plan.skipped.length === 0) {
      return args.result;
    }
    const sync = args.sync ?? ((planned) => syncCloudAgentArtifactsToBox({
      api: args.api,
      writeBoxFile: args.writeBoxFile,
      bcId: args.bcId,
      planned
    }));
    const synced = await sync(plan.planned);
    const outcome = {
      synced: synced.synced,
      skipped: [...plan.skipped, ...synced.skipped]
    };
    recordArtifactMetrics(
      args.metrics,
      (metrics2) => recordCloudAgentArtifactCopies(metrics2, outcome)
    );
    const note = formatCloudAgentArtifactsNote(args.bcId, outcome);
    if (note != null) {
      return { ...args.result, text: `${args.result.text}

${note}` };
    }
  } catch (error42) {
    process.stderr.write(
      `sand.cloud_agent.artifact_sync_failed error_class=${errorLogTag(error42)}
`
    );
  }
  return args.result;
}
