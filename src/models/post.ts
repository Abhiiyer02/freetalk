import mongoose from "mongoose";
import { CommentDoc } from "./comment";

export interface PostDoc extends mongoose.Document{
    title: string,
    content: string,
    images: Array<{src: string}>
    comments?: Array<CommentDoc>
} 

export interface CreatePostDto{
    title: string,
    content: string,
    images: Array<{src: string}>
}

export interface PostModel extends mongoose.Model<PostDoc>{
    build(createPostDto:CreatePostDto): PostDoc
}


const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content: {
        type : String,
        required: true 
        
    },
    images: {
        src: {
            type: String
        }
    },
    comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

postSchema.statics.build = (createPostDto: CreatePostDto) => {
    return new Post(createPostDto);
}

const Post = mongoose.model<PostDoc,PostModel>('Post',postSchema)
export default Post