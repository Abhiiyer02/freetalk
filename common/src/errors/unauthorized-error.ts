import { CustomError } from "./custom-error";

export class UnauthorizedError extends CustomError{
    statusCode =401;

    constructor(){
        super('Unauthorized');
    }

    generateErrors(){
        return [{message: 'Unauthorized'}]
    }
}