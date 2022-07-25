require('dotenv').config();

const config={
    MONGO_ATLAS_SRV2: process.env.MONGO_ATLAS_SRV2,
    SESSION_SECRET: process.env.SESSION_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    MARIADB_HOST: process.env.MARIADB_HOST,
    MARIADB_PORT: process.env.MARIADB_PORT,
    MARIADB_USER: process.env.MARIADB_USER,
    MARIADB_PSW: process.env.MARIADB_PSW,   
    BD_PRODUCTOS: process.env.BD_PRODUCTOS,
    TIPOCAMBIO_USD: process.env.TIPOCAMBIO_USD || 136,
    IMPUESTOS_USD: process.env.IMPUESTOS_USD || 1.75
}

module.exports=config