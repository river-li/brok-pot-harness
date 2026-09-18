init_errors();
function cloudAgentTranscriptDumpPath(bcId) {
  return `cloud-agent-transcripts/${bcId}.jsonl`;
}
async function dumpCloudAgentTranscript(args) {
  const dump2 = await args.api.getTranscriptDump({ bcId: args.bcId });
  if (dump2 == null) {
    return null;
  }
  if (dump2.lineCount === 0) {
    return { run: dump2.run, lineCount: 0 };
  }
  const path31 = cloudAgentTranscriptDumpPath(args.bcId);
  const data = new TextEncoder().encode(dump2.jsonl);
  await args.writeBoxFile(path31, data);
  return {
    run: dump2.run,
    lineCount: dump2.lineCount,
    file: { path: path31, sizeBytes: data.byteLength }
  };
}
function formatCloudAgentDumpCompletionLine(file2, lineCount) {
  return `Full transcript dumped to ${file2.path} (${file2.sizeBytes} bytes, ${lineCount} message lines). Read it with your shell tools; \`tail -n 1 ${file2.path}\` gives the final assistant report.`;
}
async function augmentWatchResultWithTranscriptDump(args) {
  try {
    const outcome = await dumpCloudAgentTranscript({
      api: args.api,
      writeBoxFile: args.writeBoxFile,
      bcId: args.bcId
    });
    if (outcome?.file != null) {
      return {
        ...args.result,
        text: `${args.result.text}

${formatCloudAgentDumpCompletionLine(
          outcome.file,
          outcome.lineCount
        )}`
      };
    }
  } catch (error41) {
    process.stderr.write(
      `sand.cloud_agent.transcript_dump_failed error_class=${errorLogTag(error41)}
`
    );
  }
  return args.result;
}
