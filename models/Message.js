import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: String,
        required: true
    }
});

const model = mongoose.model("Messages", MessageSchema);

export default model;
