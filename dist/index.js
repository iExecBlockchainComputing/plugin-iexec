// src/actions/getWalletBalanceAction.ts
import { ethers } from "ethers";

// src/actions/examples.ts
var examples = [
  [
    {
      name: "Example 1",
      user: "user1",
      content: {
        text: "Check balance",
        actions: ["GET_WALLET_BALANCE"]
      }
    }
  ],
  [
    {
      name: "Example 2",
      user: "user2",
      content: {
        text: "Get ETH balance",
        actions: ["GET_WALLET_BALANCE"]
      }
    }
  ]
];

// src/actions/getWalletBalanceAction.ts
var getWalletBalanceAction = {
  name: "GET_WALLET_BALANCE",
  description: "Get the ETH balance of a wallet address",
  similes: ["Check balance", "Get ETH balance"],
  validate: async (_runtime, message, _state) => {
    const addressRegex = /0x[a-fA-F0-9]{40}/;
    return addressRegex.test(message.content.text);
  },
  handler: async (_runtime, message, _state, _options, callback) => {
    if (!process.env.IEXEC_RPC_URL) {
      throw new Error(
        "iExec RPC url not found in environment variables. Make sure to set the IEXEC_RPC_URL environment variable."
      );
    }
    try {
      const content = message.content;
      const addressMatch = content.text.match(/0x[a-fA-F0-9]{40}/);
      if (!addressMatch) {
        throw new Error("Valid ethereum address not found in message");
      }
      const address = addressMatch[0];
      const provider = new ethers.JsonRpcProvider(
        process.env.IEXEC_RPC_URL
      );
      const balance = await provider.getBalance(address);
      const ethBalance = ethers.formatEther(balance);
      const response = {
        text: `The balance of ${address} is ${ethBalance} RLC`,
        actions: ["GET_WALLET_BALANCE"],
        source: message.content.source
      };
      await callback(response);
      return response;
    } catch (err) {
      console.log("[Ethereum Plugin] Error fetching balance:", err);
      throw new Error("Failed to get wallet balance");
    }
  },
  examples
};

// src/index.ts
var iexecPlugin = {
  name: "iexec",
  description: "Plugin for interacting with iexec protocol",
  actions: [getWalletBalanceAction]
  // implement actions and use them here
};
export {
  iexecPlugin
};
//# sourceMappingURL=index.js.map