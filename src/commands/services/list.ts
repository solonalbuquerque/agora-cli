import {Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class ServicesList extends BaseCommand {
  public static override summary = "List services";

  public static override flags = {
    ...globalFlags,
    q: Flags.string({required: false}),
    category: Flags.string({required: false}),
    status: Flags.string({required: false}),
    limit: Flags.integer({required: false}),
    offset: Flags.integer({required: false}),
    compatibility: Flags.boolean({required: false, default: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, _args, flags) => {
      const path = flags.compatibility ? "/services/" : "/api/services/";
      const response = await ctx.client.request({
        method: "GET",
        path,
        query: {
          q: flags.q as string | undefined,
          category: flags.category as string | undefined,
          status: flags.status as string | undefined,
          limit: flags.limit as number | undefined,
          offset: flags.offset as number | undefined
        }
      });

      const rows = Array.isArray((response as {data?: unknown}).data)
        ? ((response as {data?: Array<Record<string, unknown>>}).data || []).map((item) => ({
            id: item.id,
            code: item.code || item.serviceCode,
            name: item.name,
            status: item.status
          }))
        : undefined;

      printSuccess(response, {json: ctx.config.json, rows});
    });
  }
}