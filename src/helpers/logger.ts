import { createLogger, format, transports } from "winston";

/**
 * Application logger
 * TODO set level in configuration
 */
const logger = createLogger({
  defaultMeta: { service: "worst-pi-computer" },
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  level: "info",
  transports: []
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  );
}

export default logger;
