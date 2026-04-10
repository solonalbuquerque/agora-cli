import {Args} from "@oclif/core";
import {globalFlags} from "../../app";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class ExecutionsGet extends BaseCommand {
  public static override summary = "Get execution details";

  public static override args = {
    id: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args) => {
      try {
        const response = await ctx.client.request({method: "GET", path: `/v1/executions/${args.id}`});
        printSuccess(response, {json: ctx.config.json});
      } catch {
        const fallback = await ctx.client.request({method: "GET", path: `/api/external/executions/${args.id}`});
        printSuccess(fallback, {json: ctx.config.json});
      }
    });
  }
}