import {Args, Flags} from "@oclif/core";
import inquirer from "inquirer";
import {globalFlags} from "../../app";
import {setProfile} from "../../config/profiles";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class AuthLogin extends BaseCommand {
  public static override summary = "Configure auth credentials for a profile";

  public static override flags = {
    ...globalFlags,
    "auth-type": Flags.string({options: ["bearer", "apiKey", "agentHmac"], required: false}),
    token: Flags.string({required: false}),
    "api-key": Flags.string({required: false}),
    "api-key-header": Flags.string({required: false}),
    "agent-id": Flags.string({required: false}),
    "agent-secret": Flags.string({required: false}),
    profile: Flags.string({required: false, default: "default"}),
    "non-interactive": Flags.boolean({default: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, _args, flags) => {
      const profileName = String(flags.profile || "default");
      let authType = (flags["auth-type"] as string | undefined) || "";

      if (!flags["non-interactive"] && !authType) {
        const answers = await inquirer.prompt<{authType: "bearer" | "apiKey" | "agentHmac"}>([
          {
            name: "authType",
            type: "list",
            message: "Select auth type",
            choices: ["bearer", "apiKey", "agentHmac"]
          }
        ]);

        authType = answers.authType;
      }

      if (!authType) this.fail("--auth-type is required in non-interactive mode.");

      const next = setProfile(profileName, {
        name: profileName,
        baseUrl: ctx.config.baseUrl,
        authType: authType as "bearer" | "apiKey" | "agentHmac",
        token: flags.token as string | undefined,
        apiKey: flags["api-key"] as string | undefined,
        apiKeyHeader: flags["api-key-header"] as string | undefined,
        agentId: flags["agent-id"] as string | undefined,
        agentSecret: flags["agent-secret"] as string | undefined
      });

      printSuccess({profile: next.name, authType: next.authType, baseUrl: next.baseUrl}, {json: ctx.config.json});
    });
  }
}