import {Args, Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {pollUntil} from "../../utils/polling";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

const TERMINAL = new Set(["completed", "success", "failed", "cancelled", "rejected", "done"]);

function statusFromEnvelope(envelope: unknown): string {
  const e = envelope as {data?: {status?: string}; status?: string};
  return (e.data?.status || e.status || "").toLowerCase();
}

export default class ExecutionsWatch extends BaseCommand {
  public static override summary = "Watch execution status until terminal state";

  public static override args = {
    id: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags,
    interval: Flags.integer({default: 3000}),
    timeout: Flags.integer({default: 600000})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args, flags) => {
      const finalState = await pollUntil({
        get: async () => {
          try {
            return await ctx.client.request({method: "GET", path: `/v1/executions/${args.id}`});
          } catch {
            return ctx.client.request({method: "GET", path: `/api/external/executions/${args.id}`});
          }
        },
        isTerminal: (data) => TERMINAL.has(statusFromEnvelope(data)),
        intervalMs: Number(flags.interval),
        timeoutMs: Number(flags.timeout),
        onUpdate: (state) => {
          if (!ctx.config.json) {
            const status = statusFromEnvelope(state);
            this.log(`status=${status || "unknown"}`);
          }
        }
      });

      printSuccess(finalState, {json: ctx.config.json});
    });
  }
}