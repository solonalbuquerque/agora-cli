import {Args} from "@oclif/core";
import {globalFlags} from "../../../app";
import {printSuccess} from "../../../output/printer";
import {BaseCommand} from "../../base";

export default class WorkflowRunsGet extends BaseCommand {
  public static override summary = "Get workflow run";

  public static override args = {
    id: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args) => {
      const response = await ctx.client.request({method: "GET", path: `/workflow/runs/${args.id}`});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}