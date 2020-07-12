import { Command } from '../typings/discord'
import { Lang } from '../langs'
import db from '../db'

export default {
  name: 'lang',
  aliases: ['язык'],
  async run(msg, args) {
    if(!msg.member.hasPermission('MANAGE_GUILD') || !msg.member.hasPermission('ADMINISTRATOR')){
      return msg.reply(msg.guild.lang.get('errors.noPermissions'))
    }
    
    const lang = args[0]
    if (lang == undefined) return msg.reply(msg.guild.lang.get('errors.noLang', lang))
    if (lang !== 'russian' && lang !== 'english') return msg.reply(msg.guild.lang.get('commands.lang.notExist', lang))
    
    await db('settings').where({ guildId: msg.guild.id}).update({ lang })
    msg.guild.lang = new Lang(lang)
    msg.reply(msg.guild.lang.get('commands.lang.changed', lang))
    return
  }
} as Command
