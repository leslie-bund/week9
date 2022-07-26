"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipe_1 = require("../controllers/recipe");
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('week-9-node-task-sq011-poda-leslie-bund:server');
const router = express_1.default.Router();
/* GET all recipe */
router.get('/', recipe_1.getAllRecipes);
/* POST new recipe */
router.post('/', recipe_1.addNewRecipe);
/* GET particular recipe */
router.get('/:recipeId', recipe_1.getOneRecipe);
/* PUT update a recipe */
router.put('/:recipeId', recipe_1.upDateOneRecipe);
/* DELETE a recipe */
router.delete('/:recipeId', recipe_1.deleteRecipe);
router.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('index', { title: 'Leslie\'s Cook-Book', page: 'recipes' });
    return;
});
exports.default = router;
