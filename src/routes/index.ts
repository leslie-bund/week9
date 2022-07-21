import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  // Render all non-auth routes.
  res.render('index', { title: 'Leslie\'s Cook-Book', page: 'access' });
});

export default router;