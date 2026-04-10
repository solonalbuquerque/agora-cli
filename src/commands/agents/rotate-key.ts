import {globalFlags} from "../../app";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class AgentsRotateKey extends BaseCommand {
  public static override summary = "Start agent key rotation";

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx) => {
      const response = await ctx.client.request({method: "POST", path: "/agents/rotate-key"});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}