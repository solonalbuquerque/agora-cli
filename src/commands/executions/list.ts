import {globalFlags} from "../../app";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class ExecutionsList extends BaseCommand {
  public static override summary = "List executions";

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx) => {
      const response = await ctx.client.request({method: "GET", path: "/v1/executions"});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}