var libraryFs = createLocalBrainDocsFs();
async function fingerprintUserSkillsLibrary(libraryDir) {
  const tree = await libraryFs.readTree([libraryDir]);
  return userSkillsFingerprintOfTree(tree, libraryDir);
}
