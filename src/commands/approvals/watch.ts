import {Args, Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {pollUntil} from "../../utils/polling";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

const TERMINAL = new Set(["approved", "denied", "rejected", "cancelled"]);

function statusFromEnvelope(envelope: unknown): string {
  const e = envelope as {data?: {status?: string}; status?: string};
  return (e.data?.status || e.status || "").toLowerCase();
}

export default class ApprovalsWatch extends BaseCommand {
  public static override summary = "Watch approval status";

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
        get: () => ctx.client.request({method: "GET", path: `/api/external/approvals/${args.id}`}),
        isTerminal: (state) => TERMINAL.has(statusFromEnvelope(state)),
        intervalMs: Number(flags.interval),
        timeoutMs: Number(flags.timeout),
        onUpdate: (state) => {
          if (!ctx.config.json) this.log(`status=${statusFromEnvelope(state)}`);
        }
      });

      printSuccess(finalState, {json: ctx.config.json});
    });
  }
}