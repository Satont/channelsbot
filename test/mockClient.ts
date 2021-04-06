import { Message as DJSMessage, GuildMember, User } from 'discord.js';
import { ChannelsBot } from '../src/structures/Client';
import MyGuild from '../src/structures/Guild';
import db from '../src/db';

export default async () => {
  let client = new ChannelsBot({});
  let user = new User(client, {
    id: '1',
    username: 'BOT USERNAME',
    discriminator: 'bottt#0000',
    avatar: 'user avatar url',
    bot: true,
  });
  client.user = user as any;
  let Message: DJSMessage;

  await client.loadCommands();
  await client.loadLogsLib();
  jest.fn(client.login);

  const g = new MyGuild(client, {
    name: 'Test Guild',
    id: '1',
  });
  g.loadLang('english');

  const guild = client.guilds.add(
    {
      name: 'Test Guild',
      id: '1',
      channels: [
        { name: 'Channel Parent', id: '11', type: 4 },
        { name: 'Voice Channel', id: '1', parent_id: '11', type: 2 },
        { name: 'text-channel', id: '2', parent_id: '11', type: 0 },
      ],
    },
    true,
  );

  const guildMember = new GuildMember(client, { user: User, permissions: ['ADMINISTRATOR'] }, guild);
  guildMember.permissions.add('ADMINISTRATOR');
  client.guilds.cache.get('1').members.cache.set('1', guildMember);

  Message = jest.fn().mockImplementation((data, channel) => {
    channel = {
      ...channel,
      send: jest.fn(),
    };
    return new DJSMessage(client, data, channel);
  }) as any;
  await db('settings').insert({ guildId: 1, lang: 'english' });

  return { client, Message };
};
