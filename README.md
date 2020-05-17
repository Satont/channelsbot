#### Discord "Channels Creator" bot
---

![](https://img.shields.io/github/workflow/status/Satont/channelsbot/Node.js%20CI/master?style=for-the-badge) ![](https://img.shields.io/david/satont/channelsbot?style=for-the-badge) [![Invite bot](https://img.shields.io/badge/invite-bot-blue?label=invite&color=7289da&logo=discord&style=for-the-badge&logoColor=7289da)](https://discord.com/api/oauth2/authorize?client_id=706630095812558900&permissions=8&scope=bot) ![](https://img.shields.io/badge/dynamic/json?logo=discord&color=7289da&label=guilds&query=length&url=https://channels-bot.tk/api/v1/guilds&style=for-the-badge)

That bot creating voice channels on your guild.

#### How it works.

You setting channels for watching. When users join setted channel, then bot creating voice channel in the same category with inherited permissions, moving user in created channel and give's admin permission (only on this channel) for user.

#### Commands
  - lang 
    - Changing bot language for current guild.
    - Initiator of command should has `Administrator` or `Manage guild` permission.
    - Currently avaliable langs: russian, english.
    - Example of usage: `@bot lang russian`
 - kick 
    - Kicks user from voice channel.
    - Initiator of command should be admin in channel.
    - Initiator of command should be in created by bot channel
    - Example of usage: `@bot kick @user`
  - list 
    - Prints listened on join channels.
    - Initiator of command should has `Manage Channels` permission.
    - Example of usage: `@bot list`
  - 0123456789987654321
    - Will add that channel for listen list, if not exist. Otherwise bot will delete that channel from listen list!
    - Example of usage: `@bot 0123456789987654321`

#### Important
  - Bot listen `kick` command only in the same category when he creating channels.
   `What is that mean? It's mean you should create text channel in the same category where your "create channel" exists.`