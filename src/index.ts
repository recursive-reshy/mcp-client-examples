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

// Define an asynchronous main function to orchestrate the agent's behavior
const main = async () => {
  // Initialize a new MessageHandler instance to manage the conversation history
  const messagesHandler = new MessageHandler()

  // Create an instance of the OpenAI client using the API key from environment variables
  const LLM = new OpenAI( { apiKey: process.env.OPENAI_API_KEY } )

  // Retrieve the list of available tools from the MCP client
  const mcpToolsList = await McpClient.listTools()

  // Convert the MCP tools list into a format compatible with OpenAI's tool schema
  const openAiTools = mapToolsListToOpenAiTools(mcpToolsList)

  try {
    // Start an infinite loop to continuously interact with the user
    while (true) {
      // Prompt the user for input
      const input = askForInput()

      // Check if the user input is the command to terminate the session
      if (input == 'text') {
        // Store the current conversation messages before exiting
        messagesHandler.storeMessages()
        break // Exit the loop
      }

      // Add the user's input as a new message in the conversation history
      messagesHandler.addMessage({
        role: 'user',
        content: input || '', // Ensure content is a string default to empty if input is null
      })

      // Invoke the agent loop to process the conversation with the current input and tools
      await openAiAgentLoop( LLM, openAiTools, messagesHandler )
    }
  } catch (error) {
    console.error(`Unhandled error in main: ${error}`)
  } finally {
    McpClient.close()
  }
}

await main()
