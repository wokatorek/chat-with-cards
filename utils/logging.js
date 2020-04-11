const winston = require('winston');
const myFormat = winston.format.printf(({level, message, label, timestamp}) => {
    return `${timestamp} ${level} [${label}]: ${message}`;
});
exports.getLogger = function getLogger(label) {
    return winston.createLogger({
        format: winston.format.combine(
            winston.format.label({label: label}),
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.splat(),
            myFormat
        ),
        transports: [
            new winston.transports.Console({level: 'debug'})
        ]
    });
}


