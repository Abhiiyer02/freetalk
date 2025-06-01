import {Router, Request, Response, NextFunction} from "express";
import User from "../../models/user";
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from "../../../common";
import { DatabaseError } from "common/src/errors/database-error";
import { body } from "express-validator";
import { validationResult } from "express-validator";

const router = Router();

router.post('/signup', [
        body('email')
            .trim()    
            .not().isEmpty()
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .not().isEmpty()
            .length({min: 4, max: 20})
            .withMessage('Password must be valid')
    ],
    validateRequest,
    async(req:Request, res:Response, next:NextFunction)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new BadRequestError(errors.array()[0].msg));
    }
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email})
        if(user){
            return next(new BadRequestError('User with this email already exists'));
        }

        const newUser = User.build({
            email,
            password
        })

        await newUser.save();
        const token = jwt.sign({email, userId: newUser._id}, process.env.JWT_KEY! as string, {expiresIn: '1h'});
        req.session = {jwt: token};
        res.status(201).send(newUser);
    }catch(error){
        return next(new DatabaseError(`Database Operation failed : ${error}`) );
    }

})
export {router as signupRouter}