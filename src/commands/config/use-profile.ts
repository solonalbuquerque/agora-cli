import {Args} from "@oclif/core";
import {globalFlags} from "../../app";
import {setActiveProfile} from "../../config/profiles";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class ConfigUseProfile extends BaseCommand {
  public static override summary = "Set active profile";

  public static override args = {
    profile: Args.string({required: true})
  };

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, args) => {
      const profile = String(args.profile);
      setActiveProfile(profile);
      printSuccess(`Active profile set to ${profile}`, {json: ctx.config.json});
    });
  }
}