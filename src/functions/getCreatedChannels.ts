import { Client, Collection, VoiceChannel } from 'discord.js'

export function getCreatedChannels(this: Client) {
  const channels: Collection<string, VoiceChannel> = this.channels.cache
    .filter(channel => this.myCustomChannels.created.includes(channel.id) && channel.type === 'voice') as any

  return channels.map((channel: VoiceChannel) => ({
    name: channel.name,
    guild: { id: channel.guild.id, name: channel.guild.name },
    members: {
      size: channel.members.size,
      limit: channel.userLimit,
      list: channel.members.map(member => ({
      id: member.id,
      tag: member.user.tag,
      displayName: member.displayName,
      deaf: member.voice.deaf,
      mute: member.voice.mute,
      admin: channel.permissionOverwrites.find(perm => perm.type === 'member' && perm.id === member.id) ? true : false
    }))
    },
    created: channel.createdAt,
    parent: {
      id: channel.parent.id,
      name: channel.parent.name,
    },
  }))
}
