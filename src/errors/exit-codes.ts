export const EXIT_CODES = {
  OK: 0,
  UNEXPECTED: 1,
  VALIDATION: 2,
  AUTH_CONFIG: 3,
  API_4XX: 4,
  API_5XX: 5,
  NETWORK_TIMEOUT: 6
} as const;

export type ExitCode = (typeof EXIT_CODES)[keyof typeof EXIT_CODES];
