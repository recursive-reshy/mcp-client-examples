import OpenAI from 'openai'

import process from 'process'

// We need this package is not a node object and is only available in the browser
// See line 51
import psp from 'prompt-sync-plus'

const colorByRole = {
  system: 'green',
  user: 'blue',
  assistant: 'red',
  developer: 'orange',
  tool: 'yellow',
  function: 'purple'
}

export const printMessage = ( 
  message: 
   | OpenAI.Chat.Completions.ChatCompletionMessageParam
   | OpenAI.Chat.Completions.ChatCompletionMessage,
  debug: boolean = false
) => {
  if( ( message.role == 'system' || message.role == 'tool') && !debug ) return

  console.log(
    `%c${message.role}`,
    `color: ${ colorByRole[ message.role ] }; font-weight: bold;`
  )

  if( message.role == 'assistant' && message.tool_calls?.length ) {
    console.log(
      `The tool %c${message.tool_calls?.[0]?.function.name}%c was called with the arguments: %c${message.tool_calls?.[0]?.function.arguments}`,
      `font-style: italic;`,
      "", // Reset styling
      `font-style: italic;`
    )
  }
  else {
    // If it fails, print the content as a string
    console.log( message.content )
  }

  // Add a line break
  console.log('')
}

export const askForInput = () => {
  console.log( '%cuser', `color: blue; font-weight: bold;` )
  const prompt = psp(undefined)
  const result = prompt('>')

  // Delete the prompt lines, will be replaced by printMessage
  process.stdout.write('\x1b[A')
  process.stdout.write('\x1b[2K')
  process.stdout.write('\x1b[A')
  process.stdout.write('\x1b[2K')

  return result
}