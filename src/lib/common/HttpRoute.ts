import {HttpMethod} from "./HttpMethod"
import {Route} from "./Route"
import * as express from 'express'

export type MiddlewareFunction = express.RequestHandler;

export class HttpRoute implements Route {
    constructor(public id: any,
                public name: string,
                public url: any,
                public method: HttpMethod,
                public callback: Function,
                public middlewares?: [MiddlewareFunction]) {
    }
}