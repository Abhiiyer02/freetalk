import {Router, Request, Response, NextFunction} from "express";
import User from "../../models/user";
import jwt from 'jsonwebtoken';


const router = Router();

router.post('/signup', async(req:Request, res:Response, next:NextFunction)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email})
        if(user){
            const err = new Error('User with this email already exists') as CustomError;
            err.statusCode = 400;
            return next(err);
        }

        const newUser = new User({
            email,
            password
        })

        await newUser.save();
        const token = jwt.sign({email, userId: newUser._id}, process.env.JWT_KEY! as string, {expiresIn: '1h'});
        req.session = {jwt: token};
        res.status(201).send(newUser);
    }catch(error){
        const err = new Error(`Database Operation failed : ${error}`) as CustomError;
        err.statusCode = 500; 
        return next(err);
    }

})
export {router as signupRouter}