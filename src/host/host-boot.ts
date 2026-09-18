async function bootSandHost(runHostMain2) {
  activateHostLocale();
  await runHostMain2();
}
