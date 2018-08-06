import {IParameter, Parameter} from "./Parameter";
import {Request} from "express";

export abstract class StdParameter extends Parameter implements IParameter {

    constructor(public name: any,
                          public type: Function,
                          public index: Number) {
        super(type);
    }

    getValue(req: Request): any {
    }
}