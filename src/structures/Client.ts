import { Client, Collection, ClientOptions } from 'discord.js';
import { Command } from '../typings/discord';
import { readdirSync } from 'fs';
import { resolve } from 'path';
import logs from 'discord-logs';

export class ChannelsBot extends Client {
  commands: Collection<string, Command> = new Collection();
  myCustomChannels = {
    forJoin: [],
    created: [],
  };

  constructor(opts: ClientOptions) {
    super(opts);
  }

  async loadCommands() {
    for (const item of readdirSync(resolve(__dirname, '..', 'commands'))) {
      const command: Command = (await import(resolve(__dirname, '..', 'commands', item))).default;
      this.commands.set(command.name, command);
    }

    return this;
  }

  async loadLogsLib() {
    await logs(this);
    return this;
  }
}
