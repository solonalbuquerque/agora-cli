import {ExitCode} from "./exit-codes";

export class CliError extends Error {
  public readonly code: string;
  public readonly exitCode: ExitCode;
  public readonly details?: unknown;

  public constructor(message: string, code: string, exitCode: ExitCode, details?: unknown) {
    super(message);
    this.name = "CliError";
    this.code = code;
    this.exitCode = exitCode;
    this.details = details;
  }
}