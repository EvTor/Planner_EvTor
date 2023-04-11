import mongoose from "mongoose";
const { Schema } = mongoose;

const groupSchema = new Schema({
    user: [
        {
            user_id: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            accepted: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    ],
    title: {
        type: String,
        required: true,
        default: "New group"
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

const Group = mongoose.model('Group', groupSchema);
export default Group;
