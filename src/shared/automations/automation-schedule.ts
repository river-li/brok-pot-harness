var EVERY_PATTERN = /^@every\s+(\d+)\s*(s|m|h|d)(?:\/(\d+)\s*(s|m|h|d))?$/i;
var TEMPORAL_EVERY_PATTERN = /^@every\s+(\S+)$/i;
var TEMPORAL_DURATION_PART = /(\d+(?:\.\d+)?)(ms|s|m|h|d)/gi;
var SAND_AUTOMATION_MIN_INTERVAL_MS = 5 * 6e4;
var UNIT_MS = {
  ms: 1,
  s: 1e3,
  m: 6e4,
  h: 36e5,
  d: 864e5
};
var CRON_ALIASES = {
  "@hourly": "0 * * * *",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@weekly": "0 0 * * 0",
  "@monthly": "0 0 1 * *",
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *"
};
function normalizeSchedule(raw) {
  return raw.trim().replace(/\s+/g, " ");
}
var SCHEDULE_TZ_PREFIX = /^(?:CRON_TZ|TZ)=(\S+)\s+/;
function splitScheduleTimeZone(schedule) {
  const normalized = normalizeSchedule(schedule);
  const match2 = SCHEDULE_TZ_PREFIX.exec(normalized);
  return match2 == null ? { schedule: normalized, timeZone: void 0 } : { schedule: normalized.slice(match2[0].length), timeZone: match2[1] };
}
function expandAlias(schedule) {
  const lower = schedule.toLowerCase();
  return CRON_ALIASES[lower] ?? schedule;
}
function parseCronField(field, min, max) {
  const values = /* @__PURE__ */ new Set();
  for (const part of field.split(",")) {
    const stepSplit = part.split("/");
    if (stepSplit.length > 2) return null;
    const rangePart = stepSplit[0] ?? "";
    const step = stepSplit.length === 2 ? Number(stepSplit[1]) : 1;
    if (!Number.isInteger(step) || step <= 0) return null;
    let rangeStart;
    let rangeEnd;
    if (rangePart === "*" || rangePart === "") {
      rangeStart = min;
      rangeEnd = max;
    } else if (rangePart.includes("-")) {
      const [startRaw, endRaw] = rangePart.split("-");
      rangeStart = Number(startRaw);
      rangeEnd = Number(endRaw);
    } else {
      rangeStart = Number(rangePart);
      rangeEnd = stepSplit.length === 2 ? max : rangeStart;
    }
    if (!Number.isInteger(rangeStart) || !Number.isInteger(rangeEnd)) return null;
    if (rangeStart < min || rangeEnd > max || rangeStart > rangeEnd) return null;
    for (let value = rangeStart; value <= rangeEnd; value += step) {
      values.add(value);
    }
  }
  return values.size > 0 ? values : null;
}
function parseCron(expression) {
  const fields2 = expression.split(" ");
  if (fields2.length !== 5) return null;
  const [minuteRaw = "", hourRaw = "", domRaw = "", monthRaw = "", dowRaw = ""] = fields2;
  const minute = parseCronField(minuteRaw, 0, 59);
  const hour = parseCronField(hourRaw, 0, 23);
  const dayOfMonth = parseCronField(domRaw, 1, 31);
  const month = parseCronField(monthRaw, 1, 12);
  const dayOfWeekRaw = parseCronField(dowRaw, 0, 7);
  if (minute == null || hour == null || dayOfMonth == null || month == null || dayOfWeekRaw == null) {
    return null;
  }
  const dayOfWeek = new Set([...dayOfWeekRaw].map((day) => day === 7 ? 0 : day));
  return {
    minute,
    hour,
    dayOfMonth,
    month,
    dayOfWeek,
    isDayOfMonthRestricted: domRaw !== "*",
    isDayOfWeekRestricted: dowRaw !== "*"
  };
}
function cronDayMatches(matcher, wall) {
  if (!matcher.month.has(wall.month)) return false;
  const domOk = matcher.dayOfMonth.has(wall.dayOfMonth);
  const dowOk = matcher.dayOfWeek.has(wall.dayOfWeek);
  if (matcher.isDayOfMonthRestricted && matcher.isDayOfWeekRestricted) {
    return domOk || dowOk;
  }
  return (matcher.isDayOfMonthRestricted ? domOk : true) && (matcher.isDayOfWeekRestricted ? dowOk : true);
}
function cronMatchesWallClock(matcher, wall) {
  if (!matcher.minute.has(wall.minute)) return false;
  if (!matcher.hour.has(wall.hour)) return false;
  return cronDayMatches(matcher, wall);
}
function boxLocalWallClock(date6) {
  return {
    year: date6.getFullYear(),
    minute: date6.getMinutes(),
    hour: date6.getHours(),
    month: date6.getMonth() + 1,
    dayOfMonth: date6.getDate(),
    dayOfWeek: date6.getDay()
  };
}
var ZONED_WEEKDAY_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};
var zonedFormatterCache = /* @__PURE__ */ new Map();
function getZonedFormatter(timeZone) {
  const cached2 = zonedFormatterCache.get(timeZone);
  if (cached2 !== void 0) return cached2;
  let formatter;
  try {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short"
    });
  } catch {
    formatter = null;
  }
  zonedFormatterCache.set(timeZone, formatter);
  return formatter;
}
function zonedWallClock(date6, formatter) {
  const lookup3 = {};
  for (const part of formatter.formatToParts(date6)) {
    if (part.type !== "literal") lookup3[part.type] = part.value;
  }
  const hour = Number(lookup3.hour) % 24;
  return {
    year: Number(lookup3.year),
    minute: Number(lookup3.minute),
    hour,
    month: Number(lookup3.month),
    dayOfMonth: Number(lookup3.day),
    dayOfWeek: ZONED_WEEKDAY_INDEX[lookup3.weekday ?? ""] ?? 0
  };
}
var MAX_CRON_SEARCH_MINUTES = 366 * 24 * 60;
var MINUTE_MS = 6e4;
function isSameWallClockDay(a, b2) {
  return a.year === b2.year && a.month === b2.month && a.dayOfMonth === b2.dayOfMonth;
}
function nextCronRun(matcher, afterMs, wallClockOf) {
  let cursorMs = Math.floor(afterMs / MINUTE_MS) * MINUTE_MS + MINUTE_MS;
  const deadlineMs = cursorMs + MAX_CRON_SEARCH_MINUTES * MINUTE_MS;
  while (cursorMs < deadlineMs) {
    const wall = wallClockOf(new Date(cursorMs));
    if (cronMatchesWallClock(matcher, wall)) {
      return cursorMs;
    }
    if (cronDayMatches(matcher, wall)) {
      cursorMs += MINUTE_MS;
      continue;
    }
    const minutesToMidnight = (23 - wall.hour) * 60 + (60 - wall.minute);
    const candidateMs = cursorMs + minutesToMidnight * MINUTE_MS;
    const candidateWall = wallClockOf(new Date(candidateMs));
    if (isSameWallClockDay(candidateWall, wall)) {
      cursorMs = candidateMs;
      continue;
    }
    const overshootMinutes = Math.min(
      candidateWall.hour * 60 + candidateWall.minute,
      minutesToMidnight - 1
    );
    cursorMs = candidateMs - overshootMinutes * MINUTE_MS;
  }
  return null;
}
function parseTemporalDurationMs(duration3, allowZero) {
  if (duration3 === "") return null;
  let totalMs = 0;
  let consumed = 0;
  TEMPORAL_DURATION_PART.lastIndex = 0;
  for (let part = TEMPORAL_DURATION_PART.exec(duration3); part != null; part = TEMPORAL_DURATION_PART.exec(duration3)) {
    const unitMs = UNIT_MS[part[2]?.toLowerCase() ?? ""];
    if (unitMs == null) return null;
    totalMs += Number(part[1]) * unitMs;
    consumed += part[0].length;
  }
  return consumed === duration3.length && (totalMs > 0 || allowZero) ? totalMs : null;
}
function parseEverySchedule(schedule) {
  const intervalAndPhase = TEMPORAL_EVERY_PATTERN.exec(schedule.trim())?.[1];
  if (intervalAndPhase == null) return null;
  const [interval, phase, extra] = intervalAndPhase.split("/");
  if (interval == null || extra != null) return null;
  const intervalMs = parseTemporalDurationMs(interval, false);
  if (intervalMs == null) return null;
  if (phase == null) return { intervalMs };
  const phaseMs = parseTemporalDurationMs(phase, true);
  return phaseMs == null || phaseMs >= intervalMs ? null : { intervalMs, phaseMs };
}
function parseEveryIntervalMs(schedule) {
  return parseEverySchedule(schedule)?.intervalMs ?? null;
}
function compileCronMatcher(schedule) {
  const { schedule: expression, timeZone } = splitScheduleTimeZone(schedule);
  const matcher = parseCron(expandAlias(expression));
  if (matcher == null || timeZone == null) return matcher;
  return getZonedFormatter(timeZone) == null ? null : { ...matcher, timeZone };
}
function wallClockOfInstant(ms2, timeZone) {
  const formatter = timeZone != null && timeZone.length > 0 ? getZonedFormatter(timeZone) : null;
  const date6 = new Date(ms2);
  return formatter != null ? zonedWallClock(date6, formatter) : boxLocalWallClock(date6);
}
function formatTimestamp2(ms2, timeZone) {
  if (ms2 == null || !Number.isFinite(ms2)) return "never";
  const options2 = timeZone != null && timeZone.length > 0 ? { timeZone } : {};
  try {
    return new Date(ms2).toLocaleString(void 0, options2);
  } catch {
    return new Date(ms2).toLocaleString();
  }
}
function cronIntervalIsAtLeast(matcher, minimumIntervalMs) {
  const timesOfDay = [...matcher.hour].flatMap((hour) => [...matcher.minute].map((minute) => hour * 60 + minute)).sort((a, b2) => a - b2);
  for (let index = 1; index < timesOfDay.length; index++) {
    const previous = timesOfDay[index - 1];
    const current = timesOfDay[index];
    if (previous != null && current != null && (current - previous) * MINUTE_MS < minimumIntervalMs) {
      return false;
    }
  }
  const first = timesOfDay[0];
  const last = timesOfDay[timesOfDay.length - 1];
  if (first == null || last == null || (24 * 60 - last + first) * MINUTE_MS >= minimumIntervalMs) {
    return true;
  }
  let previousDayMatches = false;
  for (let dayMs = Date.UTC(2e3, 0, 1); dayMs <= Date.UTC(2400, 0, 1); dayMs += 24 * 60 * MINUTE_MS) {
    const date6 = new Date(dayMs);
    const matches = cronDayMatches(matcher, {
      month: date6.getUTCMonth() + 1,
      dayOfMonth: date6.getUTCDate(),
      dayOfWeek: date6.getUTCDay()
    });
    if (matches && previousDayMatches) return false;
    previousDayMatches = matches;
  }
  return true;
}
function isValidSchedule(schedule, minimumIntervalMs) {
  const normalized = normalizeSchedule(schedule);
  const intervalMs = parseEveryIntervalMs(normalized);
  if (intervalMs != null) {
    return minimumIntervalMs === void 0 || intervalMs >= minimumIntervalMs;
  }
  const matcher = compileCronMatcher(normalized);
  return matcher != null && (minimumIntervalMs === void 0 || cronIntervalIsAtLeast(matcher, minimumIntervalMs));
}
function clampScheduleToMinimumInterval(schedule, minimumIntervalMs) {
  const normalized = normalizeSchedule(schedule);
  const everyIntervalMs = parseEveryIntervalMs(normalized);
  if (everyIntervalMs != null) {
    if (everyIntervalMs >= minimumIntervalMs) return normalized;
    const minimumMinutes2 = minimumIntervalMs / MINUTE_MS;
    return Number.isSafeInteger(minimumMinutes2) && minimumMinutes2 > 0 ? `@every ${minimumMinutes2}m` : null;
  }
  if (isValidSchedule(normalized, minimumIntervalMs)) return normalized;
  const { schedule: commentedExpression, timeZone } = splitScheduleTimeZone(normalized);
  if (timeZone != null && getZonedFormatter(timeZone) == null) return null;
  const commentIndex = commentedExpression.indexOf("#");
  const expression = (commentIndex === -1 ? commentedExpression : commentedExpression.slice(0, commentIndex)).trim();
  const comment = commentIndex === -1 ? "" : ` ${commentedExpression.slice(commentIndex).trim()}`;
  const fields2 = expandAlias(expression).split(" ");
  if (fields2.length !== 5 && fields2.length !== 6 && fields2.length !== 7) return null;
  const minuteIndex = fields2.length === 7 ? 1 : 0;
  const calendarFields = fields2.length === 7 ? fields2.slice(1, 6) : fields2.slice(0, 5);
  const matcher = parseCron(calendarFields.join(" "));
  const seconds = fields2.length === 7 ? parseCronField(fields2[0] ?? "", 0, 59) : /* @__PURE__ */ new Set([0]);
  if (matcher == null || seconds == null) return null;
  if (seconds.size === 1 && cronIntervalIsAtLeast(matcher, minimumIntervalMs)) {
    return normalized;
  }
  const minutes = parseCronField(fields2[minuteIndex] ?? "", 0, 59);
  const minimumMinutes = minimumIntervalMs / MINUTE_MS;
  if (minutes == null || !Number.isSafeInteger(minimumMinutes) || minimumMinutes <= 0) {
    return null;
  }
  if (fields2.length === 7) {
    const selectedSecond = [...seconds].sort((a, b2) => a - b2)[0];
    if (selectedSecond === void 0) return null;
    fields2[0] = String(selectedSecond);
  }
  const selected = [];
  for (const minute of [...minutes].sort((a, b2) => a - b2)) {
    const previous = selected[selected.length - 1];
    if (previous === void 0 || minute - previous >= minimumMinutes) {
      selected.push(minute);
    }
  }
  while (selected.length > 1 && 60 - (selected[selected.length - 1] ?? 0) + (selected[0] ?? 0) < minimumMinutes) {
    selected.pop();
  }
  if (selected.length === 0) return null;
  fields2[minuteIndex] = selected.join(",");
  const prefix = timeZone == null ? "" : `${normalized.startsWith("TZ=") ? "TZ" : "CRON_TZ"}=${timeZone} `;
  return `${prefix}${fields2.join(" ")}${comment}`;
}
function computeNextRunAt(schedule, afterMs, timeZone) {
  const normalized = normalizeSchedule(schedule);
  const every = parseEverySchedule(normalized);
  if (every != null) {
    if (every.phaseMs == null) return afterMs + every.intervalMs;
    return (Math.floor((afterMs - every.phaseMs) / every.intervalMs) + 1) * every.intervalMs + every.phaseMs;
  }
  const matcher = compileCronMatcher(normalized);
  if (matcher == null) return null;
  return nextCronRunAt(matcher, afterMs, timeZone);
}
function nextCronRunAt(matcher, afterMs, timeZone) {
  const zone = matcher.timeZone ?? timeZone;
  const formatter = zone != null && zone.length > 0 ? getZonedFormatter(zone) : null;
  const wallClockOf = formatter != null ? (date6) => zonedWallClock(date6, formatter) : boxLocalWallClock;
  return nextCronRun(matcher, afterMs, wallClockOf);
}
function automationAnchor(automation) {
  return automation.lastRunAt ?? automation.createdAt;
}
var WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
function formatClock(hour, minute) {
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}
var WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
function joinWithAnd(parts) {
  if (parts.length <= 1) return parts[0] ?? "";
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}
function formatDayOfMonthOrdinal(day) {
  let suffix = "th";
  if (day % 100 < 11 || day % 100 > 13) {
    if (day % 10 === 1) {
      suffix = "st";
    } else if (day % 10 === 2) {
      suffix = "nd";
    } else if (day % 10 === 3) {
      suffix = "rd";
    }
  }
  return `${day}${suffix}`;
}
function ascending(values) {
  return [...values].sort((a, b2) => a - b2);
}
function uniformStride(sorted) {
  const [first, second] = sorted;
  if (first === void 0 || second === void 0) return null;
  const stride = second - first;
  if (stride <= 0) return null;
  let previous = second;
  for (let index = 2; index < sorted.length; index++) {
    const value = sorted[index];
    if (value === void 0 || value - previous !== stride) return null;
    previous = value;
  }
  return stride;
}
var WEEKDAY_SET = /* @__PURE__ */ new Set([1, 2, 3, 4, 5]);
var WEEKEND_SET = /* @__PURE__ */ new Set([0, 6]);
function setsEqual(a, b2) {
  return a.size === b2.size && [...a].every((value) => b2.has(value));
}
function classifyCronDays(matcher) {
  const isMonthFull = matcher.month.size === 12;
  const isDomRestricted = matcher.isDayOfMonthRestricted && matcher.dayOfMonth.size < 31;
  const isDowRestricted = matcher.isDayOfWeekRestricted && matcher.dayOfWeek.size < 7;
  if (isDomRestricted && isDowRestricted) return null;
  if (isDowRestricted) {
    if (!isMonthFull) return null;
    if (setsEqual(matcher.dayOfWeek, WEEKDAY_SET)) return { kind: "weekdays" };
    if (setsEqual(matcher.dayOfWeek, WEEKEND_SET)) return { kind: "weekends" };
    const days = ascending(matcher.dayOfWeek);
    const firstDay = days[0];
    const lastDay = days[days.length - 1];
    if (firstDay === void 0 || lastDay === void 0) return null;
    if (days.length > 3) {
      if (uniformStride(days) !== 1) return null;
      return { kind: "weekday-range", first: firstDay, last: lastDay };
    }
    return { kind: "weekday-list", days };
  }
  if (isDomRestricted) {
    const days = ascending(matcher.dayOfMonth);
    if (isMonthFull) {
      if (days.length > 3) return null;
      return { kind: "month-days", days };
    }
    if (matcher.month.size === 1 && days.length === 1) {
      const [month] = matcher.month;
      const [day] = days;
      if (month === void 0 || day === void 0) return null;
      return { kind: "yearly-date", month, day };
    }
    return null;
  }
  if (!isMonthFull) return null;
  return { kind: "every-day" };
}
function englishCronDays(days) {
  switch (days.kind) {
    case "weekdays":
      return { lead: "Weekdays", on: " on weekdays" };
    case "weekends":
      return { lead: "Weekends", on: " on weekends" };
    case "weekday-range": {
      const range2 = `${WEEKDAYS_SHORT[days.first]}\u2013${WEEKDAYS_SHORT[days.last]}`;
      return { lead: range2, on: `, ${range2}` };
    }
    case "weekday-list": {
      const joined = joinWithAnd(
        days.days.map((day) => {
          const name17 = WEEKDAYS[day];
          invariant(name17 != null, "cron weekday index out of range");
          return name17;
        })
      );
      return { lead: `Every ${joined}`, on: ` on ${joined}` };
    }
    case "month-days": {
      const ordinals = joinWithAnd(days.days.map(formatDayOfMonthOrdinal));
      return {
        lead: `On the ${ordinals} of every month`,
        on: ` on the ${ordinals} of every month`
      };
    }
    case "yearly-date": {
      const date6 = `${MONTHS[days.month - 1]} ${days.day}`;
      return { lead: `Every ${date6}`, on: ` on ${date6}` };
    }
    case "every-day":
      return { lead: "Every day", on: null };
  }
}
function minuteIntervalOf(sorted) {
  if (sorted[0] !== 0) return null;
  const stride = uniformStride(sorted);
  const last = sorted[sorted.length - 1];
  if (stride == null || last === void 0) return null;
  return last + stride > 59 ? stride : null;
}
function minuteOfHourToken(minute) {
  return `:${String(minute).padStart(2, "0")}`;
}
function classifyCronTime(matcher) {
  const minutes = ascending(matcher.minute);
  const hours = ascending(matcher.hour);
  const firstMinute = minutes[0];
  const lastMinute = minutes[minutes.length - 1];
  const firstHour = hours[0];
  const lastHour = hours[hours.length - 1];
  if (firstMinute === void 0 || lastMinute === void 0) return null;
  if (firstHour === void 0 || lastHour === void 0) return null;
  const isHoursFull = hours.length === 24;
  if (minutes.length === 1) {
    const minute = firstMinute;
    if (isHoursFull) {
      return {
        kind: "interval",
        every: { kind: "every-hours", amount: 1, atMinute: minute },
        window: null
      };
    }
    if (hours.length === 1) {
      return { kind: "at-clock-times", times: [{ hour: firstHour, minute }] };
    }
    const stride = uniformStride(hours);
    if (stride != null) {
      if (firstHour === 0 && lastHour + stride > 23) {
        return {
          kind: "interval",
          every: { kind: "every-hours", amount: stride, atMinute: minute },
          window: null
        };
      }
      if (stride === 1 || hours.length > 3) {
        return {
          kind: "interval",
          every: { kind: "every-hours", amount: stride, atMinute: 0 },
          window: { from: { hour: firstHour, minute }, to: { hour: lastHour, minute } }
        };
      }
    }
    if (hours.length <= 3) {
      return { kind: "at-clock-times", times: hours.map((hour) => ({ hour, minute })) };
    }
    return null;
  }
  const minuteInterval = minuteIntervalOf(minutes);
  let every;
  if (minuteInterval != null) {
    every = { kind: "every-minutes", amount: minuteInterval };
  } else {
    if (minutes.length > 3) return null;
    if (!isHoursFull && hours.length === 1) {
      return {
        kind: "at-clock-times",
        times: minutes.map((minute) => ({ hour: firstHour, minute }))
      };
    }
    every = { kind: "hour-at-minutes", minutes };
  }
  if (isHoursFull) return { kind: "interval", every, window: null };
  const isContiguous = hours.length === 1 || uniformStride(hours) === 1;
  if (!isContiguous) return null;
  return {
    kind: "interval",
    every,
    window: {
      from: { hour: firstHour, minute: firstMinute },
      to: { hour: lastHour, minute: lastMinute }
    }
  };
}
function englishEvery(every) {
  switch (every.kind) {
    case "every-minutes":
      return every.amount === 1 ? "Every minute" : `Every ${every.amount} minutes`;
    case "every-hours": {
      const base = every.amount === 1 ? "Every hour" : `Every ${every.amount} hours`;
      return every.atMinute === 0 ? base : `${base} at ${minuteOfHourToken(every.atMinute)}`;
    }
    case "hour-at-minutes":
      return `Every hour at ${joinWithAnd(every.minutes.map(minuteOfHourToken))}`;
  }
}
function describeCronMatcher(matcher) {
  const days = classifyCronDays(matcher);
  if (days == null) return null;
  const time4 = classifyCronTime(matcher);
  if (time4 == null) return null;
  const dayPhrase = englishCronDays(days);
  if (time4.kind === "at-clock-times") {
    const times = time4.times.map((entry) => formatClock(entry.hour, entry.minute));
    return `${dayPhrase.lead} at ${joinWithAnd(times)}`;
  }
  const on = dayPhrase.on ?? "";
  const window2 = time4.window == null ? "" : `, ${formatClock(time4.window.from.hour, time4.window.from.minute)} \u2013 ${formatClock(time4.window.to.hour, time4.window.to.minute)}`;
  return `${englishEvery(time4.every)}${on}${window2}`;
}
function describeOneShotSchedule(schedule) {
  const normalized = normalizeSchedule(schedule);
  if (parseEveryIntervalMs(normalized) != null) return null;
  if (splitScheduleTimeZone(normalized).schedule.startsWith("@")) return null;
  const matcher = compileCronMatcher(normalized);
  if (matcher == null || matcher.month.size !== 1 || !matcher.isDayOfMonthRestricted || matcher.dayOfMonth.size !== 1 || matcher.isDayOfWeekRestricted || matcher.hour.size !== 1 || matcher.minute.size !== 1) {
    return null;
  }
  const [month] = matcher.month;
  const [day] = matcher.dayOfMonth;
  const [hour] = matcher.hour;
  const [minute] = matcher.minute;
  if (month == null || day == null || hour == null || minute == null) return null;
  if (!isCalendarDate({ month, day })) return null;
  return `${MONTHS[month - 1]} ${day} at ${formatClock(hour, minute)}`;
}
function isCalendarDate({ month, day }) {
  const date6 = new Date(2e3, month - 1, day);
  return date6.getMonth() === month - 1 && date6.getDate() === day;
}
function describeSchedule(schedule) {
  const normalized = normalizeSchedule(schedule);
  const intervalMs = parseEveryIntervalMs(normalized);
  if (intervalMs != null) {
    const match2 = EVERY_PATTERN.exec(normalized);
    if (match2 == null) return normalized;
    const amount = match2[1] ?? "";
    const unitName = { s: "second", m: "minute", h: "hour", d: "day" }[match2[2]?.toLowerCase() ?? ""] ?? "";
    if (amount === "1") return `Every ${unitName}`;
    return `Every ${amount} ${unitName}s`;
  }
  const oneShot = describeOneShotSchedule(normalized);
  if (oneShot != null) return `Once ${oneShot}`;
  const matcher = compileCronMatcher(normalized);
  if (matcher == null) return normalized;
  return describeCronMatcher(matcher) ?? normalized;
}
function describeTrigger(trigger2) {
  const describeMember = (member) => member.type === "cron" ? describeSchedule(member.schedule) : describeListener(member);
  const [first, ...rest] = triggerList(trigger2);
  return [
    describeMember(first),
    ...rest.map((member) => decapitalize(describeMember(member)))
  ].join(" or ");
}
