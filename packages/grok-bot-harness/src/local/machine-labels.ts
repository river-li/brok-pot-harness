/** Local workspace names keyed by the retained desktop's stable machine ID.
 * The gateway and execution bridge share this store; OS hostnames are fallback
 * labels only. Renaming never changes a machine's identity or permissions.
 */
import {
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export function validateMachineId(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.length ||
    value.length > 127 ||
    /[\s\p{Cc}]/u.test(value)
  )
    throw new Error("Invalid local machine ID.");
  return value;
}
export function validateMachineLabel(value: unknown): string {
  if (typeof value !== "string") throw new Error("Invalid local machine name.");
  const label = value.trim();
  if (!label || [...label].length > 100 || /\p{Cc}/u.test(label))
    throw new Error(
      "A machine name must contain 1–100 characters without control characters.",
    );
  return label;
}
export function createLocalMachineLabels(root: string) {
  const file = join(root, "machine-labels.json");
  const read = (): Map<string, string> => {
    try {
      const bytes = readFileSync(file);
      if (bytes.length > 128 * 1024)
        throw new Error("Oversized machine names file.");
      const saved = JSON.parse(bytes.toString("utf8"));
      if (
        saved?.version !== 1 ||
        !saved.labels ||
        typeof saved.labels !== "object" ||
        Array.isArray(saved.labels)
      )
        throw new Error("Invalid machine names file.");
      const entries = Object.entries(saved.labels);
      if (entries.length > 256)
        throw new Error("Too many local machine names.");
      return new Map(
        entries.map(([id, label]) => [
          validateMachineId(id),
          validateMachineLabel(label),
        ]),
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return new Map();
      throw new Error(
        "Cannot read local machine-labels.json. Check its format and permissions.",
      );
    }
  };
  return {
    get(machineId: unknown): string | undefined {
      return read().get(validateMachineId(machineId));
    },
    set(machineId: unknown, value: unknown): string {
      const id = validateMachineId(machineId),
        label = validateMachineLabel(value);
      const labels = read();
      if (!labels.has(id) && labels.size >= 256)
        throw new Error("Too many local machine names.");
      labels.set(id, label);
      mkdirSync(root, { recursive: true, mode: 0o700 });
      const temporary = `${file}.${randomUUID()}.tmp`;
      try {
        writeFileSync(
          temporary,
          JSON.stringify({ version: 1, labels: Object.fromEntries(labels) }) +
            "\n",
          { mode: 0o600, flag: "wx" },
        );
        renameSync(temporary, file);
      } finally {
        try {
          unlinkSync(temporary);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        }
      }
      return label;
    },
  };
}
