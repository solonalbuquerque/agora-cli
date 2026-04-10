import {globalFlags} from "../../app";
import {clearProfileCredentials} from "../../config/profiles";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class AuthLogout extends BaseCommand {
  public static override summary = "Clear auth credentials for a profile";

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx) => {
      clearProfileCredentials(ctx.config.profile);
      printSuccess(`Credentials removed from profile ${ctx.config.profile}.`, {json: ctx.config.json});
    });
  }
}