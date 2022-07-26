"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userData = exports.validateUserLogin = exports.validateUserSignUp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const userSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
async function validateUserSignUp(user) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().pattern(new RegExp('[a-zA-Z0-9]{3,30}$')).required(),
        confirm_password: joi_1.default.ref('password'),
        fullname: joi_1.default.string().required()
    });
    return schema.validate(user);
}
exports.validateUserSignUp = validateUserSignUp;
async function validateUserLogin(user) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().pattern(new RegExp('[a-zA-Z0-9]{3,30}$')).required()
    });
    return schema.validate(user);
}
exports.validateUserLogin = validateUserLogin;
exports.userData = mongoose_1.default.model('user', userSchema);
