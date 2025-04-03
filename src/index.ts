import { Plugin } from "@elizaos/core";
import { getWalletBalanceAction } from "./actions/getBalance/getWalletBalanceAction";
import { protectDataAction } from "./actions/protectData/protectDataAction";
import { getVoucherAction } from "./actions/getVoucher/getVoucherAction";

const iexecPlugin: Plugin = {
  name: "iexec",
  description: "Plugin for interacting with iexec protocol",
  actions: [protectDataAction, getVoucherAction, getWalletBalanceAction], // implement actions and use them here
};

export { iexecPlugin };
