// src/actions/getBalance/getWalletBalanceAction.ts
import {
  elizaLogger
} from "@elizaos/core";

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

// src/providers/provider.ts
import { IExec, utils } from "iexec";
import { Wallet } from "ethers";
var iexecProvider = {
  get: async (_runtime, _message, _state) => {
    try {
      const randomPrivateKey = Wallet.createRandom().privateKey;
      const ethProvider = utils.getSignerFromPrivateKey("bellecour", randomPrivateKey);
      const iexec = new IExec({ ethProvider });
      return { success: true, data: { iexec } };
    } catch (error) {
      console.error("[iExecProvider] Failed to instantiate iExec SDK:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error initializing iExec"
      };
    }
  }
};

// src/actions/getBalance/getWalletBalanceAction.ts
var getWalletBalanceAction = {
  name: "GET_WALLET_BALANCE",
  description: "Get the RLC balance of a wallet address using iExec SDK",
  similes: ["Check balance", "Get RLC balance"],
  validate: async (_runtime, message) => {
    elizaLogger.log("Action: GET_WALLET_BALANCE, Message:", message);
    const addressRegex = /0x[a-fA-F0-9]{40}/;
    const hasAddress = addressRegex.test(message.content.text);
    const hasEnvAddress = !!process.env.MY_WALLET_ADDRESS?.match(addressRegex);
    return hasAddress || hasEnvAddress;
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      const iexecResponse = await iexecProvider.get(runtime, message, state);
      if (!iexecResponse.success || !iexecResponse.data) {
        throw new Error(
          iexecResponse.error || "Failed to initialize iExec SDK"
        );
      }
      const iexec = iexecResponse.data.iexec;
      const content = message.content;
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
import {
  elizaLogger as elizaLogger2
} from "@elizaos/core";
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
      name: "Example 6",
      user: "user6",
      content: {
        text: "protect my data Using dataProtector from iExec plugin: content",
        actions: ["PROTECT_DATA"]
      }
    }
  ],
  [
    {
      name: "Example 7",
      user: "user7",
      content: {
        text: "i would to protect this Data: secret@!!",
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
    elizaLogger2.log("Action: PROTECT_DATA, Message:", message);
    return true;
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

// src/actions/getVoucher/getVoucherAction.ts
import {
  elizaLogger as elizaLogger3
} from "@elizaos/core";

// src/actions/getVoucher/examples.ts
var examples2 = [
  [
    {
      name: "Example 1",
      user: "user1",
      content: {
        text: "Show my iExec voucher",
        actions: ["GET_USER_VOUCHER"]
      }
    }
  ],
  [
    {
      name: "Example 2",
      user: "user2",
      content: {
        text: "Get voucher info for 0x1234567890abcdef1234567890abcdef12345678",
        actions: ["GET_USER_VOUCHER"]
      }
    }
  ],
  [
    {
      name: "Example 3",
      user: "user3",
      content: {
        text: "Check authorized accounts and sponsored apps in my voucher",
        actions: ["GET_USER_VOUCHER"]
      }
    }
  ],
  [
    {
      name: "Example 4",
      user: "user4",
      content: {
        text: "What\u2019s the voucher allowance for my wallet?",
        actions: ["GET_USER_VOUCHER"]
      }
    }
  ],
  [
    {
      name: "Example 5",
      user: "user5",
      content: {
        text: "Show user voucher for this wallet",
        actions: ["GET_USER_VOUCHER"]
      }
    }
  ],
  [
    {
      name: "Example 6",
      user: "user6",
      content: {
        text: "Give me my voucher data",
        actions: ["GET_USER_VOUCHER"]
      }
    }
  ]
];

// src/actions/getVoucher/getVoucherAction.ts
var getVoucherAction = {
  name: "GET_USER_VOUCHER",
  description: "Get the user's iExec voucher information (balance, expiration, sponsors, etc.)",
  similes: [
    "Check voucher",
    "Get iExec voucher info",
    "Retrieve voucher details"
  ],
  validate: async (_runtime, message) => {
    elizaLogger3.log("Action: GET_USER_VOUCHER, Message:", message);
    const addressRegex = /0x[a-fA-F0-9]{40}/;
    const hasAddress = addressRegex.test(message.content.text);
    const hasEnvAddress = !!process.env.MY_WALLET_ADDRESS?.match(addressRegex);
    return hasAddress || hasEnvAddress;
  },
  handler: async (_runtime, message, _state, _options, callback) => {
    const iexecResponse = await iexecProvider.get(_runtime, message, _state);
    if (!iexecResponse.success || !iexecResponse.data) {
      throw new Error(iexecResponse.error || "Failed to initialize iExec SDK");
    }
    const iexec = iexecResponse.data.iexec;
    const content = message.content;
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
      const response = {
        text: responseText,
        actions: ["GET_USER_VOUCHER"]
      };
      await callback(response);
      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes("No Voucher found")) {
        const response = {
          text: `No voucher found for wallet ${userAddress}. Go to iExec discord to claim your voucher : https://discord.com/invite/aXH5ym5H4k`,
          actions: ["GET_USER_VOUCHER"]
        };
        await callback(response);
        return response;
      }
      console.error("[iExec Plugin] Unexpected error fetching voucher:", error);
      throw new Error("Failed to get voucher information.");
    }
  },
  examples: examples2
};

// src/index.ts
var iexecPlugin = {
  name: "iexec",
  description: "Plugin for interacting with iexec protocol",
  actions: [protectDataAction, getVoucherAction, getWalletBalanceAction],
  providers: [iexecProvider]
};
export {
  iexecPlugin
};
//# sourceMappingURL=index.js.map