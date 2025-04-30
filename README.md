# MCP Client Example

An example implementation of a client using the Model Context Protocol (MCP).

## Overview

This project demonstrates how to build a client application that communicates with an MCP server, enabling interaction with various tools and services through a unified protocol. The client provides a command-line interface for natural language interaction with the MCP ecosystem.

## Features

- Interactive chat interface with OpenAI's language models
- Integration with MCP server for tool access
- Autonomous agent loop for continuous interaction
- Message history management

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd mcp-client-examples
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create a .env file with the following variables
OPENAI_API_KEY=your_openai_api_key
MCP_SERVER_COMMAND=npx
MCP_SERVER_ARGS=-y,@modelcontextprotocol/server-filesystem,/path/to/allowed/directory
OPENAI_MODEL=gpt-4o-mini
DEBUG=false
```

## Usage

1. Build the project
```bash
npm run build
```

2. Run the client
```bash
npm start
```

3. Interact with the CLI
- Type your messages and press Enter to send
- Type `quit` to exit and save the conversation

## Project Structure

- `src/index.ts` - Main entry point and agent loop
- `src/client.ts` - MCP client configuration
- `src/messages.ts` - Message handling and storage
- `src/cli.ts` - Command-line interface utilities
- `src/openaiUtils.ts` - OpenAI integration utilities
- `src/mcp.ts` - MCP tool calling functionality
- `src/prompts.ts` - System prompts for the model

## License

MIT 