import * as express from "express"

export interface IResponse {
    exec(res: express.Response): void;
}

export class Result implements IResponse {

    constructor(public name?: string, public content?: any) {

    }

    exec(res: express.Response) {
        let object = {
            ok: true
        } as any;

        if (this.name && this.content)
            object[this.name] = this.content;

        res.json(object);
    }
}

export class Error implements IResponse {

    constructor(public message: string, public code?: number) {

    }

    exec(res: express.Response) {
        res.status(this.code ? this.code : 500).json({
            ok: false,
            message: this.message
        })
    }
}

export class View implements IResponse {

    constructor(public template: string, public options?: any) {

    }

    exec(res: express.Response) {
        res.render(this.template, this.options);
    }
}

export class Redirect implements IResponse {

    constructor(public url: string) {
    }

    exec(res: express.Response): void {
        res.redirect(this.url);
    }
}