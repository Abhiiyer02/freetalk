import express from "express";  
import { Request,Response,NextFunction } from "express";
import mongoose from "mongoose";
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
express.urlencoded({extended:false});
express.json();


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
})

const start = async ()=>{
    if(process.env.MONGO_URI){
        try{
            await mongoose.connect(process.env.MONGO_URI);   
            app.listen(process.env.PORT,()=>{
                console.log('listening on the port: ',process.env.PORT);
            }) 
        }catch(err:any){
            throw new Error(err as string);
        }
    }else{
        throw new Error('MONGO_URI is not defined');
    }
}


app.listen(process.env.PORT,()=>{
    console.log('listening on the port: ',process.env.PORT);
})

