import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    firstname: {
        type: String,
        default: null
    },
    firstname: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    token: {
        type: String,
    }
})

const User = mongoose.model('User', userSchema)

export default User;