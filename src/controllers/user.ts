import { NextFunction, Request, Response } from "express";
import { userData, validateUserSignUp, validateUserLogin } from "../models/user";
import { hashPassword, authenticate, verifyPass } from "../utils";
import Debug from 'debug';
const debug = Debug('week-9-node-task-sq011-poda-leslie-bund:server');


export async function signUpUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { error, value } = await validateUserSignUp(req.body);
        if(error)
            throw new Error('Please provide valid details');
        const { confirm_password, ...safeUser } = value;
        safeUser.password = await hashPassword(safeUser.password);
        const user = await userData.create(safeUser);
        const { password, ...info } = user.toJSON()
        const token = await authenticate(JSON.parse(JSON.stringify(info)));
        res.cookie('authorization', token, { httpOnly: true });
        // Send User to dashboard
        res.status(200).json({status: "ok", data: info, page: 'recipes'});
        return;
    } catch (error: any) {
        // 
        debug('Signup Validation Error: ', error?.message);
        res.json({ error: error?.message });
        // next(error)
    }
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { error, value } = await validateUserLogin(req.body);
        if (error)
            throw new Error('Please provide valid details');
        const userFromDb = await userData.findOne({ email: value.email })
                                .lean()
                                .exec();
        if(!userFromDb) {
            // res.locals.message = 'Email is wrong, Please check again';
            throw new Error('Email is wrong, Please check again');
        }
        const match = await verifyPass(value.password, <string>userFromDb?.password);
        if(!match) {
            throw new Error('Password invalid');
        }
        
        const { password, ...info } = JSON.parse(JSON.stringify(userFromDb));
        const token = await authenticate(info);
        res.cookie('authorization', token, { httpOnly: true });

        // Send User to dashboard
        res.status(200).json({status: "ok", data: info, page: 'recipes'});
        return;
    } catch (error: any) {
        debug('Login Validation Error: ', error?.message);
        res.json({ error: error?.message });
        // next(error);
    }
}

export async function logout (req: Request, res: Response) {
    res.clearCookie('authorization');
    res.status(200).redirect('/');
    return;
}