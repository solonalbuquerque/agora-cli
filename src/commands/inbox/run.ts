import {Args, Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {parseStructuredInput} from "../../input/payload";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class InboxRun extends BaseCommand {
  public static override summary = "Run inbox workflow for item";

  public static override args = {
    id: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags,
    input: Flags.string({required: false}),
    "input-file": Flags.string({required: false}),
    "input-stdin": Flags.boolean({required: false, default: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args, flags) => {
      const body = await parseStructuredInput(flags.input as string | undefined, flags["input-file"] as string | undefined, Boolean(flags["input-stdin"]));
      const response = await ctx.client.request({method: "POST", path: `/api/v1/inbox/${args.id}/run`, body});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}