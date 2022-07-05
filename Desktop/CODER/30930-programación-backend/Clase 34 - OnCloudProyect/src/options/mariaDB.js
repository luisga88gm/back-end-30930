require('dotenv').config();

const optionsMySQL = {
    client: 'mysql',
    connection: {
      host : process.env.MARIADB_HOST || '127.0.0.1',
      port : process.env.MARIADB_PORT || 3306,
      user : process.env.MARIADB_USER ||'root',
      password : process.env.MARIADB_PSW || '',
      database : process.env.BD_PRODUCTOS ||'lggm'
    }
  };

module.exports = optionsMySQL;  