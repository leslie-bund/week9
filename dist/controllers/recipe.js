"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewRecipe = exports.getAllRecipes = void 0;
const recipe_1 = require("../models/recipe");
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('week-9-node-task-sq011-poda-leslie-bund:server');
async function getAllRecipes(req, res, next) {
    const pageSize = 5;
    const pageNum = req.query;
    debug(pageNum);
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
        next(error);
    }
}
exports.addNewRecipe = addNewRecipe;
