import {watchLoop} from "../output/watch";

export type PollUntilOptions<T> = {
  get: () => Promise<T>;
  isTerminal: (data: T) => boolean;
  intervalMs: number;
  timeoutMs: number;
  onUpdate: (data: T) => void;
};

export function pollUntil<T>(options: PollUntilOptions<T>): Promise<T> {
  return watchLoop({
    poll: options.get,
    isDone: options.isTerminal,
    intervalMs: options.intervalMs,
    timeoutMs: options.timeoutMs,
    onTick: options.onUpdate
  });
}