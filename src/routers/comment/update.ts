import {Router, Request, Response, NextFunction} from "express";
import Comment  from "../../models/comment";
import Post from "../../models/post";
import { BadRequestError,InternalServerError } from "../../../common";

const router = Router();    

router.post('/api/comment/:commentId/update/:postId', async(req:Request, res:Response, next:NextFunction)=>{
    const  { postId,commentId } = req.params
    const { content } = req.body
    if(!postId || !commentId ){
        return next(new BadRequestError('Post ID and Comment ID are required'));
    }
    if(!content){
        return next(new BadRequestError('Content must be provided'));
    }
    try{
        const updatedComment = await Comment.findOneAndUpdate({ _id: commentId },{$set: {content}}, {new: true});
        if(updatedComment){
            await Post.findOneAndUpdate({_id: postId}, { $pull: { comments:commentId } , $push: { comments: updatedComment._id } });
            res.status(200).json({message: `Comment ${commentId} updated successfully from post ${postId}`});
        }else{
            return next(new InternalServerError(`Comment ${commentId} could not be updated`))
        }
        
    }catch(error){
        return next(new InternalServerError(`Comment ${commentId} could not be updated`))
    }
})

export {router as updatedCommentRouter}