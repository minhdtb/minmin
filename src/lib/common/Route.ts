import {HttpMethod} from "./HttpMethod";
import {getParameters, IParameter} from "./Parameter";
import * as _ from "lodash";
import {ParamParameter} from "../decorators/parameters/Param";

export interface Route {
    id: string,
    name: string,
    url: string,
    method: HttpMethod,
    callback: Function
}

export function getRoutes(target: Object): {} {
    if (!Reflect.hasOwnMetadata('custom:routes', target)) {
        Reflect.defineMetadata('custom:routes', {}, target);
    }

    return Reflect.getOwnMetadata('custom:routes', target);
}

export function getBaseUrl(target: Object): string {
    return Reflect.getOwnMetadata('custom:baseUrl', target);
}

export function setBaseUrl(target: Object, baseUrl: string) {
    Reflect.defineMetadata('custom:baseUrl', baseUrl, target);
}

export function buildUrl(target: Object, method: string, url: string, root?: string): string {
    function nomalizeUrl(url: string): string {
        if (url)
            return url.startsWith('/') ? url : '/' + url;

        return '';
    }

    let parameters = getParameters(target) as any;
    let rootUrl = root ? nomalizeUrl(root) : null;
    let baseUrl = nomalizeUrl(rootUrl ? rootUrl + '/' + getBaseUrl(target) : getBaseUrl(target)) || '/';
    let returnUrl = (baseUrl.length === 1 && url ? nomalizeUrl(url) : baseUrl + nomalizeUrl(url));

    let params: IParameter[] = parameters[method] || [];

    _.each(_.sortBy(params, p => p.index), parameter => {
        if (parameter instanceof ParamParameter) {
            returnUrl += ('/:' + parameter.name);
        }
    });

    return returnUrl;
}