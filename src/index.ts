// MCP client SDK
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const main = async () => {
  // 1. Create a new MCP client
  const McpClient = new Client(
    { name: 'ExampleClient', version: '1.0.0' },
    { capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      } 
    }
  )

  try {
    // 2. Connect to server
    console.log('Connecting to server...')
    await McpClient.connect( 
      new StdioClientTransport(
        { command: './index.js', args: [] }
      ) 
    )

  // List prompts
  const prompts = await McpClient.listPrompts()

  // Get a prompt // Uncomment if server has  prompts
  // const prompt = await McpClient.getPrompt( {
  //   name: "example-prompt",
  //   arguments: {
  //     arg1: "value"
  //   }
  // } )

  // List resources
  const resources = await McpClient.listResources()

  // // Read a resource // Uncomment if server has resources
  // const resource = await McpClient.readResource({
  //   uri: 'file:///example.txt'
  // } )

  // List tools
  const tools = await McpClient.listTools()

  // Call a tool
  const result = await McpClient.callTool( {
    name: 'example-tool',
    arguments: {
      arg1: 'value'
    }
  } )
    // Close the connection
    await McpClient.close();
    console.log('Connection closed');
  }
    catch (error) {
    console.error('Unhandled error in main', error)
  }
}

const startServer = async () => {
  try {
    await main()
  } catch (error) {
    console.error('Unhandled error in startServer', error)
  }
}

await startServer()
