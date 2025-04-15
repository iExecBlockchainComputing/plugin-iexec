
import {
  Action,
  Content,
  elizaLogger,
  IAgentRuntime,
  Memory,
  State,
} from "@elizaos/core";
import {getWeb3Provider,IExecDataProtectorCore} from "@iexec/dataprotector"
import { Wallet } from "ethers";
import { protectData_examples } from "./examples";

export const protectDataAction: Action = {
    name: "PROTECT_DATA",
    description: "Protect data using iExec confidential computing",
    similes: ["Protect my data", "Encrypt this information", "Make this confidential"],

    validate: async (
        _runtime: IAgentRuntime,
        message: Memory
    ): Promise<boolean> => {
        elizaLogger.log("Action: PROTECT_DATA, Message:", message);
        return true;
    },

    handler: async (
        _runtime: IAgentRuntime,
        message: Memory,
        _state: State,
        _options: any,
        callback,
    ) => {
        console.log("[HANDLER] PROTECT_DATA =>", message.content.text);
        if (!process.env.MY_WALLET_ADDRESS) {
            throw new Error(
                "MY_WALLET_ADDRESS environment variable is not set. Please set it with your wallet address.",
            );
        }
        try {
            // Extract the content to protect
            // This is the trickiest part - determining what portion of the message to protect
            const content = extractContentToProtect(message.content.text);
            console.log("[PROTECT_DATA] Content to protect:", content);
            const web3Provider = getWeb3Provider(Wallet.createRandom().privateKey);
            const dataProtectorCore = new IExecDataProtectorCore(web3Provider);
            const protectedData = await dataProtectorCore.protectData({
                name:"ElisaOS iExec Plugin",
                data: {
                    content: content,
                },
            });
            await dataProtectorCore.transferOwnership({
                protectedData: protectedData.address,
                newOwner: process.env.MY_WALLET_ADDRESS,
              });

            const response: Content = {
                text: `Your data has been protected.You can check your protectedData here: https://explorer.iex.ec/bellecour/dataset/${protectedData.address}`,
                actions: ["PROTECT_DATA"],
            };
            await callback(response);
            return response;
        } catch (err) {
            console.log("[iExec Plugin] Error protecting data:", err);
            throw new Error("Failed to protect data");
        }
    },

    examples:protectData_examples,
};

// Helper function to extract the content to protect
function extractContentToProtect(text: string): string {
    // This is a simplified version. You might need more sophisticated parsing
    const protectPhrases = [
        "protect this data:",
        "encrypt this:",
        "make this confidential:",
        "keep this private:"
    ];
    
    for (const phrase of protectPhrases) {
        const index = text.toLowerCase().indexOf(phrase);
        if (index !== -1) {
            return text.substring(index + phrase.length).trim();
        }
    }
    
    // If no specific marker is found, you might want to implement fallback logic
    // For example, take everything after "protect" or use the whole message
    return text;
}
