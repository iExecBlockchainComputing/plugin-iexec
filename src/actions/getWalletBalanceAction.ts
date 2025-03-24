import { Action, IAgentRuntime, Memory, State, Content } from "@elizaos/core";
import { ethers } from "ethers";
import { examples } from "./examples";

export const getWalletBalanceAction: Action = {
    name: "GET_WALLET_BALANCE",
    description: "Get the ETH balance of a wallet address",
    similes: ["Check balance", "Get ETH balance"],

    validate: async (
        _runtime: IAgentRuntime,
        message: Memory,
        _state: State,
    ): Promise<boolean> => {
        const addressRegex = /0x[a-fA-F0-9]{40}/;
        return addressRegex.test(message.content.text);
    },

    handler: async (
        _runtime: IAgentRuntime,
        message: Memory,
        _state: State,
        _options: any,
        callback,
    ) => {
        if (!process.env.IEXEC_RPC_URL) {
            throw new Error(
                "iExec RPC url not found in environment variables. Make sure to set the IEXEC_RPC_URL environment variable.",
            );
        }
        try {
            const content = message.content as { text: string };
            const addressMatch = content.text.match(/0x[a-fA-F0-9]{40}/);
            if (!addressMatch) {
                throw new Error("Valid ethereum address not found in message");
            }
            const address = addressMatch[0];

            const provider = new ethers.JsonRpcProvider(
                process.env.IEXEC_RPC_URL,
            );
            const balance = await provider.getBalance(address);
            const ethBalance = ethers.formatEther(balance);

            const response: Content = {
                text: `The balance of ${address} is ${ethBalance} RLC`,
                actions: ["GET_WALLET_BALANCE"],
                source: message.content.source,
            };

            await callback(response);
            return response;
        } catch (err) {
            console.log("[Ethereum Plugin] Error fetching balance:", err);
            throw new Error("Failed to get wallet balance");
        }
    },

    examples: examples,
};
