"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.loginUser = exports.signUpUser = void 0;
const user_1 = require("../models/user");
const utils_1 = require("../utils");
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('week-9-node-task-sq011-poda-leslie-bund:server');
async function signUpUser(req, res, next) {
    try {
        const { error, value } = await (0, user_1.validateUserSignUp)(req.body);
        if (error)
            throw new Error('Please provide valid details');
        const { confirm_password } = value, safeUser = __rest(value, ["confirm_password"]);
        safeUser.password = await (0, utils_1.hashPassword)(safeUser.password);
        const user = await user_1.userData.create(safeUser);
        const _a = user.toJSON(), { password } = _a, info = __rest(_a, ["password"]);
        const token = await (0, utils_1.authenticate)(JSON.parse(JSON.stringify(info)));
        res.cookie('authorization', token, { httpOnly: true });
        // Send User to dashboard
        res.status(200).json({ status: "ok", data: info, page: 'recipes' });
        return;
    }
    catch (error) {
        // 
        debug('Signup Validation Error: ', error);
        next(error);
    }
}
exports.signUpUser = signUpUser;
async function loginUser(req, res, next) {
    try {
        const { error, value } = await (0, user_1.validateUserLogin)(req.body);
        if (error)
            throw new Error('Please provide valid details');
        const userFromDb = await user_1.userData.findOne({ email: value.email })
            .lean()
            .exec();
        if (!userFromDb) {
            throw new Error('Email is wrong, Please check again');
        }
        const match = await (0, utils_1.verifyPass)(value.password, userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb.password);
        if (!match) {
            throw new Error('Password invalid');
        }
        const _a = JSON.parse(JSON.stringify(userFromDb)), { password } = _a, info = __rest(_a, ["password"]);
        const token = await (0, utils_1.authenticate)(info);
        res.cookie('authorization', token, { httpOnly: true });
        // Send User to dashboard
        res.status(200).json({ status: "ok", data: info, page: 'recipes' });
        return;
    }
    catch (error) {
        debug('Login Validation Error: ', error);
        next(error);
    }
}
exports.loginUser = loginUser;
async function logout(req, res) {
    res.clearCookie('authorization');
    res.status(200).send('User Logged out');
    return;
}
exports.logout = logout;
