// src/actions/getBalance/getWalletBalanceAction.ts
import { IExec, utils } from "iexec";
import { Wallet } from "ethers";

// src/actions/getBalance/examples.ts
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
        text: "Get RLC balance",
        actions: ["GET_WALLET_BALANCE"]
      }
    }
  ]
];

// src/actions/getBalance/getWalletBalanceAction.ts
var randomPrivateKey = Wallet.createRandom().privateKey;
var ethProvider = utils.getSignerFromPrivateKey("bellecour", randomPrivateKey);
var iexec = new IExec({ ethProvider });
var getWalletBalanceAction = {
  name: "GET_WALLET_BALANCE",
  description: "Get the RLC balance of a wallet address using iExec SDK",
  similes: ["Check balance", "Get RLC balance"],
  validate: async (_runtime, message) => {
    const addressRegex = /0x[a-fA-F0-9]{40}/;
    console.log("[VALIDATE] GET_WALLET_BALANCE =>", addressRegex.test(message.content.text));
    return addressRegex.test(message.content.text);
  },
  handler: async (_runtime, message, _state, _options, callback) => {
    try {
      const content = message.content;
      const addressMatch = content.text.match(/0x[a-fA-F0-9]{40}/);
      if (!addressMatch) {
        throw new Error("Valid Ethereum address not found in message");
      }
      const address = addressMatch[0];
      const balance = await iexec.account.checkBalance(address);
      const stakeRLC = Number(balance.stake) * 1e-9;
      const lockedRLC = Number(balance.locked) * 1e-9;
      const { nRLC } = await iexec.wallet.checkBalances(address);
      const onChainRLC = Number(nRLC) * 1e-9;
      const responseText = `RLC balance for ${address}:
        - On-chain Wallet: ${onChainRLC} RLC
        - iExec Account Stake: ${stakeRLC} RLC
        - iExec Account Locked: ${lockedRLC} RLC`;
      const response = {
        text: responseText,
        actions: ["GET_WALLET_BALANCE"]
      };
      await callback(response);
      return response;
    } catch (err) {
      console.error("[iExec Plugin] Error fetching balance:", err);
      throw new Error("Failed to get wallet balance");
    }
  },
  examples
};

// src/actions/protectData/protectDataAction.ts
import { getWeb3Provider, IExecDataProtectorCore } from "@iexec/dataprotector";
import { Wallet as Wallet2 } from "ethers";

// src/actions/protectData/examples.ts
var protectData_examples = [
  [
    {
      name: "Example 1",
      user: "user1",
      content: {
        text: "Protect this data: My private API key is XYZ123456789",
        actions: ["PROTECT_DATA"]
      }
    }
  ],
  [
    {
      name: "Example 2",
      user: "user2",
      content: {
        text: "I need to encrypt this: Password123!@#",
        actions: ["PROTECT_DATA"]
      }
    }
  ],
  [
    {
      name: "Example 3",
      user: "user3",
      content: {
        text: "Make this confidential: My wallet recovery phrase is apple banana cherry dog elephant forest guitar",
        actions: ["PROTECT_DATA"]
      }
    }
  ],
  [
    {
      name: "Example 4",
      user: "user4",
      content: {
        text: "Keep this private: Contract details for client XYZ include a payment schedule of $5000 on the 15th of each month",
        actions: ["PROTECT_DATA"]
      }
    }
  ],
  [
    {
      name: "Example 5",
      user: "user5",
      content: {
        text: "protect my data: test@yahoo.fr",
        actions: ["PROTECT_DATA"]
      }
    }
  ],
  [
    {
      name: "Example 5",
      user: "user5",
      content: {
        text: "protect my data Using dataProtector from iExec plugin: content",
        actions: ["PROTECT_DATA"]
      }
    }
  ]
];

// src/actions/protectData/protectDataAction.ts
var protectDataAction = {
  name: "PROTECT_DATA",
  description: "Protect data using iExec confidential computing",
  similes: ["Protect my data", "Encrypt this information", "Make this confidential"],
  validate: async (_runtime, message) => {
    const protectIntentPhrases = [
      "protect this data",
      "encrypt this",
      "make this confidential",
      "keep this private"
    ];
    const test = protectIntentPhrases.some(
      (phrase) => message.content.text.toLowerCase().includes(phrase)
    );
    console.log("[VALIDATE] PROTECT_DATA =>", test);
    return test;
  },
  handler: async (_runtime, message, _state, _options, callback) => {
    console.log("[HANDLER] PROTECT_DATA =>", message.content.text);
    if (!process.env.MY_WALLET_ADDRESS) {
      throw new Error(
        "MY_WALLET_ADDRESS environment variable is not set. Please set it with your wallet address."
      );
    }
    try {
      const content = extractContentToProtect(message.content.text);
      console.log("[PROTECT_DATA] Content to protect:", content);
      const web3Provider = getWeb3Provider(Wallet2.createRandom().privateKey);
      const dataProtectorCore = new IExecDataProtectorCore(web3Provider);
      const protectedData = await dataProtectorCore.protectData({
        name: "ElisaOS iExec Plugin",
        data: {
          content
        }
      });
      console.log("\u{1F680} ~ protectedData:", protectedData);
      await dataProtectorCore.transferOwnership({
        protectedData: protectedData.address,
        newOwner: process.env.MY_WALLET_ADDRESS
      });
      const response = {
        text: `Your data has been protected.You can check your protectedData here: https://explorer.iex.ec/bellecour/dataset/${protectedData.address}`,
        actions: ["PROTECT_DATA"]
      };
      await callback(response);
      return response;
    } catch (err) {
      console.log("[iExec Plugin] Error protecting data:", err);
      throw new Error("Failed to protect data");
    }
  },
  examples: protectData_examples
};
function extractContentToProtect(text) {
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
  return text;
}

// src/index.ts
var iexecPlugin = {
  name: "iexec",
  description: "Plugin for interacting with iexec protocol",
  actions: [protectDataAction, getWalletBalanceAction]
  // implement actions and use them here
};
export {
  iexecPlugin
};
//# sourceMappingURL=index.js.map