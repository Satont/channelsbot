import { Structures, Client } from 'discord.js';
import db from '../db';
import { Lang } from '../langs';

export default Structures.extend('Guild', (Guild) => {
  class GuildLang extends Guild {
    lang: Lang;

    private dbInstance;
    constructor(client: Client, data: any) {
      super(client, data);
      this.load().then(() => this.loadLang());
    }

    async load() {
      this.dbInstance = await db('settings').where({ guildId: this.id }).first();
      const guild = await this.fetch();
      if (!this.dbInstance) {
        [this.dbInstance] = await db('settings')
          .insert({
            guildId: this.id,
            lang: guild.region === 'russia' ? 'russian' : 'english',
          })
          .returning('*');
      }
    }

    loadLang(lang: 'russian' | 'english' = 'english') {
      this.lang = new Lang(lang);
    }
  }
  return GuildLang;
});
