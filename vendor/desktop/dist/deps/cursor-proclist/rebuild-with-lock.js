// Copyright Anysphere Inc.

/**
 * Serializes `node-gyp rebuild` runs for this module across concurrent
 * installers.
 *
 * cursor-proclist is a `file:` dependency of both vscode/package.json and
 * vscode/remote/package.json, so npm symlinks BOTH node_modules entries to
 * this one physical directory. vscode's postinstall (build/npm/postinstall.js)
 * runs the per-directory npm installs AND build/npm/postinstall_anysphere.js
 * in parallel, which used to let two `node-gyp rebuild` invocations race in
 * this directory. `rebuild` starts with a `clean` (rm -rf build), so each run
 * deletes the other's in-progress configure/build state — observed as
 * "gyp ERR! ... `gyp` failed with exit code: null", missing .deps files, or
 * ENOENT on build/node_gyp_bins, depending on where the loser was killed.
 *
 * The module is N-API (node-addon-api), so whichever rebuild lands last (Node
 * or Electron headers) loads fine in both runtimes; the only problem is the
 * concurrent overlap, which this lock removes.
 *
 * The lock mirrors tools/anycli/src/lib/fileLock.ts in dependency-free CJS:
 * an atomically published lock file whose content (pids + timestamp) is the
 * ownership token. The holder records both its own pid and the spawned
 * node-gyp child's pid and refreshes the file's mtime while the build runs;
 * waiters steal only when every recorded pid is dead (the mtime backstop
 * applies only when no pid is parseable), and both steal and release delete
 * the file only while it still contains the exact judged content — so a live
 * holder (or its orphaned build, if the wrapper is SIGKILL'd) is never stolen
 * from, and a stolen-then-reacquired lock is never deleted by the previous
 * holder's exit.
 *
 * Usage:
 *   node rebuild-with-lock.js                  -> resolves a node-gyp JS
 *                                                 entrypoint (see
 *                                                 resolveNodeGypJs) and runs
 *                                                 `node <entry> rebuild`
 *                                                 (npm install-script path)
 *   node rebuild-with-lock.js <node-gyp.js>    -> `node <node-gyp.js> rebuild`
 *                                                 (postinstall_anysphere path)
 */

'use strict';

const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const LOCK_FILE = path.join(__dirname, '.gyp-build.lock');
// Backstop for a holder that died without releasing AND whose pid can no
// longer be judged (unparseable content, pid recycled by another user's
// process). The holder refreshes mtime every REFRESH_INTERVAL_MS, so a live
// build never trips this no matter how long it takes.
const STALE_LOCK_MS = 10 * 60 * 1000;
const REFRESH_INTERVAL_MS = Math.floor(STALE_LOCK_MS / 4);
const POLL_INTERVAL_MS = 500;
// Give up eventually if a live holder never finishes (hung build).
const MAX_WAIT_MS = 30 * 60 * 1000;

function isPidRunning(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch (err) {
		// EPERM: the pid exists but belongs to another user.
		return err.code === 'EPERM';
	}
}

/**
 * Atomically publish the lock file with its content already in place (tmp
 * file + link, so a waiter never reads an empty half-written lock and wrongly
 * judges it stale). Returns true when the lock was acquired.
 */
function tryAcquire(content) {
	const tmpPath = `${LOCK_FILE}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
	fs.writeFileSync(tmpPath, content);
	try {
		fs.linkSync(tmpPath, LOCK_FILE);
		return true;
	} catch (err) {
		if (err.code !== 'EEXIST') {
			throw err;
		}
		return false;
	} finally {
		try {
			fs.unlinkSync(tmpPath);
		} catch {
			// best effort
		}
	}
}

/**
 * All pids recorded in a lock file: line 1 is the wrapper pid, and a
 * `child:<pid>` line (appended once node-gyp is spawned) is the detached
 * build process-group leader.
 */
function parseLockPids(raw) {
	const pids = [];
	const lines = raw.split('\n');
	const wrapperPid = Number.parseInt(lines[0] ?? '', 10);
	if (Number.isFinite(wrapperPid) && wrapperPid > 0) {
		pids.push(wrapperPid);
	}
	for (const line of lines) {
		const match = /^child:(\d+)$/.exec(line);
		if (match) {
			const childPid = Number.parseInt(match[1], 10);
			if (Number.isFinite(childPid) && childPid > 0) {
				pids.push(childPid);
			}
		}
	}
	return pids;
}

/**
 * When the lock is stale (every recorded pid dead, or mtime unrefreshed past
 * the stale window), return its exact content for a guarded reclaim;
 * otherwise return undefined. Both the wrapper pid AND the recorded child pid
 * must be dead: the child is a detached process-group leader, so a SIGKILL'd
 * or crashed wrapper leaves it building — stealing on the wrapper pid alone
 * would restart the exact overlapping rebuild this lock prevents. Never
 * judges a live holder stale on mtime alone unless no pid is parseable.
 */
function readStaleLockContent() {
	try {
		const mtimeMs = fs.statSync(LOCK_FILE).mtimeMs;
		const raw = fs.readFileSync(LOCK_FILE, 'utf8');
		const pids = parseLockPids(raw);
		if (pids.length > 0) {
			return pids.some(isPidRunning) ? undefined : raw;
		}
		// No parseable pid: fall back to the mtime backstop only.
		return Date.now() - mtimeMs > STALE_LOCK_MS ? raw : undefined;
	} catch {
		// ENOENT (already released) or transient read error: nothing to steal.
		return undefined;
	}
}

/**
 * Delete the lock only while it still holds `expectedContent` (our ownership
 * token, or the exact stale content a reclaim judged). Compare-then-unlink
 * has a tiny TOCTOU window, but content is unique per holder (pid +
 * timestamp), which shrinks "any waiter deletes any holder's lock" to a
 * sub-millisecond race — same trade-off as tools/anycli's fileLock.
 */
function unlinkIfContentMatches(expectedContent) {
	try {
		if (fs.readFileSync(LOCK_FILE, 'utf8') === expectedContent) {
			fs.unlinkSync(LOCK_FILE);
		}
	} catch {
		// ENOENT: already released/reclaimed.
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Acquire the lock; resolves to `{ release, recordChildPid }`.
 * `recordChildPid` appends a `child:<pid>` line to the held lock so waiters'
 * staleness checks also see the detached build process (see
 * readStaleLockContent).
 */
async function acquireLock() {
	let content = `${process.pid}\n${new Date().toISOString()}\ncursor-proclist rebuild\n`;
	const start = Date.now();
	let waiting = false;
	while (!tryAcquire(content)) {
		const staleContent = readStaleLockContent();
		if (staleContent !== undefined) {
			console.log('[cursor-proclist] removing stale build lock (holder is gone)');
			unlinkIfContentMatches(staleContent);
			continue;
		}
		if (Date.now() - start > MAX_WAIT_MS) {
			throw new Error(`timed out waiting for build lock at ${LOCK_FILE}`);
		}
		if (!waiting) {
			waiting = true;
			console.log('[cursor-proclist] another node-gyp rebuild is in progress, waiting for it to finish...');
		}
		await sleep(POLL_INTERVAL_MS);
	}

	// Keep the mtime fresh while the build runs so the stale backstop never
	// fires against a live holder; refresh only while the content is still
	// ours (never keep alive a lock someone force-reclaimed and reacquired).
	const refreshTimer = setInterval(() => {
		try {
			if (fs.readFileSync(LOCK_FILE, 'utf8') === content) {
				const now = new Date();
				fs.utimesSync(LOCK_FILE, now, now);
			}
		} catch {
			// best effort
		}
	}, REFRESH_INTERVAL_MS);
	refreshTimer.unref?.();

	return {
		release: () => {
			clearInterval(refreshTimer);
			unlinkIfContentMatches(content);
		},
		recordChildPid: pid => {
			const newContent = `${content}child:${pid}\n`;
			const tmpPath = `${LOCK_FILE}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
			try {
				fs.writeFileSync(tmpPath, newContent);
				// Rename keeps the lock file continuously present (a waiter's
				// link() keeps failing with EEXIST throughout). Same
				// compare-then-swap TOCTOU class as unlinkIfContentMatches.
				if (fs.readFileSync(LOCK_FILE, 'utf8') === content) {
					fs.renameSync(tmpPath, LOCK_FILE);
					content = newContent;
				}
			} catch {
				// best effort: worst case waiters judge staleness on the wrapper pid only
			} finally {
				try {
					fs.unlinkSync(tmpPath);
				} catch {
					// already renamed or never created
				}
			}
		},
	};
}

/**
 * The node-gyp JS entrypoint to run with `node <entry> rebuild` (no shell).
 * Precedence:
 *   1. argv[2] — explicit entry from the caller (postinstall_anysphere.js).
 *   2. npm_config_node_gyp when it points at a .js file — npm sets it to its
 *      own bundled node-gyp.js for install scripts. vscode's postinstall sets
 *      it to a .bin shim (POSIX shell script / .cmd), which `node` cannot
 *      execute, so those fall through to the repo copies below.
 *   3. vscode's pinned copy at build/npm/gyp (what the .bin shim points at —
 *      the version postinstall.js intends installs to use).
 *   4. Any node-gyp resolvable from this module's node_modules chain.
 */
function resolveNodeGypJs() {
	const explicit = process.argv[2];
	if (explicit) {
		return explicit;
	}
	const fromNpm = process.env['npm_config_node_gyp'];
	if (fromNpm && fromNpm.endsWith('.js') && fs.existsSync(fromNpm)) {
		return fromNpm;
	}
	const bundled = path.join(__dirname, '..', '..', 'build', 'npm', 'gyp', 'node_modules', 'node-gyp', 'bin', 'node-gyp.js');
	if (fs.existsSync(bundled)) {
		return bundled;
	}
	try {
		return require.resolve('node-gyp/bin/node-gyp.js');
	} catch {
		return undefined;
	}
}

async function main() {
	const gypEntry = resolveNodeGypJs();
	if (!gypEntry) {
		console.error('[cursor-proclist] could not locate a node-gyp entrypoint (pass one as the first argument)');
		process.exit(1);
	}

	const { release, recordChildPid } = await acquireLock();
	process.on('exit', release);

	// POSIX: detached makes the child a process-group leader so a forwarded
	// signal reaches node-gyp's whole descendant tree (gyp python, make, the
	// compilers) — killing only the direct child leaves that tree touching
	// build/ after we release the lock.
	const detached = process.platform !== 'win32';
	const child = cp.spawn(process.execPath, [gypEntry, 'rebuild'], { cwd: __dirname, stdio: 'inherit', detached });

	// Record the detached child in the lock: if this wrapper is SIGKILL'd or
	// crashes, the orphaned build keeps running, and waiters must not steal
	// the lock until that child is gone too.
	if (typeof child.pid === 'number') {
		recordChildPid(child.pid);
	}

	// Forward termination signals to the child's process group and exit only
	// once the child is gone: exiting immediately would release the lock while
	// the orphaned node-gyp is still touching build/, letting a new holder
	// start the exact overlapping rebuild this lock exists to prevent.
	let forwardedSignal = null;
	const forward = signal => {
		forwardedSignal = signal;
		if (detached && typeof child.pid === 'number') {
			try {
				process.kill(-child.pid, signal);
				return;
			} catch {
				// Group already gone or not a leader; fall through.
			}
		}
		child.kill(signal);
	};
	process.on('SIGINT', () => forward('SIGINT'));
	process.on('SIGTERM', () => forward('SIGTERM'));

	child.on('error', err => {
		console.error(`[cursor-proclist] failed to spawn node-gyp: ${err}`);
		process.exit(1);
	});
	child.on('close', (code, signal) => {
		if (signal || forwardedSignal) {
			console.error(`[cursor-proclist] node-gyp was killed by ${signal ?? forwardedSignal}`);
			process.exit(1);
		}
		process.exit(code ?? 1);
	});
}

main().catch(err => {
	console.error(`[cursor-proclist] ${err}`);
	process.exit(1);
});
