"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipeData = exports.validateRecipe = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const recipeSchema = new mongoose_1.default.Schema({
    title: String,
    meal_type: {
        type: String,
        enum: ['breakfast', 'lunch', 'supper', 'snack'],
        required: true
    },
    difficulty_level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    ingredients: [{
            name: String,
            price: String
        }],
    preparation: String,
    creator: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });
async function validateRecipe(recipe) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        meal_type: joi_1.default.string().valid('breakfast', 'lunch', 'supper', 'snack').required(),
        difficulty_level: joi_1.default.string().valid('Beginner', 'Intermediate', 'Advanced').required(),
        ingredients: joi_1.default.array().items(joi_1.default.object({
            name: joi_1.default.string().required(),
            price: joi_1.default.string().required()
        })),
        preparation: joi_1.default.string().required()
    });
    return schema.validate(recipe);
}
exports.validateRecipe = validateRecipe;
exports.recipeData = mongoose_1.default.model('recipe', recipeSchema);
