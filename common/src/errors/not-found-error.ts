import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError{
    statusCode = 404

    constructor(message?:string){
        super(`not found : ${message}`);
    }

    generateErrors(){
        return [{message: 'Not Found'}]
    }


}