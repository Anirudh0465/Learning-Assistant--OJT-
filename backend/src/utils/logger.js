import winston from 'winston';

const  format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({stack: true}),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

import fs from 'fs';

let canWriteFiles = false;
try {
    if (!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs', { recursive: true });
    }
    canWriteFiles = true;
} catch (error) {
    console.warn("Read-only filesystem detected, falling back to Console logs.");
    canWriteFiles = false;
}

const createLogger = (filename, level = 'info') => 
    winston.createLogger({
        level,
        format,
        transports: canWriteFiles 
            ? [
                new winston.transports.Console(), 
                new winston.transports.File({ filename: `./logs/${filename}`})
              ]
            : [new winston.transports.Console()],
    });

export const authLogger = createLogger('auth.log');
export const errorLogger = createLogger('error.log','error');

export const combinedLogger = winston.createLogger({
    level: "info",
    format,
    transports: canWriteFiles 
        ? [
            new winston.transports.Console(),
            new winston.transports.File({ filename:"logs/combined.log" }),
        ]
        : [new winston.transports.Console()],
});