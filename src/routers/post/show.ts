import { Router,Request,Response,NextFunction } from "express"; 
import Post from "../../models/post";

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
            const err = new Error(`Database fetch failed : ${error}`) as CustomError;
            err.statusCode = 500; 
            return next(err);
        }
    } else {
        // ID provided - get specific post
        
        const { id } = req.body;
        try {
            console.log(`Fetching post with id ${id}`);
            const post = await Post.findOne({ _id: id });
            if(!post){
                const err = new Error(`Post with id ${id} not found`) as CustomError;
                err.statusCode = 404;
                return next(err);
            }
            res.status(200).send(post);
        } catch (error) {
            const err = new Error(`Database fetch for post with id ${id} failed : ${error}`) as CustomError;
            err.statusCode = 500;
            return next(err);
        }
    }
});

export {router as showPostRouter};