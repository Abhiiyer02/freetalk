import { Router, Request, Response,NextFunction } from "express";
import Post from "../../models/post";


const router = Router();;

router.post('/api/post/update/:id', async(req:Request, res:Response, next:NextFunction)=>{
    console.log('Updating a post');
    const { id } = req.params;
    const { title, content } = req.body;
    if(!id){
        const err = new Error('Id must be provided') as CustomError;
        err.statusCode = 400;
        return next(err);
    }
    if(!title && !content){
        const err = new Error('Title or content must be provided') as CustomError;
        err.statusCode = 400;
        return next(err);
    }
    try{
        const updatedPost = await Post.findOneAndUpdate(
            {_id:id},
            { $set: {title, content}}, 
            {new: true}
        );
        res.status(201).send(updatedPost);
    }catch(error){
        const err = new Error(`Database updation failed : ${error}`) as CustomError;
        err.statusCode = 500;
        return next(err);
    }
    
});


export {router as updatePostRouter}