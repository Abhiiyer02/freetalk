import {Router, Request, Response, NextFunction} from "express";
import User from "../../models/user";
import { DatabaseError ,InternalServerError,authenticationService, BadRequestError, NotFoundError } from "../../../common";
import jwt from 'jsonwebtoken';

const router = Router();
router.post('/signin', async(req:Request, res:Response, next:NextFunction)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(user){
            const result = await authenticationService.compare(user?.password,password); 
            if(!result){
                return next(new BadRequestError('Invalid Credentials'));
            }
            const token = jwt.sign({email, userId: user._id}, process.env.JWT_KEY! as string,{expiresIn: '1h'});
            req.session = {jwt: token};
            res.status(201).send(user);
        }else{
            return next(new NotFoundError());
        }
    }catch(error){
        return next(new InternalServerError(`Database Operation failed during auth: ${error}`));
    }
    
})
export {router as signinRouter}