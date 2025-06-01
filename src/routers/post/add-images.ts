import Post from "../../models/post";
import { BadRequestError, InternalServerError } from "../../../common";
import { Request, Response,NextFunction, Router } from "express";
import fs from "fs";
import path from "path"

const router = Router();

router.post('/post/:id/add-images', async(req:Request, res:Response, next:NextFunction)=>{
    // const { imageIds } = req.body;
    const {id } = req.params;
    
    if(!id){
        return next(new BadRequestError('Id is required'));
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
    try{
        await Post.findOneAndUpdate(
            {_id:id},
            {$push:{images: {$each:images.map((image: Express.Multer.File)  => {
                let srcObject = {src: `data:${image.filename};base64,${image.buffer.toString('base64')}`}
                fs.unlink(path.join('upload/'+image.filename), (err) => {return next(new InternalServerError(`Image deletion failed : ${err}`))});
                return srcObject
            })}}
        });
    }catch(error){
        return next(new InternalServerError(`images could not be deleted`))
    }   
})

export {router as addImagesRouter}