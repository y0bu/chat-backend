import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import users from "./routes/users.js";
import messages from "./routes/messages.js";
import parser from "body-parser";

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true});

const app = express();

app.use(parser.json());
app.use("/api/v1/users", users);
app.use("/api/v1/messages", messages);

app.listen(3000);
