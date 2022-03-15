import express from "express";
const router = express.Router();
import authVer from "../middleware/JWTVerifier.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

router.post("/create", authVer, async (request, response, next) => {
    const user = await User.findById(request.userId);
    const message = new Message({ message: request.body.message, creator: user.username });
    message.save();
    response.status(201).send("OK");
});

router.post("/", authVer, async (request, response, next) => {
    const messages = await Message.find();
    response.status(201).send(messages);
});

router.delete("/delete", authVer, async (request, response, next) => {
    const user = await User.findById(request.userId);
    await Message.findOneAndDelete({$and: [{_id: new mongoose.Types.ObjectId(request.body.id)}, {creator: user.username}]});
    response.status(201).send("OK");
});

export default router;
