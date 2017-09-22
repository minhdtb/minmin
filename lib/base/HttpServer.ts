import {Server} from "./Server";
import * as http from "http";
import * as express from "express";

export abstract class HttpServer extends Server {
    private httpServer: http.Server;
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
    }

    public getHttpServer(): http.Server {
        return this.httpServer;
    }

    public start() {
        if (!this.httpServer)
            return;

        this.httpServer.on('error', (error: any) => {
            this.getLogger().error(error);
        });

        this.httpServer.on('listening', () => {
            this.getLogger().info('Listening on port %s', this.port);
        });

        this.httpServer.listen(this.port);
    }
}