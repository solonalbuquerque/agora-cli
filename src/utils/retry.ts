export type RetryOptions = {
  retries: number;
  delayMs: number;
  shouldRetry?: (error: unknown) => boolean;
};

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt += 1;
      const canRetry = attempt <= options.retries && (options.shouldRetry ? options.shouldRetry(error) : true);
      if (!canRetry) throw error;
      await new Promise((resolve) => setTimeout(resolve, options.delayMs));
    }
  }
}