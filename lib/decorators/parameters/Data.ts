import {Request} from 'express';
import {getParameters, IParameter, Parameter} from "../../common/Parameter";

export function Data<Function>(name?: string): ParameterDecorator {
    return (target: Object, method: string, index: number) => {
        let parameters = getParameters(target);
        if (!parameters[method]) {
            parameters[method] = [];
        }

        let type = Reflect.getOwnMetadata('design:paramtypes', target, method)[index];
        parameters[method].push(new DataParameter(name, type, index));
    };
}

export class DataParameter extends Parameter implements IParameter {

    constructor(public name: string,
                public type: Function,
                public index: Number) {
        super(type);
    }

    public getValue(req: Request) {
        return this.getRawValue(this.name ? req.body[this.name] : req.body);
    }
}