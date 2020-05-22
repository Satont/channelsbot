import { Router } from 'express'
import { client, channels as forJoin } from '../index'
import { VoiceChannel } from 'discord.js'

const router = Router()

router.get('/', (req, res) => {
  const channels = client.channels.cache.filter(channel => forJoin.includes(channel.id) && channel.type === 'voice')
    .map((channel: VoiceChannel) => ({
      name: channel.name,
      guild: { id: channel.guild.id, name: channel.guild.name },
      created: channel.createdAt,
      parent: {
        id: channel.parent.id,
        name: channel.parent.name,
      },
    }))

  res.json(channels)
})

export default router
