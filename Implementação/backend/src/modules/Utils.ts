import { UsersProperties } from "../views/UsersView";
import { RequestException } from '../views/RequestExceptionView';

const viewProperties: any = {
    Users: UsersProperties(),
}

export function filterObject(viewName: string, receivedProperties: any) {
    const view = viewProperties[viewName];
    let params = receivedProperties;

    if (!view) {
        throw { status: 404, message: "Rota não existe" } as RequestException;
    }

    const possibleParams = [...view.required, ...view.optional];
    for (const key in receivedProperties) {
        if (!possibleParams.includes(key)) {
            delete params[key];
        }
    }

    return params;
}

export function verifyIntegrity(viewName: string, receivedProperties: any): boolean {
    const view = viewProperties[viewName];

    if (!view) {
        return false;
    }

    let requiredCounter = 0;
    let optionalCounter = 0;
    for (const key in receivedProperties) {
        if (view.required.indexOf(key) > -1) {
            requiredCounter++;
            continue;
        }

        if (view.optional.indexOf(key) > -1) {
            optionalCounter++;
        }
    }

    if (
        requiredCounter !== view.required.length ||
        (requiredCounter + optionalCounter) !== Object.keys(receivedProperties).length
    ) {
        return false;
    }

    return true;
}

export function escape(string: any): string {
    if (typeof string !== "string") {
        return string;
    }
    string = string.replace('"', '\\"');
    string = string.replace("\'", "\\'");
    string = string.replace('`', '\\`');
    return string;
}
