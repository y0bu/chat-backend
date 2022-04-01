import express from "express";
const router = express.Router();
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

router.post("/signin", async (request, response, next) => {
    const existingUser = await User.findOne({ username: request.body.username });

    if (!existingUser)
        return response.status(400).send("either username or password are incorrect.");

    if (!existingUser.comparePasswords(request.body.password))
        return response.status(400).send("either username or password are incorrect.");

    const token = jwt.sign({ id: existingUser._id }, process.env.KEY, { expiresIn: "1d" });
    return response.status(201).send(token);
});

router.post("/signup", async (request, response, next) => {
    const isUsernameExist = await User.findOne({ username: request.body.username });
    
    if (isUsernameExist) return response.status(400).send("username already exists");

    const isPasswordStrong = passwordChecker(request.body.password);
    if (isPasswordStrong !== true) return response.status(400).send(isPasswordStrong);

    const user = new User(request.body);
    user.save();

    response.status(201).send("OK");
});

const passwordChecker = (password) => {
    if (password.length < 8 || password.length > 200) return "Password is either too long or too short.";
    let upper = 0;
    let lower = 0;
    let digit = 0;
    let symbo = 0;
    [...password].forEach(l => {
        if ("A" <= l && "Z" >= l) upper++;
        else if ("a" <= l && "z" >= l) lower++;
        else if ("0" <= l && "9" >= l) digit++;
        else symbo++;
    });
    if (upper < 2) return "Password must have atleast two uppercase characters.";
    else if (lower < 2) return "Password must have atleast two lowercase characters.";
    else if (digit < 2) return "Password must have atleast two digits.";
    else if (symbo < 1) return "Password must have atleast one symbol.";
    else return true;
}

export default router;
