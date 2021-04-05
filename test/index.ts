import { TextChannel, Message, Client } from 'discord.js';
import { clientSetup } from '../src/bot';
import ChannelsCommand from '../src/commands/channels';

describe('ping', () => {
  jest.mock('discord.js', () => ({
    Client: {
      login: jest.fn(),
    },
    Message: {
      channel: {
        send: jest.fn(),
      },
      reply: jest.fn(),
    },
  }));

  let client: Client;

  beforeAll(async () => {
    client = await clientSetup();
    client.login = jest.fn();
  });

  it('Add channels to client cache', async () => {
    const guild = await client.guilds.create('Test Guild', {
      channels: [
        { name: 'Voice Channel', type: 'voice' as any, id: 12345 },
        { name: 'text-channel', id: 0 },
      ],
    });

    const channel = guild.channels.cache.get('0') as TextChannel;
    const message = new Message(client, { context: 'cc!12345', id: '1111' }, channel);
    await ChannelsCommand.run(message, ['12345']);
    expect(client.myCustomChannels.forJoin).toBe(['12345']);
  });
});
