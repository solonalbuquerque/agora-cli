import {Args} from "@oclif/core";
import {globalFlags} from "../../app";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class ExecutionsCancel extends BaseCommand {
  public static override summary = "Cancel an execution";

  public static override args = {
    id: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args) => {
      const response = await ctx.client.request({method: "POST", path: `/api/external/executions/${args.id}/cancel`});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}