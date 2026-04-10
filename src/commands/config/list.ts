import {globalFlags} from "../../app";
import {readConfigFile} from "../../config/profiles";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class ConfigList extends BaseCommand {
  public static override summary = "List config profiles";

  public static override flags = {
    ...globalFlags
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx) => {
      const cfg = readConfigFile();
      const rows = Object.values(cfg.profiles).map((p) => ({
        name: p.name,
        baseUrl: p.baseUrl,
        authType: p.authType,
        active: p.name === cfg.activeProfile
      }));

      printSuccess(rows, {json: ctx.config.json, rows});
    });
  }
}