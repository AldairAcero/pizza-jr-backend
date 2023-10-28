const { createLogger, format, transports } = require("winston");

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const timezoned = () => {
  return new Date().toLocaleString("es-Mx", {
    timeZone: "CST",
  });
};

const logger = createLogger({
  levels: logLevels,
  format: format.combine(
    format.timestamp({ format: timezoned }),
    format.json()
  ),
  transports: [
    new transports.Console({}),
    new transports.File({ filename: "./file.log", options: { flags: "w" } }),
  ],
  exceptionHandlers: [new transports.File({ filename: "./file.log" })],
  rejectionHandlers: [new transports.File({ filename: "./file.log" })],
});

module.exports = { logger };
