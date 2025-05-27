import {Router, Request, Response, NextFunction} from "express";
import Comment  from "../../models/comment";
import Post from "../../models/post";

const router = Router();    

router.post('/api/comment/show', async(req:Request, res:Response, next:NextFunction)=>{
    const  { postId,commentId } = req.body
    if(!postId ){
        const err = new Error('Post ID is required') as CustomError;
        err.statusCode = 400;
        return next(err);
    }
    if(commentId){
        try{
            const comment = await Comment.findOne({ _id: commentId });
            if(!comment){
                const err = new Error(`Comment with id ${commentId} not found`) as CustomError;
                err.statusCode = 404;
                return next(err);
            }
            res.status(200).json(comment);
        }catch(error){
            const err = new Error(`Could not fetch comment : ${error}`) as CustomError;
            err.statusCode = 500;
            return next(err);
        }
    }else{
        try{
            const comments = await Comment.find({});
            res.status(200).json(comments);
        }catch(error){
            const err = new Error(`Could not fetch comments : ${error}`) as CustomError;
            err.statusCode = 500;
            return next(err);
        }
    }
})

export {router as showCommentsRouter}