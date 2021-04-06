import { TextChannel, Collection } from 'discord.js';
import { ChannelsBot } from '../src/structures/Client';
import ChannelCommand from '../src/commands/channels';
import HelpCommand from '../src/commands/help';
import InfoCommand from '../src/commands/info';
import mockClient from './mockClient';

process.env.DISCORD_TOKEN = 'test';

describe('ping', () => {
  let client: ChannelsBot;
  let mockedObject = beforeAll(async () => {
    const mocked = await mockClient();
    client = mocked.client;
    mockedObject = mocked;
  });

  it('Client properly initialized', async () => {
    expect(client.commands).toBeInstanceOf(Collection);
    expect(client.myCustomChannels).toMatchObject({ created: [], forJoin: [] });
  });

  it('Command cc!1 should add channel to array', async () => {
    const guild = client.guilds.cache.get('1');
    const channel = guild.channels.cache.get('2') as TextChannel;
    const message = new mockedObject.Message({ content: 'cc!1', guild, id: '123', client, author: guild.members.cache.get('1') }, channel);
    await ChannelCommand.run(message, ['1'], '1');

    expect(client.myCustomChannels.forJoin).toContain('1');
  });

  it('Second usage of cc! should remove channel from array', async () => {
    const guild = client.guilds.cache.get('1');
    const channel = guild.channels.cache.get('2') as TextChannel;
    const message = new mockedObject.Message({ content: 'cc!1', guild, id: '123', client, author: guild.members.cache.get('1') }, channel);
    await ChannelCommand.run(message, ['1'], '1');

    expect(client.myCustomChannels.forJoin).not.toContain('1');
  });

  it('Help comamnd should send embed', async () => {
    const guild = client.guilds.cache.get('1');
    const channel = guild.channels.cache.get('2') as TextChannel;
    const message = new mockedObject.Message(
      { content: 'cc!help', guild, id: '123', client, author: guild.members.cache.get('1') },
      channel,
    );
    await HelpCommand.run(message);
    expect(message.channel.send).toBeCalled();
  });

  it('Info command should send embed', async () => {
    const guild = client.guilds.cache.get('1');
    const channel = guild.channels.cache.get('2') as TextChannel;
    const message = new mockedObject.Message(
      { content: 'cc!help', guild, id: '123', client, author: guild.members.cache.get('1') },
      channel,
    );
    await InfoCommand.run(message);
    expect(message.channel.send).toBeCalled();
  });
});
