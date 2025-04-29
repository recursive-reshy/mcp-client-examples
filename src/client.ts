import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const transport = new StdioClientTransport( {
  command: process.env.MCP_SERVER_COMMAND || 'node',
  args: process.env.MCP_SERVER_ARGS ? process.env.MCP_SERVER_ARGS.split(' ') : undefined,
} )

const McpClient = new Client( 
  { name: 'example-client',
    version: '0.1.0'
  },
  { capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    }
  }
)

await McpClient.connect( transport )

export default McpClient