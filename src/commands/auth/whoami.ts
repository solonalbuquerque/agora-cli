import {globalFlags} from "../../app";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class AuthWhoami extends BaseCommand {
  public static override summary = "Show authenticated identity";

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx) => {
      try {
        const me = await ctx.client.request({method: "GET", path: "/agents/me"});
        printSuccess(me, {json: ctx.config.json});
      } catch {
        const human = await ctx.client.request({method: "GET", path: "/human/me"});
        printSuccess(human, {json: ctx.config.json});
      }
    });
  }
}