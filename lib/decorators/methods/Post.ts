import {HttpRoute, MiddlewareFunction} from "../../common/HttpRoute";
import {HttpMethod} from "../../common/HttpMethod";
import {getRoutes} from "../../common/Route";

export function Post<Function>(route?: string, middlewares?: [MiddlewareFunction]): MethodDecorator {
    return (target: Function, method: string, descriptor: TypedPropertyDescriptor<any>) => {
        let routes = getRoutes(target);
        routes[method] = new HttpRoute(null, method, route, HttpMethod.post, descriptor.value, middlewares);
    };
}