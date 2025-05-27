import { Request, Response, NextFunction } from "express";
import express  from "express";
import Post from "src/models/post";

const router = express.Router();

router.post('/api/posts/new', async (req: Request, res: Response, next: NextFunction) => {
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

    await newPost.save();

    res.status(201).send(newPost);

})