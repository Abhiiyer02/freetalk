import {Router, Request, Response, NextFunction} from "express";
import Post from "../../models/post";

const router = Router();    

router.delete('/api/post/delete/:id', async(req:Request, res:Response, next:NextFunction)=>{
    const  { id } = req.params
    if(!id){
        const err = new Error('Id is required') as CustomError;
        err.statusCode = 400;
        return next(err);
    }
    try{
        await Post.findOneAndDelete({ _id: id });
        res.status(200).json({message: `Post ${id} deleted successfully`});
    }catch(error){
        const err = new Error(`Delete failed on DB : ${error}`) as CustomError;
        err.statusCode = 500;
        return next(err);
    }
})

export {router as deletePostRouter}