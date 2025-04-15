import { Plugin } from "@elizaos/core";
import { getWalletBalanceAction } from "./actions/getBalance/getWalletBalanceAction";
import { protectDataAction } from "./actions/protectData/protectDataAction";
import { getVoucherAction } from "./actions/getVoucher/getVoucherAction";
import { iexecProvider } from "./providers/provider";

const iexecPlugin: Plugin = {
  name: "iexec",
  description: "Plugin for interacting with iexec protocol",
  actions: [protectDataAction, getVoucherAction, getWalletBalanceAction],
  providers: [iexecProvider],
};

export { iexecPlugin };
