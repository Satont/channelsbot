import { client, channels } from '../index'
import { CategoryChannel } from 'discord.js'

const check = async () => {
  for (const [, guild] of client.guilds.cache) {
    for (const channelForJoin of channels) {
      const channel = guild.channels.cache.get(channelForJoin)
      if (channel) {
        const parent = guild.channels.cache.get(channel.parent.id) as CategoryChannel
        const emptyChannels = parent.children.filter(c => c.type === 'voice' && c.members.size === 0 && c.id !== channel.id)
        emptyChannels.forEach(c => {
          console.info(`${c.guild.name} | ${c.name} was deleted because has 0 members inside.`)
          c.delete()
        })
      }
    }
  }
}

setInterval(() => check(), 1 * 60 * 1000)
