import winston from "winston";
const { createLogger, format, transports } = winston;
import { SqlTransport } from "winston-sql-transport";

export const logger = createLogger({
  transports: [
    //File transport
    new transports.File({
      filename: "logs/server.log",
      format: format.combine(
        format.timestamp({ format: "DD-MMM-YYYY HH:mm:ss" }),
        format.align(),
        format.printf(
          (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
      ),
    }),

    //Console transport
    new transports.Console({
      level: "debug",
      handleExceptions: true,
      json: false,
      colorize: true,
      format: format.combine(format.colorize(), format.simple()),
    }),

    //SQL transport
    new SqlTransport({
      client: "mysql",
      connection: {
        host: "127.0.0.1",
        user: "root",
        password: "2homOBC5",
        database: "users_db",
      },
      tableName: "server_logs",
    }),
  ],
});
