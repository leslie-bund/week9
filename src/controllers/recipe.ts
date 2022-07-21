import { recipeData, validateRecipe } from "../models/recipe";
import { NextFunction, Request, Response } from "express";
import Debug from 'debug';
const debug = Debug('week-9-node-task-sq011-poda-leslie-bund:server');

export async function getAllRecipes(req: Request, res: Response, next: NextFunction) {
    const pageSize = 5;
    const pageNum = req.query;
    debug(pageNum);
}

export async function addNewRecipe(req: Request, res: Response, next: NextFunction) {

    try {
        req.body.ingredients = req.body.ingredients.map((element: string) => JSON.parse(element));
        delete req.body['']; // Remove redundant field
        const { error, value } = await validateRecipe(req.body)
        if(error) 
            throw new Error('Invalid Recipe Data');
        const newRecipe = await recipeData.create({ ...value, creator: res.locals.user._id});
        res.status(200).json({ status: 'ok', data: newRecipe.toJSON(), page: 'add-recipes' })
    } catch (error) {
        debug('Add Recipe err: ', error);
        next(error)
    }
}