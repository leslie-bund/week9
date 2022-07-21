import express, { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { getAllRecipes, addNewRecipe } from '../controllers/recipe';
import Debug from 'debug';
const debug = Debug('week-9-node-task-sq011-poda-leslie-bund:server');

const router = express.Router();

/* GET all recipe */
router.get('/', getAllRecipes);

/* POST new recipe */
router.post('/', addNewRecipe)

/* GET particular recipe */
router.get('/:recipeId', function(req ,res) {
    res.send('Respond with a resource');
})

/* PUT update a recipe */
router.put('/:recipeId', function(req, res) {
    res.send('Respond with a resource');
})

/* DELETE a recipe */
router.delete('/:recipeId', function(req, res) {
    res.send('Respond with a resource');
})


router.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('index', { title: 'Leslie\'s Cook-Book', page: 'recipes' });
    return;
  });

export default router;