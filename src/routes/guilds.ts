import { Router } from 'express'
import { flattenDeep } from 'lodash'
import { manager } from '../shards'

const router = Router()

router.get('/', async (req, res) => {
  const guilds = await manager.broadcastEval(`
    this.guilds.cache.map(guild => ({
      name: guild.name,
      id: guild.id,
      members: guild.memberCount,
      channels: guild.channels.cache.size,
      region: guild.region,
      joined: guild.members.cache.get(this.user.id).joinedAt,
      lang: guild.lang.code,
    }))
  `)

  res.json(flattenDeep(guilds))
})

export default router
