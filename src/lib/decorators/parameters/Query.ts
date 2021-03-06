import 'reflect-metadata';
import {getParameters} from "../../common/Parameter";
import {Request} from 'express';
import {StdParameter} from "../../common/StdParameter";

export function Query<Function>(name: string): ParameterDecorator {
    return (target: Function, method: string, index: number) => {
        let parameters = getParameters(target) as any;
        if (!parameters[method]) {
            parameters[method] = [];
        }

        let type = Reflect.getOwnMetadata('design:paramtypes', target, method)[index];
        parameters[method].push(new QueryParameter(name, type, index));
    };
}

export class QueryParameter extends StdParameter {

    public getValue(req: Request) {
        return this.getRawValue(req.query[this.name]);
    }
}