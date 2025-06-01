import Post from "../../models/post";
import { BadRequestError, InternalServerError } from "../../../common";
import { Request, Response,NextFunction, Router } from "express";

const router = Router();

router.post('/post/:id/delete-images', async(req:Request, res:Response, next:NextFunction)=>{
    const { imageIds } = req.body;
    const {id } = req.params;
    
    if(!id){
        return next(new BadRequestError('Id is required'));
    }
    if(!imageIds){
        return next(new BadRequestError('Images are required'));
    }
    try{
        await Post.findOneAndUpdate({_id:id},{$pull:{images:{$in:imageIds}}});
    }catch(error){
        return next(new InternalServerError(`images could not be deleted`))
    }   
})


export {router as deleteImagesRouter}