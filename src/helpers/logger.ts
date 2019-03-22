import { createLogger, format, transports } from "winston";

const logger = createLogger({
  defaultMeta: { service: "test-ts" },
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
