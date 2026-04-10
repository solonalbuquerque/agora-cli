import {Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class ApprovalsList extends BaseCommand {
  public static override summary = "List approvals";

  public static override flags = {
    ...globalFlags,
    status: Flags.string({required: false}),
    limit: Flags.integer({required: false}),
    offset: Flags.integer({required: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, _args, flags) => {
      const response = await ctx.client.request({
        method: "GET",
        path: "/api/external/approvals",
        query: {
          status: flags.status as string | undefined,
          limit: flags.limit as number | undefined,
          offset: flags.offset as number | undefined
        }
      });

      printSuccess(response, {json: ctx.config.json});
    });
  }
}