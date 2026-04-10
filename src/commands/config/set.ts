import {Args, Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {setProfile} from "../../config/profiles";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class ConfigSet extends BaseCommand {
  public static override summary = "Set a config value in a profile";

  public static override args = {
    key: Args.string({required: true}),
    value: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags,
    profile: Flags.string({default: "default"})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args, flags) => {
      const key = String(args.key);
      const value = String(args.value);
      const profile = String(flags.profile || ctx.config.profile);
      const patch: Record<string, unknown> = {};
      patch[key] = value;
      const next = setProfile(profile, patch as never);
      printSuccess(next, {json: ctx.config.json});
    });
  }
}