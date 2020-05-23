import { Command } from '../typings/discord'
import { channels, createdChannels, client } from '../index'
import { MessageEmbed } from 'discord.js'
import moment from 'moment'
import { currentUsage } from '../commons/logUsage'

export default {
  name: 'info',
  async run(msg) {
    const embed = new MessageEmbed({
      thumbnail: { url: msg.client.user.avatarURL() },
      fields: [
        { name: 'Mady by', value: '<@266632783336570880>', inline: true },
        { name: 'Guilds', value: client.guilds.cache.size, inline: true },
        { name: 'Channels for join', value: channels.length, inline: true },
        { name: 'Current created channels', value: createdChannels.length, inline: true },
        { name: 'Bot uptime', value: moment.duration(client.uptime).humanize(), inline: true },
        { name: 'Ram usage', value: currentUsage.ram, inline: true },
        { name: 'Cpu usage', value: currentUsage.cpu, inline: true },
      ],
      footer: { text: `https://channels-bot.tk` }
    })

    msg.channel.send({ embed })
  }
} as Command
