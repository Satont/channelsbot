require('dotenv').config()
import 'source-map-support/register'
import * as Sentry from '@sentry/node'

if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== '') {
	Sentry.init({ dsn: process.env.SENTRY_DNS })
}

import { Client, GuildMember, VoiceChannel } from 'discord.js'
import db from './db'
import './http'
import initChannels from './helpers/initChannels'
//import './structures/Guild'
import logs from 'discord-logs'
import handleVoiceEvent from './helpers/handleVoiceEvent'
import loadCommands from './structures/Client'
import initGuilds from './helpers/initGuilds'
import './commons/logUsage'
import { Lang } from './langs'

export const client = new Client({ 
	partials: ['MESSAGE', 'GUILD_MEMBER'],
	ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MEMBERS'] }
})

logs(client).then(async () => {
	await loadCommands(client)
	client.login(process.env.DISCORD_TOKEN)
})

export const channels = []
export const createdChannels = []

client.on('message', async (msg) => {
	if (msg.partial) await msg.fetch()
	if (msg.member?.partial) await msg.member?.fetch()
	if (!msg.member) return;
	if (msg.member.user.id === client.user.id) console.log(`<<< ${msg.guild.name} | ${client.user.tag}: ${msg.embeds.length ? '[embed]' : msg.content}`)
	if (msg.member.user.bot || msg.channel.type === 'dm') return

	const prefixRegex = new RegExp(`^<@!${client.user.id}>|cc!`)
	const matchedPrefix = msg.content.toLowerCase().match(prefixRegex)
	if (!matchedPrefix) return
	console.info(`>>> ${msg.guild.name}(${msg.guild.id}) | ${msg.member.user.tag}: ${msg.embeds.length ? '[embed]' : msg.content}`)

	const message = msg.content.toLowerCase().substring(matchedPrefix[0].length).trim()
	const args = message.split(/ /)

	const command = client.commands.find(command => command.name === args[0] || command.aliases?.includes(args[0]) || command.regexp?.test(message))
	if (!command) return;

	const noPermission = msg.guild.lang.get('errors.noPermissions', command.permission ?? '')

	if (msg.member.roles.cache.some(r => r.name === 'ChannelsBot')) return await command.run(msg, args.slice(1), message)
	else if (typeof command.checkCustomPerm !== 'undefined' && !command.checkCustomPerm(msg)) return msg.reply(noPermission)
	else if (typeof command.permission !== 'undefined' && !msg.member.hasPermission(command.permission)) return msg.reply(noPermission)
	else await command.run(msg, args.slice(1), message)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
client.on('voiceChannelJoin' as any, (member: GuildMember, newChannel: VoiceChannel) => {
	handleVoiceEvent({ type: 'join', member, newChannel })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
client.on('voiceChannelSwitch' as any, (member: GuildMember, oldChannel: VoiceChannel, newChannel: VoiceChannel) => {
	handleVoiceEvent({ type: 'switch', member, oldChannel, newChannel })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
client.on('voiceChannelLeave' as any, (member: GuildMember, oldChannel: VoiceChannel) => {
	handleVoiceEvent({ type: 'leave', member, oldChannel })
})

client.on('guildCreate', async (guild) => {
	const lang = guild.region === 'russia' ? 'russian' : 'english'
	guild.lang = new Lang(lang)
  if (!(await db('settings').where({ guildId: guild.id }).first())) {
		await db('settings').insert({ guildId: guild.id, lang })
			.catch(e => console.error(`Error on insterting new guild ${guild.name}(${guild.id})`, e))
		console.info(`Guild ${guild.name}(${guild.id}) was inserted in db! Guild lang: ${lang}`)
	} else {
		console.info(`Guild ${guild.name}(${guild.id}) already was in db, so we just reinitialize that guild. Guild lang: ${lang}`)
	}
})

client.on('ready', async () => {
	console.info(`Logged in as ${client.user.tag}`)
	await initChannels()
	await initGuilds()
	import('./helpers/deleteEmptyChannels')
	console.info(`Working on ${client.channels.cache.size} channels, ${client.guilds.cache.size} guilds, ${client.guilds.cache.map(g => g.name).join(', ')}`)
})

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled rejection', reason, promise)
})
