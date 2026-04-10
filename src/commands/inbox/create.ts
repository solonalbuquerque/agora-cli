import {Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {parseStructuredInput} from "../../input/payload";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class InboxCreate extends BaseCommand {
  public static override summary = "Create inbox item";

  public static override flags = {
    ...globalFlags,
    department: Flags.string({required: false}),
    title: Flags.string({required: false}),
    type: Flags.string({required: false}),
    input: Flags.string({required: false}),
    "input-file": Flags.string({required: false}),
    "input-stdin": Flags.boolean({required: false, default: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, _args, flags) => {
      const parsed = (await parseStructuredInput(flags.input as string | undefined, flags["input-file"] as string | undefined, Boolean(flags["input-stdin"]))) as Record<string, unknown> | undefined;
      const body = parsed || {
        department_id: flags.department,
        type: flags.type || "generic",
        title: flags.title,
        data: {}
      };

      if (!body.department_id) this.fail("department_id is required (use --department or JSON input)");

      const response = await ctx.client.request({method: "POST", path: "/api/v1/inbox", body});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}