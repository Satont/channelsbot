import { Command } from '../typings/discord'
import { channels } from '../index'

export default {
  name: 'list',
  permission: 'MANAGE_CHANNELS',
  aliases: ['список'],
  async run(msg) {
    const list = msg.client.guilds.cache.get(msg.guild.id).channels.cache.filter(o => channels.includes(o.id))
    if (!list.size) return msg.reply(msg.guild.lang.get('list.empty'))

    return msg.reply(msg.guild.lang.get('list.notEmpty', list.map(channel => (`"${channel.name}"`)).join(', ')))
  }
} as Command
