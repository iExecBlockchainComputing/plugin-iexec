import { Plugin } from "@elizaos/core";
import { getWalletBalanceAction } from "./actions/getWalletBalanceAction";

const iexecPlugin: Plugin = {
    name: "iexec",
    description: "Plugin for interacting with iexec protocol",
    actions: [getWalletBalanceAction], // implement actions and use them here
};

export { iexecPlugin };
