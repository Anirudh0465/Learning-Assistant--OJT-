import winston from 'winston';

const  format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({stack: true}),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

const isProd = process.env.VERCEL || process.env.NODE_ENV === 'production';

const createLogger = (filename, level = 'info') => 
    winston.createLogger({
        level,
        format,
        transports: isProd 
            ? [new winston.transports.Console()]
            : [new winston.transports.File({ filename: `./logs/${filename}`})],
    });

export const authLogger = createLogger('auth.log');
export const errorLogger = createLogger('error.log','error');

export const combinedLogger = winston.createLogger({
    level: "info",
    format,
    transports: isProd 
        ? [new winston.transports.Console()]
        : [
            new winston.transports.Console(),
            new winston.transports.File({ filename:"logs/combined.log" }),
        ],
});