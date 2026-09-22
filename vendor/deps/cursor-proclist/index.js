// Copyright Anysphere Inc.

/**
 * JavaScript wrapper for the native cursor_proclist module
 *
 * cursor_proclist_scan_async(roots?: number[]) resolves to an array of process tuples, each:
 * [pid, ppid, name, extensionId, cpuTimeMs, memoryMB, argv, ownerAgentId, requestId]
 *
 * roots defaults to the current process when omitted, empty, or invalid. Multiple roots
 * are unioned into one scan and de-duplicated, so disjoint trees (for example a reparented
 * daemon) are captured without double-counting shared descendants.
 */

const binding = require('./build/Release/cursor_proclist.node');

module.exports = {
	cursor_proclist_scan_async: binding.cursor_proclist_scan_async,
	// () => { totalBytes, availableBytes, pressureLevel? } | null
	// Non-null only where a native read exists (macOS); callers fall back to
	// os.freemem()-based logic elsewhere.
	cursor_proclist_system_memory: binding.cursor_proclist_system_memory
};
