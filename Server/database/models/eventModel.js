import mongoose from "mongoose";
const { Schema } = mongoose;

const eventSchema = new Schema({
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
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true,
        default: "New event"
    },
    color: {
        type: String,
        ref: 'Color',
        required: true,
        default: "grey"
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;