import {Router, Request, Response, NextFunction} from "express";
import Post from "../../models/post";
import { BadRequestError,InternalServerError } from "../../../common";
import User from "../../models/user";

const router = Router();    

router.delete('/api/post/delete/:id', async(req:Request, res:Response, next:NextFunction)=>{
    const  { id } = req.params
    if(!id){
        return next(new BadRequestError('Id is required'));
    }
    try{
        await Post.findOneAndDelete({ _id: id });
        await User.findOneAndUpdate({ _id: req.currentUser!.userId }, { $pull: { posts: id } });
        res.status(200).json({message: `Post ${id} deleted successfully`});
    }catch(error){
        return next(new InternalServerError(`Post ${id} could not be deleted`))
    }
})

export {router as deletePostRouter}