import {Args, Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {parseStructuredInput} from "../../input/payload";
import {buildIdempotencyKey} from "../../utils/idempotency";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class WorkflowsRun extends BaseCommand {
  public static override summary = "Run workflow";

  public static override args = {
    id: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags,
    version: Flags.string({required: false}),
    "max-cost": Flags.integer({required: false}),
    "idempotency-key": Flags.string({required: false}),
    input: Flags.string({required: false}),
    "input-file": Flags.string({required: false}),
    "input-stdin": Flags.boolean({required: false, default: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args, flags) => {
      const input = await parseStructuredInput(flags.input as string | undefined, flags["input-file"] as string | undefined, Boolean(flags["input-stdin"]));
      const body = {
        version: flags.version,
        input: input || {},
        idempotency_key: (flags["idempotency-key"] as string | undefined) || buildIdempotencyKey(),
        max_cost_ago_cents: flags["max-cost"]
      };

      const response = await ctx.client.request({method: "POST", path: `/workflows/${args.id}/run`, body});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}