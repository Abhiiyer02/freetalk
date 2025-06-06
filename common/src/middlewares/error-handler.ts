import {Request,Response,NextFunction} from "express";
import { CustomError } from "../errors/custom-error";


export const errorHandler = (err:Error, req:Request, res:Response, next:NextFunction)=>{
    if(err instanceof CustomError){
        res.status(err.statusCode).json({message: err.generateErrors()});
    }
    res.status(500).json({message: 'Something went wrong'})
}