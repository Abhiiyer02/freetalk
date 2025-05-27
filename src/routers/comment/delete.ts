import {Router, Request, Response, NextFunction} from "express";
import Comment  from "../../models/comment";
import Post from "../../models/post";

const router = Router();    

router.delete('/api/comment/:commentId/delete/:postId', async(req:Request, res:Response, next:NextFunction)=>{
    const  { postId,commentId } = req.params
    if(!postId || !commentId){
        const err = new Error('Post ID and Comment ID are required') as CustomError;
        err.statusCode = 400;
        return next(err);
    }
    try{
        await Comment.findOneAndDelete({ _id: commentId });
        await Post.findOneAndUpdate({_id: postId}, { $pull: { comments:commentId } });
        res.status(200).json({message: `Comment ${commentId} deleted successfully from post ${postId}`});
    }catch(error){
        const err = new Error(`Delete failed on DB : ${error}`) as CustomError;
        err.statusCode = 500;
        return next(err);
    }
})

export {router as deleteCommentRouter}