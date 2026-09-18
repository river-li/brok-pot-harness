init_shell_exec_pb();
function buildHostShellArgs({
  command,
  name: name17,
  workingDirectory,
  toolCallId,
  timeoutMs
}) {
  return new ShellArgs({
    command,
    workingDirectory,
    toolCallId,
    timeout: timeoutMs,
    skipApproval: true,
    parsingResult: new ShellCommandParsingResult({
      parsingFailed: false,
      executableCommands: [
        new ShellCommandParsingResult_ExecutableCommand({
          name: name17,
          args: [],
          fullText: command
        })
      ],
      hasRedirects: false,
      hasCommandSubstitution: false
    })
  });
}
