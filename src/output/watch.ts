export type WatchOptions<T> = {
  poll: () => Promise<T>;
  isDone: (data: T) => boolean;
  intervalMs: number;
  timeoutMs: number;
  onTick: (data: T) => void;
};

export async function watchLoop<T>(options: WatchOptions<T>): Promise<T> {
  const startedAt = Date.now();
  while (true) {
    const current = await options.poll();
    options.onTick(current);
    if (options.isDone(current)) return current;

    if (Date.now() - startedAt >= options.timeoutMs) {
      throw new Error("Watch timed out");
    }

    await new Promise((resolve) => setTimeout(resolve, options.intervalMs));
  }
}