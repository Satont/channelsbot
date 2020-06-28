import { Command } from '../typings/discord'
import { MessageEmbed } from 'discord.js'

export default {
  name: 'help',
  aliases: ['помощь'],
  async run(msg) {
    const locale = msg.guild.lang.get('localeCode')
    const embed = new MessageEmbed({
      thumbnail: { url: msg.client.user.avatarURL() },
      fields: [
        { name: 'cc!help', value: msg.guild.lang.get('commands.help.fields.showMenu'), inline: false },
        { name: 'cc!lang russian/english', value: msg.guild.lang.get('commands.help.fields.setLang'), inline: false },
        { name: 'cc!kick @user', value: msg.guild.lang.get('commands.help.fields.kickMember'), inline: false },
        { name: 'cc!list', value: msg.guild.lang.get('commands.help.fields.voiceList'), inline: false },
        { name: 'cc!VOICE_ID', value: msg.guild.lang.get('commands.help.fields.addChannel'), inline: false }
      ],
      footer: { text: `https://channels-bot.tk` }
    })

    msg.channel.send({ embed })
  }
} as Command
