# iExec Plugin for ElizaOS

A robust iExec Plugin for ElizaOS that provides some iExec functionality.

## Features

- create a protectedData thought the iExec Protocol

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

## Connection Options

The adapter is configured with optimal connection settings:

- Maximum pool size: 100 connections
- Minimum pool size: 5 connections
- Connection timeout: 10 seconds
- Socket timeout: 45 seconds
- Retry support for both reads and writes
- Compression enabled (zlib)

## Features

### Token

- Get RLC balance for a Wallet

### Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request
