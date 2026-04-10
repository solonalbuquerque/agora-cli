import {globalFlags} from "../../app";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class InstanceStatus extends BaseCommand {
  public static override summary = "Get instance status";

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx) => {
      const response = await ctx.client.request({method: "GET", path: "/instance/status"});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}