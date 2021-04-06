import { Command } from '../typings/discord';
import { client } from '../bot';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';

export default {
  name: 'info',
  aliases: ['инфо'],
  async run(msg) {
    const locale = msg.guild.lang?.get('localeCode');
    const channels = {
      forJoin: ((await client.shard?.broadcastEval('this.myCustomChannels.forJoin.length').catch(() => [0])) ?? [0]).reduce(
        (acc, curr) => acc + curr,
        0,
      ),
      created: ((await client.shard?.broadcastEval('this.myCustomChannels.created.length').catch(() => [0])) ?? [0]).reduce(
        (acc, curr) => acc + curr,
        0,
      ),
    };
    const embed = new MessageEmbed({
      thumbnail: { url: msg.client?.user?.avatarURL() },
      fields: [
        { name: msg.guild.lang?.get('commands.info.fields.madeBy'), value: '[Satont](https://satont.js.org)', inline: true },
        { name: 'Support', value: '[join](https://discord.gg/ufA744AVFd)', inline: true },
        {
          name: msg.guild.lang?.get('commands.info.fields.guilds'),
          value: (await client.shard?.fetchClientValues('guilds.cache.size').catch(() => 0)) ?? 0,
          inline: true,
        },
        { name: msg.guild.lang?.get('commands.info.fields.shards'), value: client.shard?.count ?? 0, inline: true },
        { name: msg.guild.lang?.get('commands.info.fields.channelsForJoin'), value: channels.forJoin, inline: true },
        { name: msg.guild.lang?.get('commands.info.fields.createdChannels'), value: channels.created, inline: true },
        {
          name: msg.guild.lang?.get('commands.info.fields.botStats.uptime'),
          value: moment
            ?.duration(client.uptime || 0)
            ?.locale(locale || 'en')
            ?.humanize(),
          inline: true,
        },
      ],
      footer: { text: `https://channels-bot.tk` },
    });

    msg.channel.send({ embed });
  },
} as Command;
