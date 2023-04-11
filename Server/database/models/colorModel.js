import mongoose from "mongoose";
const { Schema } = mongoose;

const colorSchema = new Schema({
    value: {
        type: String,
        unique: true,
        default: 'grey'
    }
})

const Color = mongoose.model('Color', colorSchema);
export default Color;
