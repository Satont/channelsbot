import { Structures, Client, Guild as GuildType } from 'discord.js'
import db from '../db'
import { Lang } from '../langs'

export default Structures.extend('Guild', Guild => {
  class GuildLang extends Guild {
    lang: Lang

    private dbInstance
    constructor(client: Client, data: GuildType) {
      super(client, data);
      this.load()
    }
    private async load() {
      this.dbInstance = await db('settings').where({ guildId: this.id }).first()
      const guild = await this.fetch()
      if (!this.dbInstance) {
        [this.dbInstance] = await db('settings').insert({ 
          guildId: this.id,
          lang: guild.region === 'russia' ? 'russian' : 'english'
        }).returning('*')
      }
      await this.loadLang()
    }
    async loadLang() {
      this.lang = new Lang(this.dbInstance.lang)
    }
  }
  return GuildLang
})
