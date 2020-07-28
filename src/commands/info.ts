import { Command } from '../typings/discord'
import { channels, createdChannels, client } from '../index'
import { MessageEmbed } from 'discord.js'
import moment from 'moment'
import { currentUsage } from '../commons/logUsage'

export default {
  name: 'info',
  aliases: ['инфо'],
  async run(msg) {
    const locale = msg.guild.lang.get('localeCode')
    const embed = new MessageEmbed({
      thumbnail: { url: msg.client.user.avatarURL() },
      fields: [
        { name: msg.guild.lang.get('commands.info.fields.madeBy'), value: '[Satont](https://satont.js.org)', inline: true },
        { name: msg.guild.lang.get('commands.info.fields.guilds'), value: client.guilds.cache.size, inline: true },
        { name: msg.guild.lang.get('commands.info.fields.channelsForJoin'), value: channels.length, inline: true },
        { name: msg.guild.lang.get('commands.info.fields.createdChannels'), value: createdChannels.length, inline: true },
        { name: msg.guild.lang.get('commands.info.fields.botStats.uptime'), value: moment.duration(client.uptime).locale(locale).humanize(), inline: true },
        { name: msg.guild.lang.get('commands.info.fields.botStats.ram'), value: currentUsage.ram, inline: true },
        { name: msg.guild.lang.get('commands.info.fields.botStats.cpu'), value: currentUsage.cpu, inline: true },
      ],
      footer: { text: `https://channels-bot.tk` }
    })

    msg.channel.send({ embed })
  }
} as Command
