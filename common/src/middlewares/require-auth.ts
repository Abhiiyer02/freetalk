import { Request, Response, NextFunction } from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if(!req.currentUser){
        const err = new Error('Not Authorized') as CustomError;
        err.statusCode = 401;
        return next(err);
    }
    next()
}