import { app } from "./app";
import mongoose from "mongoose";

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

