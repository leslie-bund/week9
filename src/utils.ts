import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { userData } from './models/user';
import Debug from 'debug';
const debug = Debug('week-9-node-task-sq011-poda-leslie-bund:server');

const secretKey = process.env.JWT_SECRET_KEY;

export async function hashPassword (pass: string) {
    return await bcrypt.hash(pass, 10);
}

export async function verifyPass (pass: string, encrypted: string) {
    return await bcrypt.compare(pass, encrypted);
}

export async function authenticate ({ _id, fullname }: {[k: string]: string}) {
    const token = jwt.sign({
        _id, 
        fullname,
        time: Date()
    }, <string>secretKey, { expiresIn: 300 })
    return token;
}

export async function authorize (req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.authorization;
    try {
        if(secretKey) {
            const payload = jwt.verify(token, secretKey);
            const confirmUser = await userData.findOne(JSON.parse(JSON.stringify(payload))).exec();
            if(confirmUser) {
                res.locals.user = confirmUser;
                if(req.cookies.msg) {
                    res.locals.message = req.cookies.msg;
                    res.clearCookie('msg');
                }
                next();
            } else {
                next(createError(401))
                return;
            }
        } else {
            throw new Error('Try again Later');
        }
    } catch (error) {
        debug(error);
        next(error);
        return;
    }
    return;
}