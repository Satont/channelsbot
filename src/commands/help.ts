import { Command } from '../typings/discord';
import { MessageEmbed } from 'discord.js';

export default {
  name: 'help',
  aliases: ['помощь', 'commands', 'menu', 'команды', 'меню'],
  async run(msg) {
    const commandName = msg.content.split(' ')[0];
    const embed = new MessageEmbed({
      thumbnail: { url: msg.client.user.avatarURL() },
      fields: [
        { name: commandName, value: msg.guild.lang.get('commands.help.fields.helpCommand'), inline: false },
        { name: 'cc!info', value: msg.guild.lang.get('commands.help.fields.infoCommand'), inline: false },
        { name: 'cc!lang russian/english', value: msg.guild.lang.get('commands.help.fields.langSelector'), inline: false },
        { name: 'cc!kick @user', value: msg.guild.lang.get('commands.help.fields.kickUser'), inline: false },
        { name: 'cc!list', value: msg.guild.lang.get('commands.help.fields.listChannels'), inline: false },
        { name: 'cc!CHANNEL_ID', value: msg.guild.lang.get('commands.help.fields.addChannel'), inline: false },
      ],
      footer: { text: `https://channels-bot.tk` },
    });

    msg.channel.send({ embed });
  },
} as Command;
