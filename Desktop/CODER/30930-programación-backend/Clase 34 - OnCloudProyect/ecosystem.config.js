module.exports = {
    apps: [
        {
            name: 'app0',
            script: 'src/index.js',
            watch: true,
            autorestart: true,
            instances: 'max',
            env:{
                NODE_ENV: 'development',
            },
            en_production:{
                NODE_ENV: 'production'
            }
        }

    ]
};