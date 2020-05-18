import { GuildMember, VoiceChannel } from 'discord.js'
import { channels, createdChannels } from '../index'
import db from '../db'

export default async ({ type, member, newChannel, oldChannel }: Options) => {
  if ((type === 'join' || type === 'switch') && channels.includes(newChannel.id)) {
    await member.fetch()
    const created = await newChannel.guild.channels
      .create(newChannel.guild.lang.get('channel.name', member.displayName), { 
        parent: newChannel.parentID,
        type: 'voice',
        permissionOverwrites: newChannel.parent.permissionOverwrites,
      })
      
    await created.updateOverwrite(member, {
      MANAGE_CHANNELS: true
    })

    await member.voice.setChannel(created)
    createdChannels.push(created.id)
    await db('created_channels').insert({ channelId: created.id })
    console.info(`${created.guild.name} | Channel ${created.name} created`)
  }

  if ((type === 'leave' || type === 'switch') && createdChannels.includes(oldChannel.id) && oldChannel?.permissionOverwrites.some(perm => perm.type === 'member' && perm.id === member.id)) {
    const index = createdChannels.indexOf(oldChannel.id)
    if (index) createdChannels.splice(index, 1)
    await db('created_channels').where({ channelId: oldChannel.id }).delete()
    await oldChannel.delete()
    console.info(`${member.guild.name} | Channel ${oldChannel.name} deleted, because ${member.displayName} leaved.`)
  }
}

interface Options {
  type: 'join' | 'leave' | 'switch';
  member: GuildMember;
  newChannel?: VoiceChannel;
  oldChannel?: VoiceChannel;
}
