import { Command } from '../typings/discord';
import db from '../db';
import { PermissionString } from 'discord.js';

export default {
  regexp: /^\d{9,}/,
  permission: 'MANAGE_CHANNELS',
  aliases: ['channel'],
  async run(msg, args, content) {
    content = args.length ? args[0] : content;
    const channel = msg.guild.channels.cache.get(content);

    if (!channel) return msg.reply(msg.guild.lang.get('channel.notFound'));
    if (!channel.parent) return msg.reply(msg.guild.lang.get('channel.noParent'));

    const bot = msg.guild.members.cache.get(msg.client.user.id);
    const neededPerms: PermissionString[] = ['ADMINISTRATOR'];
    if (bot.permissions.missing(neededPerms).length) {
      return msg.reply(msg.guild.lang.get('errors.botHasNoPermissionsForFeature', `${neededPerms.join(', ')}`));
    }

    const dbChannel = await db('channels').where('channelId', content).first();

    if (dbChannel) {
      await db('channels').where('channelId', content).delete();
      const index = msg.client.myCustomChannels.forJoin.indexOf(content);
      msg.client.myCustomChannels.forJoin.splice(index, 1);
      return msg.reply(msg.guild.lang?.get('channel.deleted', channel.name));
    } else {
      await db('channels').insert({ channelId: content });
      msg.client.myCustomChannels.forJoin.push(content);
      return msg.reply(msg.guild.lang?.get('channel.added', channel.name));
    }
  },
} as Command;
