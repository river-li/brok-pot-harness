var import_node_path41 = __toESM(require("node:path"), 1);
var LS_CHARACTER_BUDGET = 1e4;
function renderDirectoryTreeWithinBudget(rootDirectory, characterBudget) {
  characterBudget = characterBudget ?? LS_CHARACTER_BUDGET;
  let renderResult2 = renderDirectoryTree(rootDirectory);
  if (renderResult2.result.length > characterBudget) {
    renderResult2 = renderDirectoryTree(rootDirectory, true, 0);
    if (renderResult2.result.length > characterBudget) {
      renderResult2 = renderDirectoryTree(rootDirectory, false, 0);
    }
  }
  return renderResult2;
}
function renderDirectoryTree(rootDirectory, renderExtensionCounts = true, renderDepthLimit) {
  let atLeastOneExtensionCountRendered = false;
  const pathSep = rootDirectory.absPath.includes("\\") ? "\\" : "/";
  function _render(dir, depth) {
    const indent = "  ".repeat(depth);
    let result2;
    if (depth === 0) {
      const trailingSep = dir.absPath.endsWith(pathSep) ? "" : pathSep;
      result2 = `${dir.absPath}${trailingSep}
`;
    } else {
      const normalizedPath = dir.absPath.replaceAll(import_node_path41.default.win32.sep, import_node_path41.default.posix.sep);
      result2 = `${indent}- ${import_node_path41.default.posix.basename(normalizedPath)}${pathSep}
`;
    }
    const allChildren = [
      ...dir.childrenFiles.map((file2) => ({
        type: "file",
        name: file2.name,
        terminalMetadata: file2.terminalMetadata
      })),
      ...dir.childrenDirs.map((childDir) => {
        const normalizedPath = childDir.absPath.replaceAll(import_node_path41.default.win32.sep, import_node_path41.default.posix.sep);
        return {
          type: "dir",
          name: import_node_path41.default.posix.basename(normalizedPath),
          dir: childDir
        };
      })
    ];
    allChildren.sort((a, b2) => a.name.localeCompare(b2.name));
    const childIndent = "  ".repeat(depth + 1);
    for (const child of allChildren) {
      if (child.type === "file") {
        result2 += `${childIndent}- ${child.name}
`;
        if (child.terminalMetadata) {
          const time4 = (ms2) => new Date(Number(ms2)).toISOString();
          const ifDef = (value, f2) => value !== void 0 ? f2(value) : void 0;
          const meta = child.terminalMetadata;
          const metaIndent = `${childIndent}  `;
          if (meta.cwd) {
            result2 += `${metaIndent}cwd: ${meta.cwd}
`;
          }
          if (meta.lastModifiedMs) {
            result2 += `${metaIndent}last modified: ${time4(meta.lastModifiedMs)}
`;
          }
          const cmdFmt = (cmd) => {
            return [
              cmd.command,
              ifDef(cmd.exitCode, (v2) => `exit: ${v2}`),
              ifDef(cmd.timestampMs, (v2) => `time: ${time4(v2)}`),
              ifDef(cmd.durationMs, (v2) => `duration: ${v2}ms`)
            ].filter(Boolean).join(", ");
          };
          if (meta.lastCommands?.length > 0) {
            result2 += `${metaIndent}last commands:
`;
            for (const cmd of meta.lastCommands) {
              result2 += `${metaIndent}  - ${cmdFmt(cmd)}
`;
            }
          }
          if (meta.currentCommand) {
            result2 += `${metaIndent}current command:
`;
            const cmd = meta.currentCommand;
            result2 += `${metaIndent}  - ${cmdFmt(cmd)}
`;
          }
        }
      } else {
        const childDir = child.dir;
        if (childDir.childrenWereProcessed && (renderDepthLimit === void 0 || depth < renderDepthLimit)) {
          result2 += _render(childDir, depth + 1);
        } else {
          const extensionCounts = Object.entries(childDir.fullSubtreeExtensionCounts);
          if (extensionCounts.length > 0 && renderExtensionCounts) {
            const numTopExtensions = 3;
            let sortedExtensions = extensionCounts.sort(([extA, countA], [extB, countB]) => {
              if (countB !== countA) {
                return countB - countA;
              }
              return extA.localeCompare(extB);
            }).slice(0, numTopExtensions).map(([ext2, count]) => `${count} *${ext2 || "no-ext"}`).join(", ");
            if (extensionCounts.length > numTopExtensions) {
              sortedExtensions += ", ...";
            }
            const numFiles = childDir.numFiles;
            result2 += `${childIndent}- ${child.name}${pathSep}
`;
            result2 += `${childIndent}  [${numFiles} file${numFiles === 1 ? "" : "s"} in subtree: ${sortedExtensions}]
`;
            atLeastOneExtensionCountRendered = true;
          } else {
            result2 += `${childIndent}- ${child.name}${pathSep}...
`;
          }
        }
      }
    }
    return result2;
  }
  const result = _render(rootDirectory, 0);
  return { result, atLeastOneExtensionCountRendered };
}
