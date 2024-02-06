import winston from "winston";

const logconfig = {
    levels:{
        'fatal': 0,
        'error': 1,
        'warning': 2,
        'info': 3,
        'http': 4,
        'debug': 5
    },
    colors:{
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        http: 'cyan',
        debug: 'green'
    }

}

const logger = winston.createLogger({
    levels: logconfig.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({colors: logconfig.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: "warning",
            format: winston.format.simple()
        })
    ]
})

export const prodLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} in ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
}