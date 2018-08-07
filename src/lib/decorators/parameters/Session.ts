import 'reflect-metadata';
import {getParameters} from "../../common/Parameter";
import {StdParameter} from "../../common/StdParameter";

/**
 *
 * @deprecated Since version 0.0.34. Use @Request("session") instead.
 */
export function Session<Function>(): ParameterDecorator {
    return (target: Function, method: string, index: number) => {
        let parameters = getParameters(target) as any;
        if (!parameters[method]) {
            parameters[method] = [];
        }

        let type = Reflect.getOwnMetadata('design:paramtypes', target, method)[index];
        parameters[method].push(new SessionParameter('', type, index));
    };
}

export class SessionParameter extends StdParameter {

    public getValue(req: any) {
        return this.getRawValue(req.session);
    }
}