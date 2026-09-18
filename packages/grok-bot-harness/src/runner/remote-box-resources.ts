init_esm2();
function mayChangeTabs(args) {
  return args.actions.some((step) => step.action.case !== "screenshot");
}
function createRemoteBoxResourceAccessor(host) {
  const box = host.remoteBox;
  const boxId = host.resolveBoxId();
  const agentId = host.getConversationId();
  let connectionPromise;
  let connectionAnswered = false;
  const preparedConnection = host.preparedRemoteBoxConnection;
  const dropConnection = () => {
    connectionPromise = void 0;
    connectionAnswered = false;
  };
  const connect3 = async (ctx) => {
    if (boxIsPreparing(box, boxId)) {
      throw new SandBoxNotReadyError("box_starting", SAND_BOX_NOT_READY_MESSAGE);
    }
    try {
      const connection = await (connectionPromise ??= (async () => await preparedConnection ?? box.ensureReady(ctx, boxId))());
      host.setRemoteBoxTerminalsFolder(connection.terminalsFolder);
      return connection;
    } catch (error41) {
      dropConnection();
      const reason = boxNotReadyReasonForError(error41);
      throw new SandBoxNotReadyError(reason.errorKind, reason.message, { cause: error41 });
    }
  };
  const markConnectionAnswered = () => {
    connectionAnswered = true;
  };
  const rethrowOnFreshConnection = (error41) => {
    if (!connectionAnswered && ConnectError.from(error41).code === Code.Unavailable) {
      dropConnection();
      throw new SandBoxNotReadyError("box_starting", SAND_BOX_NOT_READY_MESSAGE, {
        cause: error41
      });
    }
    throw error41;
  };
  const onFreshConnection = async (run) => {
    try {
      const result = await run();
      markConnectionAnswered();
      return result;
    } catch (error41) {
      return rethrowOnFreshConnection(error41);
    }
  };
  const audit = (ctx, kind, command) => {
    host.auditShellCommand(agentId, kind, command, "box", {
      ...turnAttributionFromContext(ctx, agentId),
      boxId
    });
  };
  const guardAutoReviewBarrier = () => host.autoReviewGate.assertNoPendingApproval();
  const ownsMonitorForShellNavigationAudit = (connection) => {
    if (!host.remoteBoxHasDesktop) return false;
    try {
      return !isNoMonitorComputerUseExecutor(
        connection.remoteAccessor.get(computerUseExecutorResource)
      );
    } catch {
      return false;
    }
  };
  const awaitShellNavigationBaseline = async (ctx, connection) => {
    if (!ownsMonitorForShellNavigationAudit(connection)) return;
    await host.computerUse.getOrCreateNavigationProbe()?.captureBaseline(ctx.withDetached(), connection.remoteAccessor, connection.windowIndex ?? 1);
  };
  const probeNavigationAfterShell = (ctx, connection) => {
    if (!ownsMonitorForShellNavigationAudit(connection)) return;
    host.probeNavigationAfterComputerUse(ctx, connection);
  };
  const accessor = new RegistryResourceAccessor();
  accessor.register(shellStreamExecutorResource, {
    execute: (ctx, args, options2) => (async function* () {
      guardAutoReviewBarrier();
      audit(ctx, "foreground", args.command);
      const connection = await connect3(ctx);
      guardAutoReviewBarrier();
      try {
        await awaitShellNavigationBaseline(ctx, connection);
        guardAutoReviewBarrier();
        for await (const chunk of connection.remoteAccessor.get(shellStreamExecutorResource).execute(ctx, args, options2)) {
          markConnectionAnswered();
          yield chunk;
        }
        markConnectionAnswered();
      } catch (error41) {
        rethrowOnFreshConnection(error41);
      } finally {
        probeNavigationAfterShell(ctx, connection);
      }
    })()
  });
  accessor.register(backgroundShellExecutorResource, {
    execute: async (ctx, args, options2) => {
      guardAutoReviewBarrier();
      audit(ctx, "background", args.command);
      const connection = await connect3(ctx);
      guardAutoReviewBarrier();
      try {
        return await onFreshConnection(async () => {
          await awaitShellNavigationBaseline(ctx, connection);
          guardAutoReviewBarrier();
          return await connection.remoteAccessor.get(backgroundShellExecutorResource).execute(ctx, args, options2);
        });
      } finally {
        probeNavigationAfterShell(ctx, connection);
      }
    }
  });
  accessor.register(readExecutorResource, {
    execute: async (ctx, args, options2) => {
      const managedSkill = host.readManagedSkill?.(args);
      if (managedSkill !== void 0) return await managedSkill;
      const connection = await connect3(ctx);
      return await onFreshConnection(
        () => connection.remoteAccessor.get(readExecutorResource).execute(ctx, args, options2)
      );
    }
  });
  accessor.register(shellExecutorResource, {
    execute: async (ctx, args, options2) => {
      guardAutoReviewBarrier();
      const connection = await connect3(ctx);
      guardAutoReviewBarrier();
      return await onFreshConnection(
        () => connection.remoteAccessor.get(shellExecutorResource).execute(ctx, args, options2)
      );
    }
  });
  accessor.register(computerUseExecutorResource, {
    execute: async (ctx, args, options2) => {
      const connection = await connect3(ctx);
      let ownsMonitor = false;
      try {
        const inner = connection.remoteAccessor.get(computerUseExecutorResource);
        if (isNoMonitorComputerUseExecutor(inner)) {
          throw new SandBoxNoMonitorAvailableError();
        }
        ownsMonitor = true;
        const windowIndex = connection.windowIndex ?? 1;
        void host.computerUse.getOrCreateNavigationProbe()?.captureBaseline(ctx.withDetached(), connection.remoteAccessor, windowIndex);
        return await onFreshConnection(async () => {
          await touchSandMonitorBusyLease(ctx, connection.remoteAccessor, windowIndex);
          guardAutoReviewBarrier();
          const result = await inner.execute(ctx, args, options2);
          host.computerUse.recordAuditIntent(args.actions[0]?.action.case);
          return result;
        });
      } catch (error41) {
        if (error41 instanceof SandBoxNoMonitorAvailableError) {
          dropConnection();
          const reason = boxNotReadyReasonForError(error41);
          throw new SandBoxNotReadyError(reason.errorKind, reason.message, { cause: error41 });
        }
        throw error41;
      } finally {
        if (ownsMonitor) {
          host.probeNavigationAfterComputerUse(ctx, connection);
          if (mayChangeTabs(args)) void host.computerUse.sweepTabs(ctx, connection);
        }
      }
    }
  });
  if (host.autoReviewClassifierExecutor !== void 0 && Object.values(host.autoReviewGate.currentModes()).some((mode) => mode !== "off")) {
    accessor.register(smartModeClassifierExecutorResource, host.autoReviewClassifierExecutor);
  }
  return accessor;
}
