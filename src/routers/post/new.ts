import { Request, Response, NextFunction, Express } from "express";
import express  from "express";
import Post from "../../models/post";
import { BadRequestError, InternalServerError } from "../../../common";
import User from "../../models/user";
import fs from "fs";
import path from "path"

const router = express.Router();

router.post('/api/post/new', async (req: Request, res: Response, next: NextFunction) => {
    console.log('Creating a new post');
    const { title, content } = req.body;
    if(!title || !content){
        return next(new BadRequestError('Title and content must be provided'));
    }

    if(!req.files){
        return next(new BadRequestError('Image(s) must be provided'));
    }
    let images : Array<Express.Multer.File>
    if(typeof req.files === "object"){  
        images  = Object.values(req.files);
    }else[
        images = req.files? [...req.files] : []
    ]


    const newPost =  Post.build({
        title,
        content,
        images : images.map((image: Express.Multer.File)  => 
        {
            let srcObject = {src: `data:${image.filename};base64,${image.buffer.toString('base64')}`}
            fs.unlink(path.join('upload/'+image.filename), (err) => {return next(new InternalServerError(`Image deletion failed : ${err}`))});
            return srcObject
        }
    )
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