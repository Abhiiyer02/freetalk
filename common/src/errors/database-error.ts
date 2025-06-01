import { CustomError } from "./custom-error"

export class DatabaseError extends CustomError{
    statusCode = 501

    constructor(messsage: string){
        super(messsage);
    }

    generateErrors(){
        return [{message: this.message}]
    }
}