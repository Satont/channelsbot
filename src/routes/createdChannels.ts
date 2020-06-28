import { Router } from 'express'
import { client, createdChannels } from '../index'
import { VoiceChannel } from 'discord.js'

const router = Router()

router.get('/', (req, res) => {
  const channels = client.channels.cache.filter(channel => createdChannels.includes(channel.id) && channel.type === 'voice')
    .map((channel: VoiceChannel) => ({
      name: channel.name,
      guild: { id: channel.guild.id, name: channel.guild.name },
      members: {
        size: channel.members.size,
        limit: channel.userLimit,
        list: channel.members.map(member => ({ 
        id: member.id,
        tag: member.user.tag,
        displayName: member.displayName,
        deaf: member.voice.deaf, 
        mute: member.voice.mute,
        admin: channel.permissionOverwrites.find(perm => perm.type === 'member' && perm.id === member.id) ? true : false
      }))
      },
      created: channel.createdAt,
      parent: {
        id: channel?.parent.id,
        name: channel?.parent.name,
      },
    }))

  res.json(channels)
})

export default router
