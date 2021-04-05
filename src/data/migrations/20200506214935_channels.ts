import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return await knex.schema.createTable('created_channels', (table) => {
    table.increments('id').primary(), table.string('channelId').unique().notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return await knex.schema.dropTable('created_channels');
}
