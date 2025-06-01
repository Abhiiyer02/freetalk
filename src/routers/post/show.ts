import { Router,Request,Response,NextFunction } from "express"; 
import Post from "../../models/post";
import { InternalServerError, NotFoundError } from "../../../common";

const router = Router();
router.post('/api/post/show/', async(req: Request, res: Response, next: NextFunction) => {
    console.log('Fetching a post');
    if (!req.body) {
        // No ID provided - get all posts
        try {
            console.log('Fetching all posts');
            const allPosts = await Post.find({});
            res.status(200).send(allPosts);
        } catch (error) {
            return next(new InternalServerError(`Fetch failed : ${error}`));
        }
    } else {
        // ID provided - get specific post
        
        const { id } = req.body;
        try {
            console.log(`Fetching post with id ${id}`);
            const post = await Post.findOne({ _id: id });
            if(!post){
                return next(new NotFoundError(`Post with id ${id} not found`));
            }
            res.status(200).send(post);
        } catch (error) {
            return next(new InternalServerError(`Fetch for post with id ${id} failed : ${error}`));
        }
    }
});

export {router as showPostRouter};