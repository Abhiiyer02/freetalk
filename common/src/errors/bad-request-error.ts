import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError{
    statusCode = 400;

    constructor(message:string){
        super(message);
    }

    generateErrors(): { message: string; field?: string; }[] {
        return [{ message: this.message }]
    }
}