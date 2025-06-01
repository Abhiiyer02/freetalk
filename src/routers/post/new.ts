import { Request, Response, NextFunction } from "express";
import express  from "express";
import Post from "../../models/post";
import { BadRequestError, InternalServerError } from "../../../common";

const router = express.Router();

router.post('/api/post/new', async (req: Request, res: Response, next: NextFunction) => {
    console.log('Creating a new post');
    const { title, content } = req.body;
    if(!title || !content){
        return next(new BadRequestError('Title and content must be provided'));
    }

    const newPost = new Post({
        title,
        content
    })

    try{
        await newPost.save();
        res.status(201).send(newPost);
    }catch(error){
        return next(new InternalServerError(`Post creation failed : ${error}`));
    }
    
})

export { router as newPostRouter }