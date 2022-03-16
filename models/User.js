import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

UserSchema.pre("save", async function preSave(next) {
    this.password = await bcrypt.hashSync(this.password, 12);
    next();
});

UserSchema.methods.comparePasswords = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const model = mongoose.model("Users", UserSchema);

export default model;
