import { GuildMember, VoiceChannel } from 'discord.js'
import { channels, createdChannels } from '../index'
import db from '../db'

export default async ({ type, member, channel }: Options) => {
  if (type === 'join' && channels.includes(channel.id)) {
    await member.fetch()
    const created = await channel.guild.channels
      .create(channel.guild.lang.get('channel.name', member.displayName), { 
        parent: channel.parentID,
        type: 'voice',
        permissionOverwrites: channel.parent.permissionOverwrites,
      })
      
    await created.updateOverwrite(member, {
      MANAGE_CHANNELS: true
    })

    await member.voice.setChannel(created)
    createdChannels.push(created.id)
    await db('created_channels').insert({ channelId: created.id })
    console.info(`${created.guild.name} | Channel ${created.name} created`)
  }

  if (type === 'leave' && createdChannels.includes(channel.id) && channel?.permissionOverwrites.some(perm => perm.type === 'member' && perm.id === member.id)) {
    const index = createdChannels.indexOf(channel.id)
    if (index) createdChannels.splice(index, 1)
    await db('created_channels').where({ channelId: channel.id }).delete()
    await channel.delete()
    console.info(`${member.guild.name} | Channel ${channel.name} deleted, because ${member.displayName} leaved.`)
  }
}

interface Options {
  type: 'join' | 'leave';
  member: GuildMember;
  channel?: VoiceChannel;
}
