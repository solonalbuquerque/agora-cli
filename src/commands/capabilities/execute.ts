import {Args, Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {parseStructuredInput} from "../../input/payload";
import {buildIdempotencyKey} from "../../utils/idempotency";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";
import {buildExternalCapabilityExecutionBody} from "./shared";

export default class CapabilitiesExecute extends BaseCommand {
  public static override summary = "Execute a capability";

  public static override args = {
    id: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags,
    input: Flags.string({required: false}),
    "input-file": Flags.string({required: false}),
    "input-stdin": Flags.boolean({required: false, default: false}),
    "idempotency-key": Flags.string({required: false}),
    "correlation-id": Flags.string({required: false}),
    wait: Flags.boolean({required: false, default: false}),
    "mode-external": Flags.boolean({required: false, default: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args, flags) => {
      const payload = await parseStructuredInput(flags.input as string | undefined, flags["input-file"] as string | undefined, Boolean(flags["input-stdin"]));

      if (flags["mode-external"]) {
        const body = buildExternalCapabilityExecutionBody({
          capabilityId: String(args.id),
          input: payload || {},
          idempotencyKey: (flags["idempotency-key"] as string | undefined) || buildIdempotencyKey(),
          correlationId: flags["correlation-id"] as string | undefined
        });

        const response = await ctx.client.request({method: "POST", path: "/api/external/executions", body});
        printSuccess(response, {json: ctx.config.json});
        return;
      }

      const response = await ctx.client.request({
        method: "POST",
        path: `/v1/services/${args.id}/execute`,
        body: payload || {}
      });

      printSuccess(response, {json: ctx.config.json});
    });
  }
}
