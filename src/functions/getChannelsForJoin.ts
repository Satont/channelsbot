import { Client, Collection, VoiceChannel } from 'discord.js';

export function getChannelsForJoin(this: Client) {
  const channels = this.channels.cache.filter(
    (channel) => this.myCustomChannels.forJoin.includes(channel.id) && channel.type === 'voice',
  ) as Collection<string, VoiceChannel>;

  return channels.map((channel) => ({
    name: channel.name,
    guild: { id: channel.guild.id, name: channel.guild.name },
    created: channel.createdAt,
    parent: {
      id: channel.parent.id,
      name: channel.parent.name,
    },
  }));
}
