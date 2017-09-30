import {HttpServer} from "./base/HttpServer"
import * as express from "express"
import * as _ from "lodash"
import {HttpMethod} from "./common/HttpMethod"
import {buildUrl} from "./common/Route"
import {View} from "./common/View"
import * as compression from 'compression'
import * as helmet from 'helmet'
import * as bodyParser from "body-parser"
import * as cookieParser from "cookie-parser"
import * as  session from 'express-session'
import * as cors from 'cors'

import {Error as RError, Result} from "./common/Response"
import "reflect-metadata"

const SESSION_SECRET = '220183';

export class WebServer extends HttpServer {

    public static readonly controllers: any[] = [];

    private express: express.Express;

    private nuxt: any;

    constructor(nuxtConfig?, useCors?: boolean) {
        let application = express();
        super(application);

        this.express = application;
        /* default routes */
        this.express.use(bodyParser.urlencoded({extended: true}));
        this.express.use(bodyParser.json());
        this.express.use(cookieParser());
        this.express.use(session({
            secret: SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {maxAge: 1000 * 60 * 60 * 24}
        }));
        this.express.use(compression({threshold: 0}));
        this.express.use(helmet());

        if (useCors)
            this.express.use(cors);

        if (nuxtConfig) {
            const {Nuxt} = require('nuxt');
            this.nuxt = new Nuxt(nuxtConfig);
        }
    }

    private async initialize() {
        if (this.nuxt && this.nuxt.options.dev) {
            const {Builder} = require('nuxt');
            await new Builder(this.nuxt).build();
        }

        let router = express.Router();
        let controllers = WebServer.controllers;
        for (const controller of controllers) {
            let routes = Reflect.getOwnMetadata('custom:routes', controller.prototype);
            let parameters = Reflect.getOwnMetadata('custom:parameters', controller.prototype);
            let instance = new controller;

            _.keys(routes)
                .map(key => routes[key])
                .forEach(route => {
                    let url = buildUrl(controller.prototype, route.name, route.url);
                    this.getLogger().info(HttpMethod[route.method] + ' - ' + url);

                    if (route.middlewares)
                        router[HttpMethod[route.method]](url, route.middlewares, this.createRoute(route, instance, parameters));
                    else
                        router[HttpMethod[route.method]](url, this.createRoute(route, instance, parameters));
                });
        }

        this.express.use(router);

        if (this.nuxt) {
            this.express.use(this.nuxt.render);
        }
    }

    private createRoute(route, instance, parameters) {
        return async (req: express.Request, res: express.Response) => {
            const values: any[] = [];
            if (parameters) {
                const params = parameters[route.name];
                if (params) {
                    for (const param of params) {
                        values[param.index] = param.getValue(req);
                    }
                }
            }

            let result = route.callback.apply(instance, values);
            if (typeof result.then === 'function') {
                try {
                    result = await result;
                } catch (e) {
                    this.getLogger().error(e);
                    result = new RError(500, 'Internal server error.');
                }
            } else if (result instanceof View) {
                return res.render(result.template, result.options);
            }

            if (result instanceof RError) {
                res.status(result.code).json({
                    ok: false,
                    message: result.message
                })
            } else if (result instanceof Result) {
                let object = {
                    ok: true
                };

                if (result.name && result.content)
                    object[result.name] = result.content;

                res.json(object);
            } else {
                throw new Error('Invalid return type.')
            }
        };
    }

    public start() {
        this.initialize().then(() => {
            super.start();
        });
    }
}