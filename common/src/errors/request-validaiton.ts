import { CustomError } from "./custom-error";
import { ValidationError } from "express-validator";

export class RequestValidationError extends CustomError {
    statusCode = 401;
    constructor(public errors: ValidationError[]) { // Keep as ValidationError[]
        super('Invalid request');
    }

    generateErrors(): { message: string; field?: string; }[] {
        return this.errors.map(err => {
            // Type guard for FieldValidationError
            if ('path' in err) {
                return { message: err.msg, field: err.path };
            }
            return { message: err.msg, field: undefined };
        });
    }
}