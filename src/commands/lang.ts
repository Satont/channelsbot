import { Command } from '../typings/discord'
import { Lang } from '../langs'
import db from '../db'

export default {
  name: 'lang',
  aliases: ['язык'],
  checkCustomPerm(msg) {
    return (msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_GUILD'))
  },
  async run(msg, args) {
    const lang = args[0]
    if (lang !== 'russian' && lang !== 'english') return msg.reply(msg.guild.lang.get('commands.lang.notExist', lang))
    
    await db('settings').where({ guildId: msg.guild.id}).update({ lang })
    msg.guild.lang = new Lang(lang)
    msg.reply(msg.guild.lang.get('commands.lang.changed', lang))
    return
  }
} as Command
