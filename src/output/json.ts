export function toJsonEnvelope(data: unknown, meta?: unknown): Record<string, unknown> {
  return {
    ok: true,
    data,
    ...(meta === undefined ? {} : {meta})
  };
}

export function toJsonError(code: string, message: string, details?: unknown): Record<string, unknown> {
  return {
    ok: false,
    error: {
      code,
      message,
      ...(details === undefined ? {} : {details})
    }
  };
}