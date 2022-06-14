const express =require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    const info={
        args: process.argv.slice(2),
        nombrePlataforma: process.platform ,
        verNode: process.version,
        mem: process.memoryUsage().rss,
        pathEjecucion: process.execPath,
        pid: process.pid,
        carpetaProy: process.cwd()
    }
    console.log('INFO', info)
    res.render('info', {info: info})
});

module.exports = router;