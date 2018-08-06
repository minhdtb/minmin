import {Request} from 'express';
import {getParameters} from "../../common/Parameter";
import {StdParameter} from "../../common/StdParameter";

export function Param<Function>(name?: string, optional?: boolean): ParameterDecorator {
    return (target: Object, method: string, index: number) => {
        let parameters = getParameters(target) as any;
        if (!parameters[method]) {
            parameters[method] = [];
        }

        let type = Reflect.getOwnMetadata('design:paramtypes', target, method)[index];
        parameters[method].push(new ParamParameter(name, type, index, optional));
    };
}

export class ParamParameter extends StdParameter {

    constructor(public name: any,
                public type: Function,
                public index: Number,
                public optional?: boolean) {
        super(name, type, index);

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