// LLM
import OpenAI from 'openai'

// MCP
import McpClient from './client.js'
import callTool from './mcp.js'

import type { MessageType } from './messages.js'

type OpenAiToolsInputType = {
  type: 'function'
  function: {
    name: string
    description?: string
    parameters: Record< string, any > // JSON Schema
  }
}

export type ToolsListServerResponseType = {
  tools: {
    name: string
    description?: string
    inputSchema: Record<string, any> // JSON Schema
  }[]
}

/**
 * Maps the tool list received from the server via tools/list to the OpenAI tools format
 * @param toolList
 * @returns
 */
export const mapToolsListToOpenAiTools = ( toolList: ToolsListServerResponseType ): OpenAiToolsInputType[] => 
  toolList.tools.map( ( 
    { name,
      description,
      inputSchema: parameters 
    } ) => ( 
      { type: 'function',
        function: { 
          name,
          description,
          parameters 
        } 
      } 
  ) )

/**
 * Applies the tool call(s) if they exists in the response and returns the result as a message to append
 * @param response
 * @returns
 */
export const applyToolCallIfPresent = async ( response: OpenAI.Chat.Completions.ChatCompletion ): Promise< MessageType[] > => {
  if( !response.choices?.[0]?.message?.tool_calls?.length ) return []

  const toolCallResults: MessageType[] = []

  for( const toolCall of response.choices[ 0 ].message.tool_calls ) {
    const toolCallId = toolCall.id

    const { name, arguments: args } = toolCall.function

    const [ error, result ] = await callTool( McpClient, name, args )

    if( error ) {
      toolCallResults.push( {
        role: 'tool',
        content: `Error calling tool ${ name }: ${ error }`,
        tool_call_id: toolCallId
      } )
      
      continue
    }

    if ( !result.content?.length ) {
      toolCallResults.push( {
        role: 'tool',
        content: `WARNING: No content returned from tool ${ name }`,
        tool_call_id: toolCallId,
      } )

      continue
    }

    switch( result.content[ 0 ].type ) {
      case 'text':
        toolCallResults.push( {
          role: 'tool',
          content: result.content[0].text,
          tool_call_id: toolCallId
        } )

        break
      
      default:
        throw new Error( `Unknown content type returned from tool: ${ result.content }` )
    }
  }

  return toolCallResults
}

export const isDone = ( response: OpenAI.Chat.Completions.ChatCompletion ): boolean => {
  if( !response.choices?.length )
    throw new Error( 'No choices found in response' )

  return response.choices[0].finish_reason == 'stop'
}
