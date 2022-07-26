import { recipeData, validateRecipe } from "../models/recipe";
import { NextFunction, Request, Response } from "express";
import Debug from 'debug';
const debug = Debug('week-9-node-task-sq011-poda-leslie-bund:server');

export async function getAllRecipes(req: Request, res: Response, next: NextFunction) {
    const pageSize = 5;
    const pageNum = req.query.page || 1;
    if(pageNum) {
        const data = await recipeData.find({ creator: res.locals.user._id }, { creator: 0, ingredients: 0 })
                                .skip((+pageNum - 1) * pageSize)
                                .limit(pageSize).exec();
        const total = await recipeData.find({ creator: res.locals.user._id }).count();
        res.status(201).json({ 
            status: 'ok',
            data: data,
            currentPage: +pageNum,
            count: total
        })
    }
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
    } catch (error: any) {
        debug('Add Recipe err: ', error);
        res.json({ error: error?.message });
    }
}

export async function deleteRecipe(req: Request, res: Response, next: NextFunction) {
    try {
        const deleted = await recipeData.deleteOne({ _id: req.params.recipeId }).exec();
        // debug(deleted);
        if(deleted.acknowledged) {
            res.json({ status: 'deleted'});
            return;
        }
        throw new Error('Could not delete recipe');
    } catch (error) {
        debug('Deletion err: ', error);
        res.json({ error: error });
    }
}

export async function getOneRecipe(req: Request, res: Response, next: NextFunction){
    try {
        const gotten = await recipeData.findOne({ _id: req.params.recipeId }).exec();
        // debug(deleted);
        if(gotten) {
            res.json({ status: 'ok', data: gotten.toJSON(), page: 'upDate-recipes'});
            return;
        }
        throw new Error('Could not delete recipe');
    } catch (error) {
        debug('Deletion err: ', error);
        res.json({ error: error });
    }
}


export async function upDateOneRecipe(req: Request, res: Response, next: NextFunction) {
    try {
        req.body.ingredients = req.body.ingredients.map((element: string) => JSON.parse(element));
        delete req.body['']; // Remove redundant field
        const { error, value } = await validateRecipe(req.body)
        if(error) 
            throw new Error('Invalid Recipe Data');
        const newRecipe = await recipeData.updateOne({ _id: req.params.recipeId },{ ...value, creator: res.locals.user._id});
        if(newRecipe.acknowledged) {
            res.status(200).json({ status: 'ok', data: {}, page: 'add-recipes' })
        }
    } catch (error: any) {
        debug('Update Recipe err: ', error);
        res.json({ error: error?.message });
    }
}