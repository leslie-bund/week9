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


// catch 404 and forward to error handler
// router.use(function(req, res, next) {
//   next(createError(404));
// });

router.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 302);
  res.json({ error: err });
  // res.render('index', { title: 'Leslie\'s Cook-Book', page: 'access' });
  return;
});

export default router;

function createError(arg0: number): any {
  throw new Error('Function not implemented.');
}
