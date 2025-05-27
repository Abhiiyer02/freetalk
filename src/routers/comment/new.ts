import { Request, Response, NextFunction } from "express";
import express  from "express";
import Comment from "../../models/comment";
import Post from "../../models/post";

const router = express.Router();

router.post('/api/comment/new/:postId', async (req: Request, res: Response, next: NextFunction) => {
    console.log('Creating a new comment');
    const { postId } = req.params;
    const { userName, content } = req.body;
    if(!content){
        const err = new Error('Content must be provided') as CustomError;
        err.statusCode = 400;
        return next(err);
    }

    const newComment = new Comment({
        userName: userName? userName : 'anonymous',
        content
    })

    try{
        await newComment.save();
        res.status(201).send(newComment);
        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId },
            { $push: { comments: newComment._id } },
            { new: true }
        )
        res.status(201).send(updatedPost);
    }catch(error){
        const err = new Error(`Comment creation failed : ${error}`) as CustomError;
        err.statusCode = 500;
        return next(err);
    }
    
})

export { router as newCommentRouter }