import { Request, Response, NextFunction } from "express";
import express  from "express";
import Post from "../../models/post";
import { BadRequestError, InternalServerError } from "../../../common";
import User from "../../models/user";

const router = express.Router();

router.post('/api/post/new', async (req: Request, res: Response, next: NextFunction) => {
    console.log('Creating a new post');
    const { title, content } = req.body;
    if(!title || !content){
        return next(new BadRequestError('Title and content must be provided'));
    }

    const newPost =  Post.build({
        title,
        content
    })

    await User.findOneAndUpdate(
        { _id: req.currentUser!.userId },
        { $push: { posts: newPost._id } },
    )

    try{
        await newPost.save();
        res.status(201).send(newPost);
    }catch(error){
        return next(new InternalServerError(`Post creation failed : ${error}`));
    }
    
})

export { router as newPostRouter }