import { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";
import { IExec, utils } from "iexec";
import { Wallet } from "ethers";
import { IExecProviderResponse } from "../types";

export const iexecProvider: Provider = {
  get: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state?: State
  ): Promise<{ success: boolean; data?: IExecProviderResponse; error?: string }> => {
    try {
      const randomPrivateKey = Wallet.createRandom().privateKey;
      const ethProvider = utils.getSignerFromPrivateKey("bellecour", randomPrivateKey);
      const iexec = new IExec({ ethProvider });

      return { success: true, data: { iexec } };
    } catch (error) {
      console.error("[iExecProvider] Failed to instantiate iExec SDK:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error initializing iExec",
      };
    }
  },
};
