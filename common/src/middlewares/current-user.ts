import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global{
    interface JWTPayload{
        email:string;
        password:string
    }
    namespace Express{
        interface Request{
            currentUser? : JWTPayload
        }
    }
}


export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    if(!req.session?.jwt){
        return next();
    }
    const payload = jwt.verify(req.session?.jwt, process.env.JWT_KEY!) as JWTPayload;
    req.currentUser = payload
    next()
}