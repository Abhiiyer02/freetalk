import {Router, Request, Response, NextFunction} from "express";
import User from "../../models/user";
import { authenticationService } from "../../../common";
import jwt from 'jsonwebtoken';

const router = Router();
router.post('/signin', async(req:Request, res:Response, next:NextFunction)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(user){
            const result = await authenticationService.compare(user?.password,password); 
            if(!result){
                const err = new Error('Invalid Credentials') as CustomError;
                err.statusCode = 401;
                return next(err);
            }
            const token = jwt.sign({email, userId: user._id}, process.env.JWT_KEY! as string,{expiresIn: '1h'});
            req.session = {jwt: token};
            res.status(200).send(user);
        }else{
            const err = new Error('User  not found') as CustomError;
            err.statusCode = 404;
            return next(err);
        }
    }catch(error){
        const err = new Error(`Database Operation failed during auth: ${error}`) as CustomError;
        err.statusCode = 500; 
        return next(err);
    }
    
})
export {router as signinRouter}