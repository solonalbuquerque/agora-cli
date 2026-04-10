import {Args, Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {readConfigFile} from "../../config/profiles";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class ConfigGet extends BaseCommand {
  public static override summary = "Get a config value from a profile";

  public static override args = {
    key: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags,
    profile: Flags.string({required: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args, flags) => {
      const cfg = readConfigFile();
      const profile = String(flags.profile || cfg.activeProfile);
      const key = String(args.key);
      const value = (cfg.profiles[profile] as Record<string, unknown>)[key];
      printSuccess({profile, key, value}, {json: ctx.config.json});
    });
  }
}