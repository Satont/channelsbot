import { Client } from 'discord.js'
import logs from 'discord-logs'
const client = new Client({ 
  partials: ['MESSAGE', 'GUILD_MEMBER'],
  ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MEMBERS'] }
})
logs(client).then(async () => {

	client.login('NzA2NjMwMDk1ODEyNTU4OTAw.XreolA.uRCjayI_82r33xgIxK8Ro4_AfJQ')
})
client.on('ready', () => {
  console.log(client.guilds.cache.get('345629080840044545').channels.cache.size)
})