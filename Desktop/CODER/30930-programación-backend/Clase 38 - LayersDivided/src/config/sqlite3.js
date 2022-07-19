const optionsSQLite = {
    client: 'sqlite3',
    connection: {
      filename: './src/db/ecommerce.sqlite'
    },
    useNullAsDefault: true,
};

module.exports = optionsSQLite;