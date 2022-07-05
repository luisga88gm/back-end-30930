const express =require('express');
const { Server } = require('http');
const router = express.Router();
const os = require('os')
const compression=require('compression')
router.get('/', compression(), (req, res)=>{
    const info={
        args: process.argv.slice(2),
        nombrePlataforma: process.platform ,
        verNode: process.version,
        mem: process.memoryUsage().rss,
        pathEjecucion: process.execPath,
        pid: process.pid,
        procesadores: os.cpus().length,
        carpetaProy: process.cwd()
    }
    console.log('INFO', info)
    res.render('info', {info: info})
});

module.exports = router;