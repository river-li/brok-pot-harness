/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/shell/retry-helpers.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var NETWORK_COMMANDS = [
  "curl",
  "wget",
  "ping",
  "nslookup",
  "dig",
  "host",
  "traceroute",
  "telnet",
  "nc",
  "netcat",
  "ifconfig",
  "ip",
  "iwconfig",
  "iwlist",
  "arp",
  "route",
  "iptables",
  "ufw",
  "firewall-cmd",
  "ss",
  "netstat",
  "lsof",
  "tcpdump",
  "wireshark",
  "tshark",
  "nmap",
  "masscan",
  "zmap",
  "ssh",
  "scp",
  "rsync",
  "git",
  "pip",
  "apt",
  "yum",
  "brew",
  "docker",
  "kubectl",
  "aws",
  "gcloud",
  "az",
  "terraform",
  "ansible",
  "mvn",
  "gradle",
  "composer",
  "cargo",
  "go",
  "nuget",
  "gem",
  "bundle",
  "npm install",
  "yarn install",
  "pnpm install",
  "pip install",
  "apt install",
  "yum install",
  "brew install",
  "docker pull",
  "docker push",
  "git clone",
  "git pull",
  "git push",
  "git fetch",
  "ssh",
  "scp",
  "rsync"
];
function isNetworkCommand(command) {
  const normalizedCommand = command.trim().toLowerCase();
  return NETWORK_COMMANDS.some((networkCmd) => normalizedCommand.startsWith(networkCmd.toLowerCase()));
}
function analyzeFailure(exitCode, stderr, command) {
  const s3 = stderr || "";
  if (command && isNetworkCommand(command)) {
    return "network";
  }
  const looksNetwork = /connection refused|network is unreachable|no route to host|timeout|could not resolve host|name or service not known|temporary failure in name resolution|connection timed out|connection reset by peer|host unreachable/i.test(s3);
  if (looksNetwork)
    return "network";
  const looksSandbox = (exitCode ?? -1) !== 0 && /operation not permitted|EPERM|EACCES/i.test(s3);
  return looksSandbox ? "sandbox" : "unknown";
}

