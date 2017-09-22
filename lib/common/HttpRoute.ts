import {HttpMethod} from "./HttpMethod"
import {Route} from "./Route"
import * as express from 'express'

export type MiddlewareFunction = express.RequestHandler;

export class HttpRoute implements Route {
    constructor(public id: string,
                public name: string,
                public url: string,
                public method: HttpMethod,
                public callback: Function,
                public middlewares?: [MiddlewareFunction]) {
    }
}