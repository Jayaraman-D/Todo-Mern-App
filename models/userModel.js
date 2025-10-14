// userModel.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    name: {
        type: String,
        required: true
    },
    tasks: [
        {
            taskname: { type: String},
            taskdetails: { type: String },
            completed:{type:Boolean, default:false}
        }
    ]

}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User