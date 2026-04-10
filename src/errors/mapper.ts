import {CliError} from "./cli-error";
import {EXIT_CODES} from "./exit-codes";

export type ApiErrorShape = {
  status?: number;
  code?: string;
  message?: string;
  details?: unknown;
};

export function mapError(error: unknown): CliError {
  if (error instanceof CliError) return error;

  if (error instanceof Error) {
    const e = error as Error & {status?: number; code?: string; details?: unknown; cause?: unknown};

    if (e.name === "AbortError") {
      return new CliError("Request timed out", "NETWORK_TIMEOUT", EXIT_CODES.NETWORK_TIMEOUT, e.cause ?? e.message);
    }

    const status = e.status;
    if (typeof status === "number") {
      if (status >= 500) {
        return new CliError(e.message || "Upstream API failure", e.code || "API_5XX", EXIT_CODES.API_5XX, e.details);
      }

      return new CliError(e.message || "Request failed", e.code || "API_4XX", EXIT_CODES.API_4XX, e.details);
    }

    return new CliError(e.message || "Unexpected error", e.code || "UNEXPECTED", EXIT_CODES.UNEXPECTED, e.details);
  }

  return new CliError("Unknown error", "UNEXPECTED", EXIT_CODES.UNEXPECTED, error);
}