import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('settings', (table) => {
    table.increments('id').primary(), table.string('guildId').unique().notNullable(), table.string('lang').defaultTo('english');
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('settings');
}
