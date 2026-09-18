#!/exec-daemon/node

import {
  closeSync,
  constants as fsConstants,
  fstatSync,
  openSync,
  readSync,
} from "node:fs";
import { pathToFileURL } from "node:url";

export const SAND_WALLPAPER_SCHEDULE = Object.freeze([
  Object.freeze({ tone: "b", startHour: 4 }),
  Object.freeze({ tone: "a", startHour: 8 }),
  Object.freeze({ tone: "b", startHour: 16 }),
  Object.freeze({ tone: "c", startHour: 20 }),
]);

export const FALLBACK_TIME_ZONE = "UTC";

export const MIN_SLEEP_SECONDS = 30;
export const MAX_SLEEP_SECONDS = 13 * 3600;

export function resolveWallpaperTone(localHour, daylightSaving = false) {
  const shift = daylightSaving ? 1 : 0;
  let selected = SAND_WALLPAPER_SCHEDULE[SAND_WALLPAPER_SCHEDULE.length - 1];
  for (const entry of SAND_WALLPAPER_SCHEDULE) {
    if (localHour >= entry.startHour + shift) selected = entry;
  }
  return selected.tone;
}

export function isSupportedTimeZone(timeZone) {
  if (typeof timeZone !== "string" || timeZone === "") return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

const MAX_SETTINGS_BYTES = 1024 * 1024;

function readRegularFileSync(path) {
  let fd;
  try {
    fd = openSync(path, fsConstants.O_RDONLY | fsConstants.O_NONBLOCK);
    const stat = fstatSync(fd);
    if (!stat.isFile() || stat.size > MAX_SETTINGS_BYTES) return undefined;
    const buffer = Buffer.allocUnsafe(stat.size);
    let filled = 0;
    while (filled < stat.size) {
      const read = readSync(fd, buffer, filled, stat.size - filled, filled);
      if (read <= 0) break;
      filled += read;
    }
    return buffer.subarray(0, filled).toString("utf8");
  } catch {
    return undefined;
  } finally {
    if (fd !== undefined) {
      try {
        closeSync(fd);
      } catch (error) {
        console.error(`sand-wallpaper-tone: closing ${path} failed: ${String(error)}`);
      }
    }
  }
}

function readRawPersistedTimeZone(settingsPath) {
  let settings;
  try {
    settings = JSON.parse(readRegularFileSync(settingsPath) ?? "");
  } catch {
    return undefined;
  }
  const override = settings?.userTimeZoneOverride;
  return typeof override === "string" && override !== ""
    ? override
    : settings?.userTimeZone;
}

export function readEffectiveTimeZone(settingsPath) {
  const persisted = readRawPersistedTimeZone(settingsPath);
  return isSupportedTimeZone(persisted) ? persisted : FALLBACK_TIME_ZONE;
}

const zonePartsFormatterCache = new Map();

function zoneParts(timeZone, epochMs) {
  let formatter = zonePartsFormatterCache.get(timeZone);
  if (formatter === undefined) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    zonePartsFormatterCache.set(timeZone, formatter);
  }
  const parts = formatter.formatToParts(new Date(epochMs));
  const read = (type) => Number(parts.find((part) => part.type === type).value);
  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  };
}

function zoneOffsetMs(timeZone, epochMs) {
  const parts = zoneParts(timeZone, epochMs);
  const asIfUTC = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return asIfUTC - Math.floor(epochMs / 1000) * 1000;
}

const standardOffsetCache = new Map();

function standardOffsetMs(timeZone, year) {
  const key = `${timeZone}:${year}`;
  const cached = standardOffsetCache.get(key);
  if (cached !== undefined) return cached;
  let standard = Number.POSITIVE_INFINITY;
  for (let month = 0; month < 12; month++) {
    for (const day of [1, 15]) {
      standard = Math.min(
        standard,
        zoneOffsetMs(timeZone, Date.UTC(year, month, day, 12))
      );
    }
  }
  standardOffsetCache.set(key, standard);
  return standard;
}

function isDaylightSavingTime(timeZone, epochMs) {
  const { year } = zoneParts(timeZone, epochMs);
  return zoneOffsetMs(timeZone, epochMs) > standardOffsetMs(timeZone, year);
}

function wallClockToEpochMs(timeZone, { year, month, day, hour }) {
  const naive = Date.UTC(year, month - 1, day, hour);
  const firstPass = naive - zoneOffsetMs(timeZone, naive);
  return naive - zoneOffsetMs(timeZone, firstPass);
}

export function computeWallpaperPlan({ nowMs, timeZone }) {
  const zone = isSupportedTimeZone(timeZone) ? timeZone : FALLBACK_TIME_ZONE;
  const now = zoneParts(zone, nowMs);
  const daylightSaving = isDaylightSavingTime(zone, nowMs);
  let nextBoundaryMs = Number.POSITIVE_INFINITY;
  for (const dayOffset of [0, 1, 2]) {
    const date = new Date(
      Date.UTC(now.year, now.month - 1, now.day + dayOffset)
    );
    for (const { startHour } of SAND_WALLPAPER_SCHEDULE) {
      for (const shifted of [false, true]) {
        const hour = startHour + (shifted ? 1 : 0);
        const at = wallClockToEpochMs(zone, {
          year: date.getUTCFullYear(),
          month: date.getUTCMonth() + 1,
          day: date.getUTCDate(),
          hour,
        });
        const atLocal = zoneParts(zone, at);
        if (
          atLocal.year === date.getUTCFullYear() &&
          atLocal.month === date.getUTCMonth() + 1 &&
          atLocal.day === date.getUTCDate() &&
          atLocal.hour === hour &&
          isDaylightSavingTime(zone, at) === shifted &&
          at > nowMs &&
          at < nextBoundaryMs
        ) {
          nextBoundaryMs = at;
        }
      }
    }
  }
  const untilNext = Math.ceil((nextBoundaryMs - nowMs) / 1000);
  return {
    tone: resolveWallpaperTone(now.hour, daylightSaving),
    timeZone: zone,
    sleepSeconds: Math.min(
      MAX_SLEEP_SECONDS,
      Math.max(MIN_SLEEP_SECONDS, untilNext)
    ),
  };
}

if (
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const plan = computeWallpaperPlan({
    nowMs: Date.now(),
    timeZone: readEffectiveTimeZone(process.argv[2]),
  });
  process.stdout.write(`${plan.tone} ${plan.sleepSeconds}\n`);
}
