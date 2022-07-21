import mongoose from "mongoose";
import Joi from "joi";

const recipeSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });

export async function validateRecipe(recipe: recipe) {
    const schema = Joi.object({
        title: Joi.string().required(),
        meal_type: Joi.string().valid('breakfast','lunch', 'supper', 'snack').required(),
        difficulty_level: Joi.string().valid('Beginner', 'Intermediate','Advanced').required(),
        ingredients: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                price: Joi.string().required()
            })
        ),
        preparation: Joi.string().required()
    })
    return schema.validate(recipe);
}

export const recipeData = mongoose.model('recipe', recipeSchema);