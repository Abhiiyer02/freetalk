import {Router, Request, Response, NextFunction} from "express";
import User from "../../models/user";

const router = Router();
router.post('/signin', async(req:Request, res:Response, next:NextFunction)=>{
    const {email,password} = req.body;

    
})