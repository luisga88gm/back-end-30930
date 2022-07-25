const config = require('./index')

const optionsMySQL = {
    client: 'mysql',
    connection: {
      host : config.MARIADB_HOST || '127.0.0.1',
      port : config.MARIADB_PORT || 3306,
      user : config.MARIADB_USER ||'root',
      password : config.MARIADB_PSW || '',
      database : config.BD_PRODUCTOS ||'lggm'
    }
  };

module.exports = optionsMySQL;  