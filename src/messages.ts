import fs from 'fs'

import OpenAI from 'openai'

import { printMessage } from './cli.js'

import { initialMessageSystemPrompt, performNextStepSystemPrompt } from './prompts.js'

export type MessageType = 
  OpenAI.Chat.Completions.ChatCompletionMessageParam |
  OpenAI.Chat.Completions.ChatCompletionMessage

class MessageHandler {
  private messages: MessageType[] = [ initialMessageSystemPrompt ]
  private debug: boolean

  constructor() {
    this.debug = Boolean( process.env.DEBUG )
  }

  public loadMessage( 
    addPerformNextStep: boolean = true
  ): MessageType[] | null {
    try {
      const messages = JSON.parse( fs.readFileSync( 'messages.json', 'utf8' ) )

      if( addPerformNextStep ) messages.push( performNextStepSystemPrompt )

      return messages
    } catch (error) {
      console.error( 'Error loading messages', error )
      return null
    }
  }

  public addMessage( message: MessageType ) {
    this.messages.push( message )
    printMessage( message, this.debug )
  }

  public addMessages( messages: MessageType[] ) {
    messages.forEach( message => this.addMessage( message ) )
  }

  public storeMessages() {
    fs.writeFileSync( 'messages.json', JSON.stringify( this.messages, null, 2 ) )
  }

  public getMessages() {
    return this.messages
  }
}

export default MessageHandler