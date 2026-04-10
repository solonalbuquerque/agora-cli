import {globalFlags} from "../../app";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class InboxList extends BaseCommand {
  public static override summary = "List inbox items";

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx) => {
      const response = await ctx.client.request({method: "GET", path: "/api/v1/inbox"});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}