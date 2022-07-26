import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config';
import methodOverride from 'method-override';
import Debug from 'debug';
const debug = Debug('week-9-node-task-sq011-poda-leslie-bund:server');


import indexRouter from './routes/index';
import usersRouter from './routes/users';
import recipesRouter from './routes/recipes';
import { authorize } from './utils';

mongoose.connect(<string>process.env.MONGO_URI)
  .then(() => debug('Connected to Database'))
  .catch((err) => debug('Failed to Connect to Database', err));

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Insert validation middleware
app.use(authorize);
app.use('/recipes', recipesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;

