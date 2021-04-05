import dotenv from 'dotenv';
dotenv.config();
import { ShardingManager } from 'discord.js';
import { resolve } from 'path';
import './commons/logUsage';

export const manager = new ShardingManager(resolve(__dirname, 'bot.js'), {
  token: process.env.DISCORD_TOKEN,
  totalShards: 'auto',
  shardList: 'auto',
  mode: 'worker',
});

manager.on('shardCreate', (shard) => console.log(`Launched shard ${shard.id}`));

const setBotStatus = async () => {
  const [guilds, members] = await Promise.all([
    manager.fetchClientValues('guilds.cache.size'),
    manager.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
  ]);

  const totalGuilds = guilds.reduce((acc, guildCount) => acc + guildCount, 0);
  const totalMembers = members.reduce((acc, memberCount) => acc + memberCount, 0);

  manager.broadcastEval(
    `this.user.setPresence({ activity: { type: 'WATCHING', name: '${totalGuilds} guilds, ${totalMembers} ppls' }, status: 'DND' })`,
  );
};

setInterval(() => setBotStatus(), 60 * 1000);

manager.spawn().then(() => {
  setBotStatus();
  import('./http');
});
