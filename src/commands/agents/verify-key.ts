import {Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {parseStructuredInput} from "../../input/payload";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class AgentsVerifyKey extends BaseCommand {
  public static override summary = "Verify agent key challenge";

  public static override flags = {
    ...globalFlags,
    "agent-id": Flags.string({required: false}),
    "challenge-id": Flags.string({required: false}),
    "public-key": Flags.string({required: false}),
    signature: Flags.string({required: false}),
    input: Flags.string({required: false}),
    "input-file": Flags.string({required: false}),
    "input-stdin": Flags.boolean({required: false, default: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, _args, flags) => {
      const parsed = (await parseStructuredInput(flags.input as string | undefined, flags["input-file"] as string | undefined, Boolean(flags["input-stdin"]))) as Record<string, unknown> | undefined;
      const body = parsed || {
        agent_id: flags["agent-id"],
        challenge_id: flags["challenge-id"],
        public_key: flags["public-key"],
        signature: flags.signature
      };

      const required = ["agent_id", "challenge_id", "public_key", "signature"];
      for (const key of required) {
        if (!body[key]) this.fail(`${key} is required`);
      }

      const response = await ctx.client.request({method: "POST", path: "/agents/verify-key", body});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}