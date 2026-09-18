function consumeEnvironmentVariable(env, name17) {
  const value = env[name17];
  delete env[name17];
  return value?.trim();
}
