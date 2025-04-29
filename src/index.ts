// LLM
import OpenAI from 'openai'

// Client
import McpClient from './client.js'

// Utlis
import {
  applyToolCallIfPresent,
  isDone,
  mapToolsListToOpenAiTools
} from './openaiUtils.js'

import MessageHandler, { type MessageType } from './messages.js'

// Prompts
import { performNextStepSystemPrompt } from './prompts.js'

// CLI
import { askForInput, printMessage } from './cli.js'

// TODO: Add error handling
// Main loop that drives the autonomous agent
const openAiAgentLoop = async (
  openai: OpenAI, // OpenAI SDK client
  openAiTools: OpenAI.Chat.Completions.ChatCompletionTool[], // List of tools the model can call
  messagesHandler: MessageHandler // Handles storing and updating the chat history
) => {
  // TODO: Maybe move to env variable
  const MAX_ITERATIONS = 10; // Limit to prevent infinite loops

  // The loop simulates an autonomous reasoning chain
  for ( let i = 0; i < MAX_ITERATIONS; i++ ) {
    
    //Step 1: Send the full conversation and available tools to the model
    const message = await openai.chat.completions.create( {
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.2, // Low temperature = more deterministic output
      messages: messagesHandler.getMessages(), // Current state of the conversation
      tools: openAiTools
    } )

    //Step 2: Store the model's message in the chat history
    messagesHandler.addMessage( message.choices[0].message )

    //Step 3: Check if the model has indicated it's done (e.g., "task complete")
    if ( isDone(message) ) break

    //Step 4: If the model made any tool calls, execute them and collect results
    const tollCall = await applyToolCallIfPresent(message)

    //Step 5: If tool responses exist, add them to the conversation
    if ( tollCall.length ) messagesHandler.addMessages(tollCall)

    //Step 6: Add a system prompt to guide the model into the next reasoning step
    messagesHandler.addMessage(performNextStepSystemPrompt)
  }
}

const main = async () => {
  const messagesHandler = new MessageHandler()

  const LLM = new OpenAI( { apiKey: process.env.OPENAI_API_KEY } )

  const mcpToolsList = await McpClient.listTools()
  
  const openAiTools = mapToolsListToOpenAiTools(mcpToolsList)

}
