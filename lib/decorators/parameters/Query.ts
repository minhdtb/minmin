import 'reflect-metadata';
import {getParameters, IParameter, Parameter} from "../../common/Parameter";
import {Request} from 'express';

export function Query<Function>(name: string): ParameterDecorator {
    return (target: Function, method: string, index: number) => {
        let parameters = getParameters(target);
        if (!parameters[method]) {
            parameters[method] = [];
        }

        let type = Reflect.getOwnMetadata('design:paramtypes', target, method)[index];
        parameters[method].push(new QueryParameter(name, type, index));
    };
}

export class QueryParameter extends Parameter implements IParameter {

    constructor(public name: string,
                public type: Function,
                public index: Number) {
        super(type);
    }

    public getValue(req: Request) {
        return this.getRawValue(req.query[this.name]);
    }
}