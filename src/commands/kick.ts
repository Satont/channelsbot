import { Command } from '../typings/discord'
import { createdChannels } from '../index'

export default {
  name: 'kick',
  checkCustomPerm(msg) {
    return msg.member.voice?.channel?.permissionOverwrites?.some(perm => perm.type === 'member' && perm.id === msg.member.id)
    && createdChannels.includes(msg.member.voice?.channel.id)
    && msg.guild.channels.cache.get(msg.channel.id).parent.id === msg.member.voice?.channel?.parent.id
  },
  async run(msg) {
    const mentioned = msg.mentions.members.filter(member => member.id !== msg.client.user.id).first()
    if (!mentioned) return msg.reply(msg.guild.lang.get('commands.kick.notMentioned'))

    if (mentioned.permissions.has('MANAGE_GUILD') || mentioned.permissions.has('ADMINISTRATOR')) {
      return msg.reply(msg.guild.lang.get('commands.kick.cannot', mentioned))
    }

    if (mentioned.voice.channel.id !== msg.member.voice.channel.id) return msg.reply(msg.guild.lang.get('commands.kick.notInYourChannel', mentioned))

    await mentioned.voice.setChannel(null)
    await msg.reply(msg.guild.lang.get('commands.kick.success', mentioned))
  }
} as Command
