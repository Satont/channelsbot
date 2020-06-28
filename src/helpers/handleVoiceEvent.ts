import { GuildMember, VoiceChannel } from 'discord.js'
import { channels, createdChannels } from '../index'
import db from '../db'
import { PermissionOverwrites } from 'discord.js'

export default async ({ type, member, newChannel, oldChannel }: Options) => {
  if ((type === 'join' || type === 'switch') && channels.includes(newChannel?.id)) {
    await member.fetch()

    if(!newChannel.parent){
      const created = await newChannel.guild.channels
        .create(newChannel.guild.lang.get('channel.name', member.displayName), { 
          parent: newChannel.parentID,
          type: 'voice',
        })
        
      await created.updateOverwrite(member, {
        MANAGE_CHANNELS: true
      })

      member.voice.setChannel(created)
        .then(async () => {
          createdChannels.push(created.id)
          await db('created_channels').insert({ channelId: created.id })
          console.info(`${created.guild.name}(${created.guild.id}) | Channel ${created.name} created`)
        })
        .catch(() => {
          created.delete()
        })
    }else{
      const created = await newChannel.guild.channels
        .create(newChannel.guild.lang.get('channel.name', member.displayName), { 
          parent: newChannel.parentID,
          type: 'voice',
          permissionOverwrites: newChannel.parent.permissionOverwrites,
        })
        
      await created.updateOverwrite(member, {
        MANAGE_CHANNELS: true
      })

      member.voice.setChannel(created)
        .then(async () => {
          createdChannels.push(created.id)
          await db('created_channels').insert({ channelId: created.id })
          console.info(`${created.guild.name}(${created.guild.id}) | Channel ${created.name} created`)
        })
        .catch(() => {
          created.delete()
        })
    }
  }

  if ((type === 'leave' || type === 'switch') && createdChannels.includes(oldChannel?.id) && oldChannel.members.size === 0) {
    const index = createdChannels.indexOf(oldChannel.id)
    if (index) createdChannels.splice(index, 1)
    await db('created_channels').where({ channelId: oldChannel.id }).delete()
    console.info(`${member.guild.name}(${member.guild.id}) | Channel ${oldChannel.name} deleted, because ${member.displayName} leaved.`)
    await oldChannel.delete()
  }
}

interface Options {
  type: 'join' | 'leave' | 'switch';
  member: GuildMember;
  newChannel?: VoiceChannel;
  oldChannel?: VoiceChannel;
}
