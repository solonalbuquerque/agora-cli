import {Args, Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {parseStructuredInput} from "../../input/payload";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class ApprovalsReject extends BaseCommand {
  public static override summary = "Reject an approval request";

  public static override args = {
    id: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags,
    reason: Flags.string({required: false}),
    message: Flags.string({required: false}),
    input: Flags.string({required: false}),
    "input-file": Flags.string({required: false}),
    "input-stdin": Flags.boolean({required: false, default: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args, flags) => {
      const body = (await parseStructuredInput(flags.input as string | undefined, flags["input-file"] as string | undefined, Boolean(flags["input-stdin"]))) || {
        reason: flags.reason,
        message: flags.message
      };
      const response = await ctx.client.request({method: "POST", path: `/api/external/approvals/${args.id}/deny`, body});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}