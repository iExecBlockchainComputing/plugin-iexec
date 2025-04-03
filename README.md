# iExec Plugin for ElizaOS

A robust iExec Plugin for ElizaOS that provides iExec functionality for confidential computing and blockchain interactions.

## Features

- Fetch the RLC token balance of a wallet on the iExec sidechain (Bellecour)
- Protect sensitive data using iExec's confidential computing capabilities

## Prerequisites

- NodeJS 18.0 or later
- ElizaOS installation

## Installation

```bash
npm install @elizaos-plugins/iexec
```

## Configuration

Add the adapter to your ElizaOS configuration:

```json
{
  "plugins": ["@elizaos-plugins/iexec"]
}
```

## Usage

### Getting RLC Balance

You can check the balance of an Ethereum wallet by simply providing the wallet address in your message:

```
What's the RLC balance of 0x1234567890abcdef1234567890abcdef12345678?
```

or

```
Check balance 0x1234567890abcdef1234567890abcdef12345678
```

### Protecting Sensitive Data

You can protect sensitive information using iExec's confidential computing capabilities. The plugin will encrypt your data and store it securely on the iExec infrastructure.

To protect data, use one of these phrase patterns in your message:

- "protect this data: [your sensitive data]"
- "encrypt this: [your sensitive data]"
- "make this confidential: [your sensitive data]"
- "keep this private: [your sensitive data]"

Examples:

```
Please protect this data: My API key is sj238sjdh3r2jr238rjsd
```

```
I need to encrypt this: Password123!@#
```

```
Make this confidential: Contract details for client XYZ
```

After successfully protecting your data, you'll receive a link to view your protected data on the iExec Explorer.

## How It Works

When you protect data:

1. The plugin identifies your request to protect information
2. It extracts the sensitive content from your message
3. The data is encrypted and protected using iExec's confidential computing
4. You receive a confirmation with a link to the protected data on the iExec Explorer

## Privacy Considerations

- Protected data is encrypted and can only be accessed by authorized parties
- Your sensitive information is never stored in plain text
- All protected data is managed through the iExec infrastructure with blockchain-level security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request
