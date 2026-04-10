import {Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {parseStructuredInput} from "../../input/payload";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class AgentsRegister extends BaseCommand {
  public static override summary = "Register a new agent";

  public static override flags = {
    ...globalFlags,
    name: Flags.string({required: false}),
    "registration-key": Flags.string({required: false}),
    input: Flags.string({required: false}),
    "input-file": Flags.string({required: false}),
    "input-stdin": Flags.boolean({required: false, default: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, _args, flags) => {
      const parsed = (await parseStructuredInput(flags.input as string | undefined, flags["input-file"] as string | undefined, Boolean(flags["input-stdin"]))) as Record<string, unknown> | undefined;
      const body = parsed || {
        name: flags.name,
        registration_key: flags["registration-key"]
      };

      if (!body.name) this.fail("name is required (use --name or JSON input)");

      const response = await ctx.client.request({method: "POST", path: "/agents/register", body});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}