import {Command} from "@oclif/core";
import {createAppContext} from "../app";
import {CliError} from "../errors/cli-error";
import {mapError} from "../errors/mapper";
import {printError} from "../output/printer";

export abstract class BaseCommand extends Command {
  protected async runWithHandler(
    handler: (context: ReturnType<typeof createAppContext>, args: Record<string, unknown>, flags: Record<string, unknown>) => Promise<void>
  ): Promise<void> {
    const {args, flags} = await this.parse(this.constructor as typeof Command);
    const context = createAppContext(flags as Record<string, unknown>);

    try {
      await handler(context, args as Record<string, unknown>, flags as Record<string, unknown>);
    } catch (error) {
      const cliError = mapError(error);
      printError(cliError, context.config.json);
      if (context.config.verbose) {
        const source = error instanceof Error ? error.stack || error.message : String(error);
        this.log(source);
      }

      this.exit(cliError.exitCode);
    }
  }

  protected fail(message: string, code = "VALIDATION"): never {
    throw new CliError(message, code, 2);
  }
}