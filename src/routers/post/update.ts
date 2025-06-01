import { Router, Request, Response,NextFunction } from "express";
import Post from "../../models/post";
import { BadRequestError, InternalServerError } from "../../../common";


const router = Router();;

router.post('/api/post/update/:id', async(req:Request, res:Response, next:NextFunction)=>{
    console.log('Updating a post');
    const { id } = req.params;
    const { title, content } = req.body;
    if(!id){
        return next(new BadRequestError('Id must be provided'));
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
        return next(new InternalServerError(`Update failed : ${error}`));
    }
    
});


export {router as updatePostRouter}