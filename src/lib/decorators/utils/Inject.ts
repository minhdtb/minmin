export function Inject(): Function {
    return (target: any, property?: any) => {
        if (!target.hasOwnProperty(property)) {
            Object.defineProperty(target, property, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: null
            });
        }

        Reflect.defineMetadata("custom:inject", null, target, property);
    }
}
