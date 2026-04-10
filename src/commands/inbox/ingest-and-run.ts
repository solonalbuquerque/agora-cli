import {Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {parseStructuredInput} from "../../input/payload";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class InboxIngestAndRun extends BaseCommand {
  public static override summary = "Ingest and run inbox action";

  public static override flags = {
    ...globalFlags,
    input: Flags.string({required: false}),
    "input-file": Flags.string({required: false}),
    "input-stdin": Flags.boolean({required: false, default: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, _args, flags) => {
      const body = await parseStructuredInput(flags.input as string | undefined, flags["input-file"] as string | undefined, Boolean(flags["input-stdin"]));
      const response = await ctx.client.request({method: "POST", path: "/v1/inbox/ingest-and-run", body: body || {}});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}