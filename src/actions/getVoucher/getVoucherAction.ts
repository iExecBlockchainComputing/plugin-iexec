import { Action, IAgentRuntime, Memory, State, Content } from "@elizaos/core";
import { iexecProvider } from "../../providers/provider";
import { examples } from "./examples";

export const getUserVoucherAction: Action = {
  name: "GET_USER_VOUCHER",
  description: "Get the user's iExec voucher information (balance, expiration, sponsors, etc.)",
  similes: ["Check voucher", "Get iExec voucher info"],

  validate: async (_runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
    const addressRegex = /0x[a-fA-F0-9]{40}/;
    return addressRegex.test(message.content.text) || !!process.env.MY_WALLET_ADDRESS?.match(addressRegex);
  },

  handler: async (_runtime: IAgentRuntime, message: Memory, _state: State, _options: any, callback) => {
    const iexecResponse = await iexecProvider.get(_runtime, message, _state);

    if (!iexecResponse.success || !iexecResponse.data) {
      throw new Error(iexecResponse.error || "Failed to initialize iExec SDK");
    }

    const iexec = iexecResponse.data.iexec;

    const content = message.content as { text: string };
    const addressMatch = content.text.match(/0x[a-fA-F0-9]{40}/);
    const userAddress = addressMatch?.[0] || process.env.MY_WALLET_ADDRESS;

    if (!userAddress) {
      throw new Error("No valid Ethereum address provided in the message or environment.");
    }

    const userVoucher = await iexec.voucher.showUserVoucher(userAddress);

    const responseText = `Voucher details for ${userVoucher.address}:
- Balance: ${userVoucher.balance} RLC
- Expiration: ${userVoucher.expirationTimestamp}
- Sponsored Apps: ${userVoucher.sponsoredApps.join(", ") || "None"}
- Sponsored Datasets: ${userVoucher.sponsoredDatasets.join(", ") || "None"}
- Sponsored Workerpools: ${userVoucher.sponsoredWorkerpools.join(", ") || "None"}
- Allowance: ${userVoucher.allowanceAmount}
- Authorized Accounts: ${userVoucher.authorizedAccounts.join(", ") || "None"}`;

    const response: Content = {
      text: responseText,
      actions: ["GET_USER_VOUCHER"],
    };

    await callback(response);
    return response;
  },

  examples,
};
