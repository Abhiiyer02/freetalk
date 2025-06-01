import {Router, Request, Response, NextFunction} from "express";
import Comment  from "../../models/comment";
import Post from "../../models/post";
import { InternalServerError,BadRequestError } from "../../../common";

const router = Router();    

router.delete('/api/comment/:commentId/delete/:postId', async(req:Request, res:Response, next:NextFunction)=>{
    const  { postId,commentId } = req.params
    if(!postId || !commentId){
        const err = new Error('Post ID and Comment ID are required') as CustomError;
        err.statusCode = 400;
        return next(new BadRequestError('Post ID and Comment ID are required'));
    }
    try{
        await Comment.findOneAndDelete({ _id: commentId });
        await Post.findOneAndUpdate({_id: postId}, { $pull: { comments:commentId } });
        res.status(200).json({message: `Comment ${commentId} deleted successfully from post ${postId}`});
    }catch(error){
        return next(new InternalServerError(`Delete failed on DB : ${error}`));
    }
})

export {router as deleteCommentRouter}