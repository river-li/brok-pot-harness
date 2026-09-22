/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/prompts/cloud/no-repository-access.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function noRepositoryAccessBullets() {
  return [
    `This agent was launched WITHOUT a repository: no source code is checked out in your workspace and you have no access to the team's repositories or SCM credentials. Do not attempt to clone the team's repositories, push branches, or create pull requests \u2014 these will fail. Do not treat the missing checkout as an environment error or spend time trying to restore repository access.`,
    `If the task requires reading or modifying code in a repository, explain that this conversation runs without repository access and suggest starting the agent from a surface with repository access (for example cursor.com/agents) instead.`
  ];
}
function selfHostedRepositoryBootstrapBullets() {
  return [
    `This self-hosted agent was launched without a repository checkout. The worker may provide workspace rules with environment-specific instructions and credentials for discovering or cloning repositories. Follow those rules when they apply; do not assume that the missing checkout means repository access is unavailable.`,
    `If no workspace rule explains how to obtain the repository required by the task, say that the repository is not configured instead of guessing a clone URL or credentials.`
  ];
}

