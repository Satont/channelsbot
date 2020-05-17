import { Client, Collection } from 'discord.js'
import { Command } from '../typings/discord'
import { readdirSync } from 'fs'
import { resolve } from 'path'

export default async (client: Client) => {
  client.commands = new Collection()
  for (const item of readdirSync(resolve(__dirname, '..', 'commands'))) {
    const command: Command = (await import(resolve(__dirname, '..', 'commands', item))).default
    client.commands.set(command.name, command)
  }
}