import {Flags} from "@oclif/core";
import {globalFlags} from "../../app";
import {parseStructuredInput} from "../../input/payload";
import {buildIdempotencyKey} from "../../utils/idempotency";
import {printSuccess} from "../../output/printer";
import {BaseCommand} from "../base";

export default class WalletTransfer extends BaseCommand {
  public static override summary = "Transfer funds";

  public static override flags = {
    ...globalFlags,
    to: Flags.string({required: false}),
    amount: Flags.string({required: false}),
    coin: Flags.string({required: false}),
    "idempotency-key": Flags.string({required: false}),
    input: Flags.string({required: false}),
    "input-file": Flags.string({required: false}),
    "input-stdin": Flags.boolean({required: false, default: false})
  };

  public async run(): Promise<void> {
    await this.runWithHandler(async (ctx, _args, flags) => {
      const parsed = (await parseStructuredInput(flags.input as string | undefined, flags["input-file"] as string | undefined, Boolean(flags["input-stdin"]))) as Record<string, unknown> | undefined;
      const body = parsed || {
        to: flags.to,
        amount: flags.amount,
        coin: flags.coin,
        idempotency_key: (flags["idempotency-key"] as string | undefined) || buildIdempotencyKey()
      };

      if (!body.to || !body.amount) {
        this.fail("Transfer requires to and amount (or use --input/--input-file/--input-stdin).");
      }

      const response = await ctx.client.request({method: "POST", path: "/v1/wallet/transfers", body});
      printSuccess(response, {json: ctx.config.json});
    });
  }
}