import {WebServer} from "../../WebServer";
import {setBaseUrl} from "../../common/Route";

export function Controller(baseUrl?: string): ClassDecorator {
    return (target: Function) => {
        if (baseUrl) {
            setBaseUrl(target.prototype, baseUrl);
        }

        WebServer.controllers.push(target);
    }
}