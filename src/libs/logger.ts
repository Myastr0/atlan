import winston from 'winston';

import config from '../config';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.cli(),
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      dirname: config.logger.dirPath,
    }),
    new winston.transports.File({
      filename: 'combined.log',
      dirname: config.logger.dirPath,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
