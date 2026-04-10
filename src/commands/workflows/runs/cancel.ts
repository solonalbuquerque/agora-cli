import {Args} from "@oclif/core";
import {globalFlags} from "../../../app";
import {printSuccess} from "../../../output/printer";
import {BaseCommand} from "../../base";

export default class WorkflowRunsCancel extends BaseCommand {
  public static override summary = "Cancel workflow run";

  public static override args = {
    id: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args) => {
      const response = await ctx.client.request({method: "POST", path: `/workflow/runs/${args.id}/cancel`});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}