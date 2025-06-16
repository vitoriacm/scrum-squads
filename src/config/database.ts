import knex from 'knex';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './database/daily_scrum.db',
  },
  useNullAsDefault: true,
});

export default db;
