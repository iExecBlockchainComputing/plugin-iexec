import {
  Action,
  IAgentRuntime,
  Memory,
  State,
  Content,
  elizaLogger,
} from "@elizaos/core";
import { examples } from "./examples";
import { iexecProvider } from "../../providers/provider";

export const getWalletBalanceAction: Action = {
  name: "GET_WALLET_BALANCE",
  description: "Get the RLC balance of a wallet address using iExec SDK",
  similes: ["Check balance", "Get RLC balance"],

  validate: async (
    _runtime: IAgentRuntime,
    message: Memory
  ): Promise<boolean> => {
    elizaLogger.log("Action: GET_WALLET_BALANCE, Message:", message);
    const addressRegex = /0x[a-fA-F0-9]{40}/;
    const hasAddress = addressRegex.test(message.content.text);
    const hasEnvAddress = !!process.env.MY_WALLET_ADDRESS?.match(addressRegex);
    return hasAddress || hasEnvAddress;
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: any,
    callback
  ) => {
    try {
      const iexecResponse = await iexecProvider.get(runtime, message, state);
      if (!iexecResponse.success || !iexecResponse.data) {
        throw new Error(
          iexecResponse.error || "Failed to initialize iExec SDK"
        );
      }

      const iexec = iexecResponse.data.iexec;

      const content = message.content as { text: string };
      const addressMatch = content.text.match(/0x[a-fA-F0-9]{40}/);
      const fallbackAddress = process.env.MY_WALLET_ADDRESS;

      const address = addressMatch?.[0] || fallbackAddress;
      if (!address) {
        throw new Error(
          "No valid Ethereum address found in the prompt or environment"
        );
      }

      const balance = await iexec.account.checkBalance(address);
      const stakeRLC = Number(balance.stake) * 1e-9;
      const lockedRLC = Number(balance.locked) * 1e-9;

      const { nRLC } = await iexec.wallet.checkBalances(address);
      const onChainRLC = Number(nRLC) * 1e-9;

      const responseText = `RLC balance for ${address}:
- On-chain Wallet: ${onChainRLC} RLC
- iExec Account Stake: ${stakeRLC} RLC
- iExec Account Locked: ${lockedRLC} RLC`;

      const response: Content = {
        text: responseText,
        actions: ["GET_WALLET_BALANCE"],
      };

      await callback(response);
      return response;
    } catch (err) {
      console.error("[iExec Plugin] Error fetching balance:", err);
      throw new Error("Failed to get wallet balance");
    }
  },

  examples,
};
