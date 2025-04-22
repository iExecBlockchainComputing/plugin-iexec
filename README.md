iExec Plugin for ElizaOS
=========================

A plugin that allows you to interact with the iExec Protocol directly from your messaging interface, providing secure and easy access to RLC balance checking, voucher management, and confidential computing capabilities.

⚙️ Prerequisites
----------------

### Ollama (Local AI Model)

This project uses **Ollama**, a tool that allows you to run language models locally, ensuring privacy and performance without relying on external APIs.

You must have Ollama installed and a model running before starting ElizaOS.

Installation instructions: https://ollama.com/

Once installed, start a model (e.g., `gemma3`) using:

    ollama run gemma3

Make sure the model is compatible with ElizaOS and remains running during development.

📦 Setup
--------

1. Clone and Setup ElizaOS

    git clone https://github.com/elizaOS/eliza.git
    cd eliza
    git checkout $(git describe --tags --abbrev=0)
    # Alternative if the above doesn't work:
    # git checkout $(git describe --tags `git rev-list --tags --max-count=1`)
    nvm use
    pnpm install --no-frozen-lockfile

2. Plugin Installation

    # Add iExec plugin
    npx elizaos plugins add @elizaos-plugins/plugin-iexec

    # List plugins to verify installation
    npx elizaos plugins list

3. Plugin Configuration

Create a `.env` file at the root of your ElizaOS project with the following content:

    # Ethereum wallet address used by the iExec plugin
    MY_WALLET_ADDRESS=0xYourWalletAddressHere

    # Ollama configuration (local LLM)
    OLLAMA_SERVER_URL=http://127.0.0.1:11434
    OLLAMA_MODEL=gemma3:latest
    SMALL_OLLAMA_MODEL=gemma3:latest
    MEDIUM_OLLAMA_MODEL=gemma3:latest
    LARGE_OLLAMA_MODEL=gemma3:latest

> These variables allow ElizaOS to connect to your local Ollama server and use the specified language models. You can customize the model names based on the ones installed locally.

4. Default Character Setup

If using TypeScript, modify `./agent/src/defaultCharacter.ts`:

    import { iexecPlugin } from "@elizaos-plugins/plugin-iexec";

    export const defaultCharacter: Character = {
      name: "Eliza",
      username: "eliza",
      plugins: [iexecPlugin],
      modelProvider: ModelProviderName.OLLAMA,
      // ... other configuration
    };

If using a JSON character file:

    {
      "name": "Eliza",
      "username": "eliza",
      "plugins": ["@elizaos-plugins/plugin-iexec"],
      "modelProvider": "OLLAMA"
    }

5. Build the Project

    pnpm run build

✨ Features
-----------

- **RLC Balance Checking**: Query wallet balances instantly
- **Voucher Management**: Retrieve and view voucher information
- **Confidential Computing**: Protect sensitive data using iExec's encryption infrastructure

🧑‍💻 Usage
----------

### Getting RLC Balance

Check the balance of any Ethereum wallet by providing the address. If no address is specified, the plugin will use the wallet configured in your `.env`.

    Check my balance
    Check balance for 0x1234567890abcdef1234567890abcdef12345678

### Fetching Voucher Data

    Show user voucher for this wallet 0x1234567890abcdef1234567890abcdef12345678
    Get my voucher details

### Protecting Sensitive Data

Use one of these phrases to trigger encryption:

    protect this data: [your sensitive data]
    encrypt this: [your sensitive data]
    make this confidential: [your sensitive data]
    keep this private: [your sensitive data]

Examples:

    Please protect this data: My API key is sj238sjdh3r2jr238rjsd
    I need to encrypt this: Password123!@#
    Make this confidential: Contract details for client XYZ

You will receive a confirmation link to view your protected data on the iExec Explorer.

🔐 How It Works

1. The plugin identifies your request to protect information
2. It extracts the sensitive content from your message
3. The data is encrypted and protected using iExec's confidential computing
4. You receive a confirmation with a link to the protected data on the iExec Explorer

🛡️ Privacy Considerations

- Protected data is encrypted and can only be accessed by authorized parties
- Your sensitive information is never stored in plain text
- All data is managed through the iExec infrastructure with blockchain-level security

🤝 Support & Contributing
--------------------------

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

