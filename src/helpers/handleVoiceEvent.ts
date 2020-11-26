import { GuildMember, VoiceChannel } from 'discord.js'
import { client } from '../bot'
import db from '../db'

export default async ({ type, member, newChannel, oldChannel }: Options) => {
  if ((type === 'join' || type === 'switch') && client.myCustomChannels.forJoin.includes(newChannel?.id)) {
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

    member.voice.setChannel(created)
      .then(async () => {
        client.myCustomChannels.created.push(created.id)
        await db('created_channels').insert({ channelId: created.id })
        console.info(`${created.guild.name}(${created.guild.id}) | Channel ${created.name} created`)
      })
      .catch(() => {
        created.delete()
      })
  }

  if ((type === 'leave' || type === 'switch') && client.myCustomChannels.created.includes(oldChannel?.id) && oldChannel.members.size === 0) {
    const index = client.myCustomChannels.created.indexOf(oldChannel.id)
    if (index) client.myCustomChannels.created.splice(index, 1)
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
