import express, { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { signUpUser, loginUser, logout } from '../controllers/user'
const router = express.Router();

/* POST user's Sign Up data. */
router.post('/signup', signUpUser);

/* POST user's Login Up data. */
router.post('/login', loginUser);


/* GET user's to Logout. */
router.get('/logout', logout);

router.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('index', { title: 'Leslie\'s Cook-Book', page: 'access' });
  return;
});

export default router;