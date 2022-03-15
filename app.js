import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import users from "./routes/users.js";
import messages from "./routes/messages.js";
import parser from "body-parser";

// comment one of them and uncomment the other if you want to either test this api or run it regularly.
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true});
// mongoose.connect(process.env.DB_CONNECTION_TESTING, {useNewUrlParser: true});

const app = express();

app.use(parser.json());
app.use("/api/v1/users", users);
app.use("/api/v1/messages", messages);

if (process.env.NODE_ENV !== 'test') {
    app.listen(3000);
}

export default app;

// make true relation between users and messages
// reformat the codebase, if needed 
// deleting messages
// create frontend with reactjs
// all messages are getting deleted every day(24h)
// add one on one
// add rooms
