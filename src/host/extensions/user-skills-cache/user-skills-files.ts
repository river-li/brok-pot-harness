/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/user-skills-cache/user-skills-files.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var libraryFs = createLocalBrainDocsFs();
async function fingerprintUserSkillsLibrary(libraryDir) {
  const tree = await libraryFs.readTree([libraryDir]);
  return userSkillsFingerprintOfTree(tree, libraryDir);
}

