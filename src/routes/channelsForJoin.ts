import { Router } from 'express'
import { flattenDeep } from 'lodash'
import { getChannelsForJoin } from '../functions/getChannelsForJoin'
import { manager } from '../shards'

const router = Router()

router.get('/', async (req, res) => {
  const channels = await manager.broadcastEval(`(${getChannelsForJoin}).call(this)`)

  res.json(flattenDeep(channels))
})

export default router
