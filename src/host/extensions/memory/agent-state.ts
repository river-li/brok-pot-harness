function describeAutomationWrite(automation, verb) {
  if (automation == null) {
    return stateWriteFailed(
      "the routine could not be saved \u2014 check that the name and instruction are non-empty and the trigger is valid."
    );
  }
  return stateWriteOk(
    `${verb} routine "${automation.name}" (folder ${automation.id}) \u2014 ${describeTrigger(
      automation.trigger
    )}${automation.isEnabled ? "" : ", paused"}.`
  );
}
function memoryShardFor(deps, scope) {
  if (scope === "user") {
    return {
      store: new FileMemoryStore(getUserMemoryShardDir(deps.sandRoot, deps.agentId)),
      label: "shared user memory"
    };
  }
  return { store: deps.memory, label: "your memory" };
}
async function replaceAvatarFiles(agentDir, file2) {
  await (0, import_promises61.mkdir)(agentDir, { recursive: true });
  for (const name17 of listConventionalAvatarFilenames(agentDir)) {
    await (0, import_promises61.rm)((0, import_node_path124.join)(agentDir, name17), { force: true });
  }
  if (file2 != null) {
    await (0, import_promises61.writeFile)((0, import_node_path124.join)(agentDir, file2.filename), file2.bytes);
  }
  invalidateAvatarDataUrlCache(agentDir);
}
function rememberFact(store, content, tier, now, label) {
  const body = tier === "note" ? `${MEMORY_NOTE_PREFIX}${content.trim()}` : content;
  const record2 = store.addMemory(body, now, tier === "profile" ? "profile" : "log");
  if (record2 == null) {
    return stateWriteFailed(
      `nothing was saved to ${label} \u2014 the fact was empty or already recorded. Grep the memory folder to see what is already there.`
    );
  }
  return stateWriteOk(`Remembered in ${label} (${tier}): ${record2.content}`);
}
function forgetFact(store, content, label) {
  return store.removeMemoryByContent(content) ? stateWriteOk(`Forgot from ${label}: ${normalizeMemoryContent(content)}`) : stateWriteFailed(
    `no fact with exactly that text is recorded in ${label}. Read or grep the folder for the exact wording first.`
  );
}
function createSandAgentState(deps) {
  const now = deps.now ?? Date.now;
  const profilePath = getSandProfilePath(deps.agentDir);
  const settingsPath = getSandSettingsPath(deps.agentDir);
  return {
    async writeMemory({ content, tier, scope = "agent" }) {
      const shard = memoryShardFor(deps, scope);
      const outcome = rememberFact(shard.store, content, tier, now(), shard.label);
      if (outcome.ok && scope === "user") deps.onUserMemoryWritten?.();
      return outcome;
    },
    async removeMemory({ content, scope = "agent" }) {
      const shard = memoryShardFor(deps, scope);
      const outcome = forgetFact(shard.store, content, shard.label);
      if (outcome.ok && scope === "user") deps.onUserMemoryWritten?.();
      return outcome;
    },
    async createAutomation({ spec, provenance }) {
      return describeAutomationWrite(deps.automations.upsert(spec, provenance, now()), "Saved");
    },
    async updateAutomation({ id, spec, provenance }) {
      const updated = deps.automations.update(id, spec, provenance);
      if (updated == null) {
        return stateWriteFailed(
          `no routine with folder "${id}" exists, or the new fields were invalid.`
        );
      }
      return describeAutomationWrite(updated, "Updated");
    },
    async setAutomationEnabled({ id, isEnabled }) {
      const updated = deps.automations.setEnabled(id, isEnabled);
      if (updated == null) {
        return stateWriteFailed(`no routine with folder "${id}" exists.`);
      }
      return stateWriteOk(
        `${isEnabled ? "Resumed" : "Paused"} routine "${updated.name}" (folder ${updated.id}).`
      );
    },
    async deleteAutomation({ id }) {
      const existing = deps.automations.get(id);
      if (!deps.automations.remove(id)) {
        return stateWriteFailed(`no routine with folder "${id}" exists.`);
      }
      return stateWriteOk(`Deleted routine "${existing?.name ?? id}" (folder ${id}).`);
    },
    async writeSkill(args) {
      const spec = {
        name: args.name,
        description: args.description,
        body: args.body,
        trigger: null
      };
      const written = args.id == null ? deps.skills.create(spec, args.provenance) : deps.skills.update(args.id, spec, args.provenance);
      if (written == null) {
        return stateWriteFailed(
          args.id == null ? "the skill could not be saved \u2014 a name and a non-empty body are both required." : `no skill with id "${args.id}" exists, or the new fields were invalid. Cursor-managed skills cannot be edited.`
        );
      }
      return stateWriteOk(
        `${args.id == null ? "Saved" : "Updated"} skill "${written.name}" (id ${written.id}).`
      );
    },
    async deleteSkill({ id }) {
      return deps.skills.remove(id) ? stateWriteOk(`Deleted skill ${id}.`) : stateWriteFailed(
        `no skill with id "${id}" exists, or it is a Cursor-managed skill, which cannot be deleted.`
      );
    },
    async updateProfile(args) {
      const refusal = refuseSandProfileUpdate(args);
      if (refusal !== null) return refusal;
      const current = readSandProfileFile(profilePath);
      const trimmedNewName = args.name?.trim();
      const isRename = trimmedNewName != null && trimmedNewName !== current?.name.trim();
      const namedBy = isRename ? "user" : current?.namedBy;
      writeSandProfileFile(profilePath, {
        name: trimmedNewName ?? current?.name ?? "",
        description: args.description?.trim() ?? current?.description ?? "",
        title: args.title?.trim() ?? current?.title ?? "",
        avatarShape: args.avatarShape?.trim() ?? current?.avatarShape ?? "",
        avatarColor: args.avatarColor?.trim() ?? current?.avatarColor ?? "",
        ...namedBy == null ? {} : { namedBy }
      });
      return stateWriteOk(describeSandProfileUpdate(args));
    },
    async updateSettings(args) {
      const update = {
        ...args.hiddenFromSidebar !== void 0 ? { hiddenFromSidebar: args.hiddenFromSidebar } : {},
        ...args.notifyOnAgentUpdates !== void 0 ? { notifyOnAgentUpdates: args.notifyOnAgentUpdates } : {}
      };
      const fields2 = Object.keys(update);
      if (fields2.length === 0) {
        return stateWriteFailed("nothing to change \u2014 pass at least one setting field.");
      }
      writeSandSettingsFile(settingsPath, update);
      return stateWriteOk(`Updated your settings: ${fields2.join(", ")}.`);
    },
    async disconnectChannel({ platform: platform2 }) {
      return deps.channels.remove(platform2) ? stateWriteOk(
        `Disconnected ${platform2}. The connector closes the live connection within a few seconds.`
      ) : stateWriteFailed(`${platform2} is not connected.`);
    },
    async setAvatar({ path: sourcePath }) {
      const trimmed = sourcePath.trim();
      if (trimmed.length === 0) {
        return stateWriteFailed("pass the path of an image file to install.");
      }
      const absolute = (0, import_node_path124.isAbsolute)(trimmed) ? trimmed : (0, import_node_path124.resolve)(trimmed);
      let bytes = null;
      try {
        bytes = await (0, import_promises61.readFile)(absolute);
      } catch {
        if (deps.readBoxFile != null && isBoxRootPath(absolute)) {
          try {
            const pulled = await deps.readBoxFile(absolute);
            bytes = Buffer.from(pulled);
          } catch (error42) {
            reportFallback("agent_state", error42);
            bytes = null;
          }
        }
      }
      if (bytes == null) {
        return stateWriteFailed(
          isBoxRootPath(absolute) ? `could not read "${(0, import_node_path124.basename)(absolute)}" from your box \u2014 write the image with Shell (or CopyFromBox onto a host path) first, then pass that path.` : `could not read "${(0, import_node_path124.basename)(absolute)}" \u2014 download or write the image somewhere first, then pass that path.`
        );
      }
      if (bytes.length === 0 || bytes.length > AVATAR_MAX_BYTES) {
        return stateWriteFailed(
          `the image must be under ${AVATAR_MAX_BYTES / (1024 * 1024)} MB and non-empty.`
        );
      }
      const mime2 = sniffAvatarMimeType(bytes);
      const ext2 = mime2 == null ? null : extensionForMime(mime2);
      if (ext2 == null) {
        return stateWriteFailed(
          "that file is not a recognized image (png, jpg, webp, gif, or svg)."
        );
      }
      const filename = ext2 === "png" ? CANONICAL_AVATAR_FILENAME : `avatar.${ext2}`;
      await replaceAvatarFiles(deps.agentDir, { filename, bytes });
      return stateWriteOk(
        `Updated your picture (${filename}). Source ${(0, import_node_path124.basename)(absolute)} can be deleted if you no longer need it.`
      );
    },
    async clearAvatar() {
      if (listConventionalAvatarFilenames(deps.agentDir).length === 0) {
        return stateWriteFailed("you already have the default picture.");
      }
      await replaceAvatarFiles(deps.agentDir, null);
      return stateWriteOk("Cleared your picture \u2014 back to the default.");
    }
  };
}
