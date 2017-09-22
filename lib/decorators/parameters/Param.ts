import {Request} from 'express';
import {getParameters, IParameter, Parameter} from "../../common/Parameter";

export function Param<Function>(name?: string, optional?: boolean): ParameterDecorator {
    return (target: Object, method: string, index: number) => {
        let parameters = getParameters(target);
        if (!parameters[method]) {
            parameters[method] = [];
        }

        let type = Reflect.getOwnMetadata('design:paramtypes', target, method)[index];
        parameters[method].push(new ParamParameter(name, type, index, optional));
    };
}

export class ParamParameter extends Parameter implements IParameter {

    constructor(public name: string,
                public type: Function,
                public index: Number,
                public optional?: boolean) {
        super(type);
        if (!this.name) {
            this.name = 'value' + this.index;
        }

        this.name += (optional ? '?' : '')
    }

    public getValue(req: Request) {
        let paramName = this.name.endsWith('?') ? this.name.substr(0, this.name.length - 1) : this.name;
        return this.getRawValue(req.params[paramName]);
    }
}