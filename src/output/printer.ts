import {CliError} from "../errors/cli-error";
import {toJsonEnvelope, toJsonError} from "./json";
import {renderTable} from "./table";

export type PrintOptions = {
  json?: boolean;
  title?: string;
  rows?: Record<string, unknown>[];
};

export function printSuccess(data: unknown, options: PrintOptions = {}): void {
  if (options.json) {
    process.stdout.write(`${JSON.stringify(toJsonEnvelope(data), null, 2)}\n`);
    return;
  }

  if (options.title) process.stdout.write(`${options.title}\n`);

  if (options.rows) {
    process.stdout.write(`${renderTable(options.rows)}\n`);
    return;
  }

  if (typeof data === "string") {
    process.stdout.write(`${data}\n`);
    return;
  }

  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

export function printError(error: CliError, asJson = false): void {
  if (asJson) {
    process.stderr.write(`${JSON.stringify(toJsonError(error.code, error.message, error.details), null, 2)}\n`);
    return;
  }

  process.stderr.write(`[${error.code}] ${error.message}\n`);
}