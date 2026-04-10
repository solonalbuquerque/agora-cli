import {Args} from "@oclif/core";
import {globalFlags} from "../../app";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class WorkflowsGet extends BaseCommand {
  public static override summary = "Get workflow details";

  public static override args = {
    id: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args) => {
      const response = await ctx.client.request({method: "GET", path: `/workflows/${args.id}`});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}