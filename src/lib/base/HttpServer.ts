import {Server} from "./Server";
import * as http from "http";
import * as express from "express";

export abstract class HttpServer extends Server {

    private readonly httpServer: http.Server;
    private port: Number;

    constructor(express: express.Express) {
        super();

        if (express) {
            this.httpServer = http.createServer(express);
        } else {
            this.httpServer = http.createServer();
        }
    }

    public getPort(): Number {
        return this.port || 3000;
    }

    public setPort(value: Number) {
        this.port = value;
        return this;
    }

    public getHttpServer(): http.Server {
        return this.httpServer;
    }

    public start(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.httpServer)
                return reject(new Error("Failed to create http server."));

            this.httpServer.on('error', (error: any) => {
                this.getLogger().error(error);
                reject(error);
            });

            this.httpServer.on('listening', () => {
                this.getLogger().info('Listening on port %s', this.port);
                resolve(this.httpServer);
            });

            this.httpServer.listen(this.port);
        });
    }
}