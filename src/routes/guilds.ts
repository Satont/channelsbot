import { Router } from 'express'
import { client } from '../index'

const router = Router()

router.get('/', (req, res) => {
  const guilds = client.guilds.cache.map(guild => ({
    name: guild.name,
    id: guild.id,
    members: guild.members.cache.size,
    channels: guild.channels.cache.size,
    region: guild.region,
  }))

  res.json(guilds)
})

export default router
