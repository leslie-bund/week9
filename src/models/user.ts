import mongoose, { mongo } from "mongoose";
import Joi from 'joi';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    }, 
    recipes: {
        type: Number,
        default: 0
    }
}, { timestamps: true })


export async function validateUserSignUp(user: userSignUp) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('[a-zA-Z0-9]{3,30}$')).required(),
        confirm_password: Joi.ref('password'),
        fullname: Joi.string().required()
    })
    return schema.validate(user)
}


export async function validateUserLogin(user: userLogin) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('[a-zA-Z0-9]{3,30}$')).required()
    })
    return schema.validate(user)
}
export const userData = mongoose.model('user', userSchema);