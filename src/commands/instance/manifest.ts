import {globalFlags} from "../../app";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class InstanceManifest extends BaseCommand {
  public static override summary = "Get public instance manifest";

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx) => {
      const response = await ctx.client.request({method: "GET", path: "/.well-known/agora.json"});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}