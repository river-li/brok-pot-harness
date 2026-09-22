#!/usr/bin/env node
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const {
  importLocalPlugin,
  listLocalPluginPointers,
  localPluginId,
} = require("../dist/local/plugin-files.js");
try {
  const [command, source, option, name] = process.argv.slice(2);
  const data = path.join(root, ".runtime/data");
  if (
    command === "import" &&
    source &&
    (option === undefined || (option === "--name" && name))
  ) {
    const imported = importLocalPlugin(data, path.resolve(source), name);
    console.log(
      `Imported ${imported.slug} (plugin ${imported.pluginId}) into ${imported.path}`,
    );
    console.log(
      "Open Plugins in the local desktop to install it. Importing does not execute the bundle.",
    );
  } else if (command === "list") {
    for (const p of listLocalPluginPointers(data))
      console.log(`${localPluginId(p.slug)}\t${p.slug}\t${p.digest}`);
  } else
    throw Error(
      "Usage: npm run plugins -- import /path/to/plugin [--name local-name]\n       npm run plugins -- list",
    );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
