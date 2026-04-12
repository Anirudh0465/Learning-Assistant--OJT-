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
    // Vercel deploys the logs folder, so existsSync is true, but it's still read-only!
    // We must actually test writing a file to confirm.
    const testFile = './logs/.test_write_access';
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
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
export const aiLogger = createLogger('ai.log');

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