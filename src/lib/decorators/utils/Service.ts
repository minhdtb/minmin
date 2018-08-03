export function Service(): Function {
    return (target: any) => {
        Reflect.defineMetadata("custom:service", null, target.prototype);
    }
}