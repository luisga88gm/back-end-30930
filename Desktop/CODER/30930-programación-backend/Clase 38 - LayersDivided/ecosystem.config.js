/**
 * https://pm2.keymetrics.io/docs/usage/application-declaration/
 */
module.exports = {
    apps: [
        {
            name: 'app0',
            script: 'src/index.js',
            watch: true,
            autorestart: true,
            env:{
                NODE_ENV: 'development',
            },
            en_production:{
                NODE_ENV: 'production'
            }
        }

    ]
};