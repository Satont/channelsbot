import { Command } from '../typings/discord'
import { channels } from '../index'
import db from '../db'

export default {
  regexp: /\d{9,}/,
  permission: 'MANAGE_CHANNELS',
  aliases: ['channel'],
  async run(msg, content) {
    if (content.split(' ').length > 1) content = content.split(' ')[1]
 
    const channel = msg.guild.channels.cache.get(content)

    if (!channel) return msg.reply(msg.guild.lang.get('channel.notFound'))
    if (!channel.parent) return msg.reply(msg.guild.lang.get('channel.noParent'))
  
    const dbChannel = await db('channels').where('channelId', content).first()
    if (dbChannel) {
      await db('channels').where('channelId', content).delete()
      const index = channels.indexOf(content)
      channels.splice(index, 1)
      return msg.reply(msg.guild.lang.get('channel.deleted', channel.name))
    } else {
      await db('channels').insert({ channelId: content })
      channels.push(content)
      return msg.reply(msg.guild.lang.get('channel.added', channel.name))
    }
  }
} as Command
