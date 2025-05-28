import { authenticationService } from "../../common";
import mongoose from "mongoose";


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

const User = mongoose.model('User',userSchema);
export default User