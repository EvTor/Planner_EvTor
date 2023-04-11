import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            maxLength: 100
        },
        password: {
            type: String,
            required: true,
            maxLength: 100
        },
        firstName: {
            type: String,
            required: true,
            maxLength: 100
        },
        lastName: {
            type: String,
            required: true,
            maxLength: 100
        },
        role: [{
            type: String,
            ref: 'Role',
            required: true

        }],
        dateAdded: {
            type: Date,
            default: Date.now
        }

    }
)

const User = mongoose.model('User', userSchema);

export default User;