const config = require ('./index')

const optionsSQLite = {
    client: 'pg',
    connection: {
      connectionString: config.DATABASE_URL,
      ssl: { rejectUnauthorized: false},
    },
};

module.exports = optionsSQLite;