import {Args, Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class ServicesGet extends BaseCommand {
  public static override summary = "Get service details";

  public static override args = {
    id: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags,
    include: Flags.string({required: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args) => {
      const response = await ctx.client.request({method: "GET", path: `/services/${args.id}`});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}