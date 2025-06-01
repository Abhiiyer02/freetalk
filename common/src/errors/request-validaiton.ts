import { CustomError } from "./custom-error";
import { ValidationError } from "express-validator";

export class RequestValidationError extends CustomError{
    statusCode = 401;
    constructor(public errors:ValidationError[]){
        super('Invalid request');
    }

    generateErrors(): { message: string; field?: string; }[] {
        const errors = this.errors.map(err => ({message: err.msg, field: err.param}));
        return errors
    }
}