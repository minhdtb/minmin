import {Request} from 'express';
import {getParameters} from "../../common/Parameter";
import {StdParameter} from "../../common/StdParameter";

export function Data<Function>(name?: string): ParameterDecorator {
    return (target: Object, method: string, index: number) => {
        let parameters = getParameters(target) as any;
        if (!parameters[method]) {
            parameters[method] = [];
        }

        let type = Reflect.getOwnMetadata('design:paramtypes', target, method)[index];
        parameters[method].push(new DataParameter(name, type, index));
    };
}

export class DataParameter extends StdParameter {

    public getValue(req: Request) {
        return this.getRawValue(this.name ? req.body[this.name] : req.body);
    }
}