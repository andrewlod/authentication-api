import winston from 'winston'
const { NODE_ENV, LOG_STRATEGY } = process.env

enum LogStrategies {
  CONSOLE = 'CONSOLE',
  FILE = 'FILE'
}

/**
 * Logger
 * 
 * Singleton wrapper for Winston logger, where a logging strategy can be chosen
 */
export class Logger {
  logger: winston.Logger

  constructor () {
    const transports: winston.transport[] = []
    if (LOG_STRATEGY === LogStrategies.CONSOLE) {
      transports.push(new winston.transports.Console())
    } else if (LOG_STRATEGY === LogStrategies.FILE) {
      transports.push(new winston.transports.File({ filename: 'output.log' }))
    } else {
      throw new Error(`Invalid log strategy: ${LOG_STRATEGY}`)
    }

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports
    })
  }

  error (message: string): void {
    this.logger.error(message)
  }

  warn (message: string): void {
    this.logger.warn(message)
  }

  info (message: string): void {
    if (NODE_ENV !== 'production') {
      this.logger.info(message)
    }
  }

  http (message: string): void {
    this.logger.http(message)
  }

  debug (message: string): void {
    if (NODE_ENV !== 'production') {
      this.logger.debug(message)
    }
  }
};

export default new Logger()
