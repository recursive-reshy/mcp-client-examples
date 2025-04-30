import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const transport = new StdioClientTransport( {
  command: process.env.MCP_SERVER_COMMAND || 'npx',
  /**
   * args: An array of arguments passed to the command:
   * '-y': Automatically confirms any prompts that npx might present.
   * '@modelcontextprotocol/server-filesystem': Specifies the MCP server node package to run, which provides filesystem operations.
   * 'absolute/path/to/allowed/dir': This is a placeholder path
   *  Should be replaced with the absolute path to the directory on your local machine that you want the MCP server to have access to.
   */
  args: process.env.MCP_SERVER_ARGS ? process.env.MCP_SERVER_ARGS.split(',') : undefined,
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