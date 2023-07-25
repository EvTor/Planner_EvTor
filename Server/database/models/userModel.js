import mongoose from 'mongoose';
const { Schema } = mongoose;
const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            maxLength: 50
        },
        password: {
            type: String,
            required: true,
            maxLength: 100
        },
        firstName: {
            type: String,
            required: true,
            maxLength: 25
        },
        lastName: {
            type: String,
            required: true,
            maxLength: 25
        },
        role: {
            type: String,
            ref: 'Role',
            required: true

        },
        isActivated:{
            type:Boolean,
            default:false
        },
        activationLink:{
            type:String
        },
        dateAdded: {
            type: Date,
            default: Date.now
        }

    }
)

const User = mongoose.model('User', userSchema);

export default User;