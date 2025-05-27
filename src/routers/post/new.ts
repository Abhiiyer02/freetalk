import { Request, Response, NextFunction } from "express";
import express  from "express";
import Post from "../../models/post";

const router = express.Router();

router.post('/api/post/new', async (req: Request, res: Response, next: NextFunction) => {
    console.log('Creating a new post');
    const { title, content } = req.body;
    if(!title || !content){
        const err = new Error('Title and content must be provided') as CustomError;
        err.statusCode = 400;
        return next(err);
    }

    const newPost = new Post({
        title,
        content
    })

    try{
        await newPost.save();
        res.status(201).send(newPost);
    }catch(error){
        const err = new Error(`Post creation failed : ${error}`) as CustomError;
        err.statusCode = 500;
        return next(err);
    }
    
})

export { router as newPostRouter }