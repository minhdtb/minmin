import * as winston from "winston";
import * as moment from "moment";

export abstract class Server {
    private logger: winston.LoggerInstance;

    constructor() {
        this.logger = new winston.Logger({
            transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)({
                    filename: 'server.log',
                    timestamp: function () {
                        return moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS');
                    },
                    humanReadableUnhandledException: true,
                    maxsize: 1024 * 1024 * 10,
                    maxFiles: 5,
                    json: false
                })
            ]
        });

        process.on('uncaughtException', (error: any) => {
            this.getLogger().error(error);
        });
    }

    getLogger(): winston.LoggerInstance {
        return this.logger;
    }

    abstract start();
}