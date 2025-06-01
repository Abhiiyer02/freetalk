import { authenticationService } from "../../common";
import mongoose from "mongoose";
import { PostDoc } from "./post";



export interface UserDoc extends mongoose.Document{
    email: string,
    password: string,
    posts?: Array<PostDoc>
}

export interface CreateDto{
    email: string,
    password: string
}

export interface UserModel extends mongoose.Model<UserDoc>{
    build(createDto: CreateDto): UserDoc
}

const userSchema  = new mongoose.Schema({
    email:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
})

userSchema.pre('save',async function(done){
    if(this.isModified('password') || this.isNew){
        const hasedPassword = await authenticationService.pwdToHash(this.password);
        this.set('password',hasedPassword);
    }
    done()
})

userSchema.statics.build = (createDto: CreateDto) => {
    return new User(createDto);
}

const User = mongoose.model<UserDoc,UserModel>('User',userSchema);
export default User