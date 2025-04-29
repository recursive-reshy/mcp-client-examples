import { Client } from '@modelcontextprotocol/sdk/client/index.js'

const callTool = async (
  client: Client,
  name: string,
  inputArgs: string
): Promise< [ error: null, result: any ] | [ error: string, result: null] > => {
  try {
    const resourceContext = await client.callTool( { 
      name,
      arguments: JSON.parse( inputArgs )
    } )

    return [ null, resourceContext ]
  } catch (error) {
    console.error( 'Error parsing arguments:', error )
    return [ ( error as Error ).message, null ]
  }
}

export default callTool