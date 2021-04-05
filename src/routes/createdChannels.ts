import { Router } from 'express';
import { manager } from '../shards';
import { getCreatedChannels } from '../functions/getCreatedChannels';
import { flattenDeep } from 'lodash';

const router = Router();

router.get('/', async (req, res) => {
  const channels = await manager.broadcastEval(`(${getCreatedChannels}).call(this)`);

  res.json(flattenDeep(channels));
});

export default router;
