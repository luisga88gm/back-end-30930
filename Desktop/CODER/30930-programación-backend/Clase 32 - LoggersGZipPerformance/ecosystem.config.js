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
            args: '-p=8080',
        },
        {
            name: 'app1',
            script: 'src/index.js',
            watch: true,
            autorestart: true,
            args: '-p=8081',
        },
        {
            name: 'app2',
            script: 'src/index.js',
            watch: true,
            autorestart: true,
            args: '-p=8082',
        },
        {
            name: 'app3',
            script: 'src/index.js',
            watch: true,
            autorestart: true,
            args: '-p=8083',
        },{
            name: 'app4',
            script: 'src/index.js',
            watch: true,
            autorestart: true,
            args: '-p=8084',
        },{
            name: 'app5',
            script: 'src/index.js',
            watch: true,
            autorestart: true,
            args: '-p=8085',
        },
        // {
            // script: './service-worker/',
            // watch: ['./service-worker'],
        // },
    ],
};