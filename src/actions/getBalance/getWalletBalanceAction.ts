import { Action, IAgentRuntime, Memory, State, Content } from "@elizaos/core";
import { IExec, utils } from "iexec";
import { Wallet } from "ethers";
import { examples } from "./examples";

const randomPrivateKey = Wallet.createRandom().privateKey;

const ethProvider = utils.getSignerFromPrivateKey("bellecour", randomPrivateKey);
const iexec = new IExec({ ethProvider });

export const getWalletBalanceAction: Action = {
  name: "GET_WALLET_BALANCE",
  description: "Get the RLC balance of a wallet address using iExec SDK",
  similes: ["Check balance", "Get RLC balance"],

  validate: async (
    _runtime: IAgentRuntime,
    message: Memory
  ): Promise<boolean> => {
      const addressRegex = /0x[a-fA-F0-9]{40}/;
      console.log("[VALIDATE] GET_WALLET_BALANCE =>", addressRegex.test(message.content.text));
    return addressRegex.test(message.content.text);
  },

  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: any,
    callback
  ) => {
    try {
      const content = message.content as { text: string };
      const addressMatch = content.text.match(/0x[a-fA-F0-9]{40}/);
      if (!addressMatch) {
        throw new Error("Valid Ethereum address not found in message");
      }
      const address = addressMatch[0];

      // Protocol (stake, locked)
      const balance = await iexec.account.checkBalance(address);
      const stakeRLC = Number(balance.stake) * 1e-9;
      const lockedRLC = Number(balance.locked) * 1e-9;

      // On-chain wallet balance
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

  examples: examples,
};
