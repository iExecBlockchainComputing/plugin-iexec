# iExec Plugin for ElizaOS

A plugin that allows you to interact with the iExec Protocol directly from your messaging interface, providing secure and easy access to RLC balance checking, voucher management, and confidential computing capabilities.

## Setup

1. Clone and Setup ElizaOS

```sh
# Clone the repository
git clone https://github.com/elizaOS/eliza.git

# Navigate to the project directory
cd eliza

# Checkout the latest release
git checkout $(git describe --tags --abbrev=0)
# If the above doesn't checkout the latest release, this should work:
# git checkout $(git describe --tags `git rev-list --tags --max-count=1`)

# Use the required Node version (install NVM if necessary)
nvm use

# Install dependencies
pnpm install --no-frozen-lockfile
```

2. Plugin installation

```sh
# Add iexec plugin if not already installed
npx elizaos plugins add @elizaos-plugins/plugin-iexec

# List all installed plugins (verify plugin-iexec installation)
npx elizaos plugins list
```

3. 🔧 Plugin Configuration

Create a .env file at the root of your ElizaOS project with the following content:

```sh
MY_WALLET_ADDRESS=0xYourWalletAddressHere
```

Configure Default Character (TypeScript).In your `./agent/src/defaultCharacter.ts` file, import the iExec plugin and add it to the plugins array:

```typescript
import { iexecPlugin } from "@elizaos-plugins/plugin-iexec";

export const defaultCharacter: Character = {
  name: "Eliza",
  username: "eliza",
  plugins: [iexecPlugin],
  modelProvider: ModelProviderName.OLLAMA,
  // ... other configuration
};
```

Configure JSON Character File (if applicable). If you’re defining characters via JSON instead of TypeScript, add the iExec plugin as follows:

```json
{
  "name": "Eliza",
  "username": "eliza",
  "plugins": ["@elizaos-plugins/plugin-iexec"],
  "modelProvider": "OLLAMA"
}
```

4. Build the project

```sh
pnpm run build
```

## Features

- RLC Balance Checking: Query wallet balances instantly
- Voucher Management: Retrieve and view voucher information
- Confidential Computing: Protect sensitive data using iExec's encryption infrastructure

## Usage

### Getting RLC Balance

Check the balance of any Ethereum wallet by providing the wallet address. If no address is specified, the plugin will use the wallet configured in your `.env` file.

```txt
Check my balance
```

or

```txt
Check balance for 0x1234567890abcdef1234567890abcdef12345678
```

### Fetching Voucher Data

Access voucher details associated with any wallet address. The plugin will default to your configured wallet in the `.env`file if no address is provided.

Examples:

```txt
Show user voucher for this wallet 0x1234567890abcdef1234567890abcdef12345678
```

```txt
Get my voucher details
```

### Protecting Sensitive Data

You can protect sensitive information using iExec's confidential computing capabilities. The plugin will encrypt your data and store it securely on the iExec infrastructure.

To protect data, use one of these phrase patterns in your message:

- "protect this data: [your sensitive data]"
- "encrypt this: [your sensitive data]"
- "make this confidential: [your sensitive data]"
- "keep this private: [your sensitive data]"

Examples:

```txt
Please protect this data: My API key is sj238sjdh3r2jr238rjsd
```

```txt
I need to encrypt this: Password123!@#
```

```txt
Make this confidential: Contract details for client XYZ
```

After successfully protecting your data, you'll receive a link to view your protected data on the iExec Explorer.

#### How It Works

When you protect data:

1. The plugin identifies your request to protect information
2. It extracts the sensitive content from your message
3. The data is encrypted and protected using iExec's confidential computing
4. You receive a confirmation with a link to the protected data on the iExec Explorer

#### Privacy Considerations

- Protected data is encrypted and can only be accessed by authorized parties
- Your sensitive information is never stored in plain text
- All protected data is managed through the iExec infrastructure with blockchain-level security

## Support & Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request
