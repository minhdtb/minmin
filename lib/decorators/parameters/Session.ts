import 'reflect-metadata';
import {getParameters, IParameter, Parameter} from "../../common/Parameter";

export function Session<Function>(): ParameterDecorator {
    return (target: Function, method: string, index: number) => {
        let parameters = getParameters(target);
        if (!parameters[method]) {
            parameters[method] = [];
        }

        let type = Reflect.getOwnMetadata('design:paramtypes', target, method)[index];
        parameters[method].push(new SessionParameter('', type, index));
    };
}

export class SessionParameter extends Parameter implements IParameter {

    constructor(public name: string,
                public type: Function,
                public index: Number) {
        super(type);
    }

    public getValue(req: any) {
        return this.getRawValue(req.session);
    }
}