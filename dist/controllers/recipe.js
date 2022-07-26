"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upDateOneRecipe = exports.getOneRecipe = exports.deleteRecipe = exports.addNewRecipe = exports.getAllRecipes = void 0;
const recipe_1 = require("../models/recipe");
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('week-9-node-task-sq011-poda-leslie-bund:server');
async function getAllRecipes(req, res, next) {
    const pageSize = 5;
    const pageNum = req.query.page || 1;
    if (pageNum) {
        const data = await recipe_1.recipeData.find({ creator: res.locals.user._id }, { creator: 0, ingredients: 0 })
            .skip((+pageNum - 1) * pageSize)
            .limit(pageSize).exec();
        const total = await recipe_1.recipeData.find({ creator: res.locals.user._id }).count();
        res.status(201).json({
            status: 'ok',
            data: data,
            currentPage: +pageNum,
            count: total
        });
    }
}
exports.getAllRecipes = getAllRecipes;
async function addNewRecipe(req, res, next) {
    try {
        req.body.ingredients = req.body.ingredients.map((element) => JSON.parse(element));
        delete req.body['']; // Remove redundant field
        const { error, value } = await (0, recipe_1.validateRecipe)(req.body);
        if (error)
            throw new Error('Invalid Recipe Data');
        const newRecipe = await recipe_1.recipeData.create(Object.assign(Object.assign({}, value), { creator: res.locals.user._id }));
        res.status(200).json({ status: 'ok', data: newRecipe.toJSON(), page: 'add-recipes' });
    }
    catch (error) {
        debug('Add Recipe err: ', error);
        res.json({ error: error === null || error === void 0 ? void 0 : error.message });
    }
}
exports.addNewRecipe = addNewRecipe;
async function deleteRecipe(req, res, next) {
    try {
        const deleted = await recipe_1.recipeData.deleteOne({ _id: req.params.recipeId }).exec();
        // debug(deleted);
        if (deleted.acknowledged) {
            res.json({ status: 'deleted' });
            return;
        }
        throw new Error('Could not delete recipe');
    }
    catch (error) {
        debug('Deletion err: ', error);
        res.json({ error: error });
    }
}
exports.deleteRecipe = deleteRecipe;
async function getOneRecipe(req, res, next) {
    try {
        const gotten = await recipe_1.recipeData.findOne({ _id: req.params.recipeId }).exec();
        // debug(deleted);
        if (gotten) {
            res.json({ status: 'ok', data: gotten.toJSON(), page: 'upDate-recipes' });
            return;
        }
        throw new Error('Could not delete recipe');
    }
    catch (error) {
        debug('Deletion err: ', error);
        res.json({ error: error });
    }
}
exports.getOneRecipe = getOneRecipe;
async function upDateOneRecipe(req, res, next) {
    try {
        req.body.ingredients = req.body.ingredients.map((element) => JSON.parse(element));
        delete req.body['']; // Remove redundant field
        const { error, value } = await (0, recipe_1.validateRecipe)(req.body);
        if (error)
            throw new Error('Invalid Recipe Data');
        const newRecipe = await recipe_1.recipeData.updateOne({ _id: req.params.recipeId }, Object.assign(Object.assign({}, value), { creator: res.locals.user._id }));
        if (newRecipe.acknowledged) {
            res.status(200).json({ status: 'ok', data: {}, page: 'add-recipes' });
        }
    }
    catch (error) {
        debug('Update Recipe err: ', error);
        res.json({ error: error === null || error === void 0 ? void 0 : error.message });
    }
}
exports.upDateOneRecipe = upDateOneRecipe;
