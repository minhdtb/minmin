import {Request} from 'express';

const PRIMITIVE_TYPES: Function[] = [Object, String, Array, Number, Boolean];

export interface IParameter {
    name: string,
    index: Number,

    getValue(req: Request): any
}

export abstract class Parameter {

    constructor(public type: Function) {
    }

    protected getRawValue(value: any): any {
        if (typeof value === 'undefined')
            return null;

        const ctor = this.type as any;

        if (value.constructor === ctor) {
            return value;
        } else {
            return PRIMITIVE_TYPES.indexOf(ctor) !== -1 ? ctor(value) : new ctor(value);
        }
    }
}

export function getParameters(target: Object): {} {
    if (!Reflect.hasOwnMetadata('custom:parameters', target)) {
        Reflect.defineMetadata('custom:parameters', {}, target);
    }

    return Reflect.getOwnMetadata('custom:parameters', target);
}