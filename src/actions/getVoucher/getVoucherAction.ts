import {
  Action,
  IAgentRuntime,
  Memory,
  State,
  Content,
  elizaLogger,
} from "@elizaos/core";
import { iexecProvider } from "../../providers/provider";
import { examples } from "./examples";

export const getVoucherAction: Action = {
  name: "GET_USER_VOUCHER",
  description:
    "Get the user's iExec voucher information (balance, expiration, sponsors, etc.)",
  similes: [
    "Check voucher",
    "Get iExec voucher info",
    "Retrieve voucher details",
  ],

  validate: async (
    _runtime: IAgentRuntime,
    message: Memory
  ): Promise<boolean> => {
    elizaLogger.log("Action: GET_USER_VOUCHER, Message:", message);
    const addressRegex = /0x[a-fA-F0-9]{40}/;
    const hasAddress = addressRegex.test(message.content.text);
    const hasEnvAddress = !!process.env.MY_WALLET_ADDRESS?.match(addressRegex);
    return hasAddress || hasEnvAddress;
  },

  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: any,
    callback
  ) => {
    const iexecResponse = await iexecProvider.get(_runtime, message, _state);

    if (!iexecResponse.success || !iexecResponse.data) {
      throw new Error(iexecResponse.error || "Failed to initialize iExec SDK");
    }

    const iexec = iexecResponse.data.iexec;

    const content = message.content as { text: string };
    const addressMatch = content.text.match(/0x[a-fA-F0-9]{40}/);
    const userAddress = addressMatch?.[0] || process.env.MY_WALLET_ADDRESS;

    if (!userAddress) {
      throw new Error(
        "No valid Ethereum address provided in the message or environment."
      );
    }

    try {
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
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("No Voucher found")
      ) {
        const response: Content = {
          text: `No voucher found for wallet ${userAddress}. Go to iExec discord to claim your voucher : https://discord.com/invite/aXH5ym5H4k`,
          actions: ["GET_USER_VOUCHER"],
        };

        await callback(response);
        return response;
      }

      console.error("[iExec Plugin] Unexpected error fetching voucher:", error);
      throw new Error("Failed to get voucher information.");
    }
  },

  examples,
};
