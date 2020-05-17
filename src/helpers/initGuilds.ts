import { client } from '../index'
import db from '../db'
import { Lang } from '../langs'

export default async () => {
  const newGuilds = []
  for (const [id, guild] of client.guilds.cache) {
    let instance = await db('settings').where({ guildId: id }).first()
    if (!instance) {
      instance = await db('settings').insert({ 
        guildId: id,
        lang: guild.region === 'russia' ? 'russian' : 'english'
      }).returning('*').first()
      newGuilds.push(guild.name)
    }
    guild.lang = new Lang(instance.lang)
  }
  if (newGuilds.length) console.info(`New guilds was inserted in db: ${newGuilds.join(', ')}`)
}