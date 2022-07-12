const winston=require('winston')

const {createLogger, format, transports} = winston;
const {combine, printf, timestamp, colorize} =format;

// configuracion de Winston (logger)
const logger=createLogger({
    level:'info',
    format: combine(
        timestamp({
            format: 'MM-DD-YYYY HH:mm:ss',
        }),
        printf((info)=>`${info.level} | ${info.timestamp} | ${info.message}`)
    ),
    transports:[
        new transports.Console({
            format: combine(
                timestamp({
                    format: 'MM-DD-YYYY HH:mm:ss',
                }),
                colorize(),
                printf((info)=>`${info.level} | ${info.timestamp} | ${info.message}`)
            ),
        }),
        new transports.File({
            filename: './logs/warn.log',
            level: 'warn',
        }),
        new transports.File({
            filename: './logs/error.log',
            level: 'error'
        })
    ]
});

const loggeoPeticiones=(req, res, next)=>{
    logger.info(`Accediendo a la ruta ${req._parsedOriginalUrl.path} - Utilizando el metodo ${req.method}`);
    next()
}

module.exports={logger , loggeoPeticiones}
