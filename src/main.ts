import express from "express";  
import { Request,Response,NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors"
import cookieSession from "cookie-session";
import {
    newPostRouter,
    updatePostRouter,
    showPostRouter,
    deletePostRouter,
    newCommentRouter,
    updatedCommentRouter,
    deleteCommentRouter,
    showCommentsRouter,
    signupRouter,
    signinRouter,
    signoutRouter
} from "./routers"
import { currentUser, errorHandler, NotFoundError } from "../common";
import { requireAuth } from "../common";
// import {json,urlencoded} from "body-parser";
// express version 4.0+

// express comes with build in methods for parsing urls and json data:

// express.urlencoded() && express.json()

// so, Instead of installing body-parser as a separate package, we can just use express

// *the extended: true option will work fine with postman but not with front-end apps*

// so update the urlencoded method with { extended: false }

require("dotenv").config()
const app = express();

// app.use(urlencoded({extended:true}));
// app.use(json());
app.use(cors(
    {
        origin: '*',
        optionsSuccessStatus: 200
    }
))
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(cookieSession({
    signed: false,
    secure: false
}))

app.use((req:Request, res:Response, next:NextFunction)=>{
    console.log(req.path, req.method);
    next();
})

app.use(currentUser);

app.use(signupRouter)
app.use(signinRouter)
app.use(signoutRouter)

app.use(requireAuth, newPostRouter);
app.use(requireAuth,updatePostRouter);
app.use(requireAuth,showPostRouter);
app.use(requireAuth,deletePostRouter);

app.use(requireAuth,newCommentRouter);
app.use(requireAuth,updatedCommentRouter);
app.use(requireAuth,deleteCommentRouter);
app.use(requireAuth,showCommentsRouter);


app.all('*', async(req:Request, res:Response, next: NextFunction)=>{
    throw new NotFoundError();
})

app.use(errorHandler);




declare global {
    interface CustomError extends Error{
        statusCode?:number
    }
}


app.use((error:CustomError, req: Request, res:Response, next:NextFunction)=>{
    if (error.statusCode){
        res.status(error.statusCode).json({ message: error.message});
    }
    res.status(500).json({message: 'Something went wrong'});
    return next(error);
})

const start = async ()=>{
    // if(process.env.MONGO_URI){
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined');
    }
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY must be defined');
    }
        try{
            console.log(console.log('process.env.MONGO_URI'));
            await mongoose.connect(process.env.MONGO_URI);   
            console.log('mongodb connected');
            app.listen(process.env.PORT,()=>{
                console.log('listening on the port: ',process.env.PORT);
            }) 
        }catch(err:any){
            throw new Error(err as string);
        }
}

start();

