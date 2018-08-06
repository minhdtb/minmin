import 'reflect-metadata';
import {getParameters} from "../../common/Parameter";
import {StdParameter} from "../../common/StdParameter";

export function Request<Function>(name?: string): ParameterDecorator {
    return (target: Function, method: string, index: number) => {
        let parameters = getParameters(target) as any;
        if (!parameters[method]) {
            parameters[method] = [];
        }

        let type = Reflect.getOwnMetadata('design:paramtypes', target, method)[index];
        parameters[method].push(new RequestParameter(name, type, index));
    };
}

export class RequestParameter extends StdParameter {

    public getValue(req: any) {
        return this.getRawValue(this.name ? req[this.name] : req);
    }
}