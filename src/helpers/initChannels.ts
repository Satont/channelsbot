import { client } from '../bot'
import db from '../db'

export default async () => {
  for (const channel of await db('channels').select('*')) {
    if (client.channels.cache.get(channel.channelId)) client.myCustomChannels.forJoin.push(channel.channelId)
    else await db('channels').where('channelId', channel.channelId).delete()
  }
  for (const channel of await db('created_channels').select('*')) {
    if (client.channels.cache.get(channel.channelId)) client.myCustomChannels.created.push(channel.channelId)
    else await db('created_channels').where('channelId', channel.channelId).delete()
  }
  console.info(`${client.myCustomChannels.forJoin.length} for join, ${client.myCustomChannels.created.length} created channels was restored on shard.`)
}
