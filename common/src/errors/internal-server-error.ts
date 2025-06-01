import { CustomError } from "./custom-error";

export class InternalServerError extends CustomError{
    statusCode = 500
    
    constructor(message?:string){
        super(`internal server error ${message}`)
    }

    generateErrors(){
        return [{message: this.message? `Internal Server Error: ${this.message}`: 'Internal Server Error'}]
    }
}