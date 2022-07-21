"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = exports.verifyPass = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const user_1 = require("./models/user");
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('week-9-node-task-sq011-poda-leslie-bund:server');
const secretKey = process.env.JWT_SECRET_KEY;
async function hashPassword(pass) {
    return await bcrypt_1.default.hash(pass, 10);
}
exports.hashPassword = hashPassword;
async function verifyPass(pass, encrypted) {
    return await bcrypt_1.default.compare(pass, encrypted);
}
exports.verifyPass = verifyPass;
async function authenticate({ _id, fullname }) {
    const token = jsonwebtoken_1.default.sign({
        _id,
        fullname,
        time: Date()
    }, secretKey, { expiresIn: 300 });
    return token;
}
exports.authenticate = authenticate;
async function authorize(req, res, next) {
    const token = req.cookies.authorization;
    try {
        if (secretKey) {
            const payload = jsonwebtoken_1.default.verify(token, secretKey);
            const confirmUser = await user_1.userData.findOne(JSON.parse(JSON.stringify(payload))).exec();
            if (confirmUser) {
                res.locals.user = confirmUser;
                if (req.cookies.msg) {
                    res.locals.message = req.cookies.msg;
                    res.clearCookie('msg');
                }
                next();
            }
            else {
                next((0, http_errors_1.default)(401));
                return;
            }
        }
        else {
            throw new Error('Try again Later');
        }
    }
    catch (error) {
        debug(error);
        next(error);
        return;
    }
    return;
}
exports.authorize = authorize;
