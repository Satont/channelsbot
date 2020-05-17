import { client, channels, createdChannels } from '../index'
import db from '../db'

export default async () => {
  for (const channel of await db('channels').select('*')) {
    if (client.channels.cache.get(channel.channelId)) channels.push(channel.channelId)
    else await db('channels').where('channelId', channel.channelId).delete()
  }
  for (const channel of await db('created_channels').select('*')) {
    if (client.channels.cache.get(channel.channelId)) createdChannels.push(channel.channelId)
    else await db('created_channels').where('channelId', channel.channelId).delete()
  }
  console.info(`${channels.length} channels was restored.`)
  console.info(`${createdChannels.length} created channels was restored.`)
}