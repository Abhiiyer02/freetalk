import {Router, Request, Response, NextFunction} from "express";
import Comment  from "../../models/comment";
import Post from "../../models/post";
import { BadRequestError, NotFoundError,InternalServerError } from "../../../common";

const router = Router();    

router.post('/api/comment/show', async(req:Request, res:Response, next:NextFunction)=>{
    const  { postId,commentId } = req.body
    if(!postId ){
        const err = new Error('Post ID is required') as CustomError;
        err.statusCode = 400;
        return next(new BadRequestError ('Post ID is required'));
    }
    if(commentId){
        try{
            const comment = await Comment.findOne({ _id: commentId });
            if(!comment){
                const err = new Error(`Comment with id ${commentId} not found`) as CustomError;
                err.statusCode = 404;
                return next(new NotFoundError(`Comment with id ${commentId} not found`));
            }
            res.status(200).json(comment);
        }catch(error){
            return next(new InternalServerError(`Could not fetch comment : ${error}`));
        }
    }else{
        try{
            const comments = await Comment.find({});
            res.status(200).json(comments);
        }catch(error){
            return next(new InternalServerError(`Could not fetch comments : ${error}`));
        }
    }
})

export {router as showCommentsRouter}