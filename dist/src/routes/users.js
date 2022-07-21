"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
/* POST user's Sign Up data. */
router.post('/signup', user_1.signUpUser);
/* POST user's Login Up data. */
router.post('/login', user_1.loginUser);
/* GET user's to Logout. */
router.get('/logout', user_1.logout);
router.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('index', { title: 'Leslie\'s Cook-Book', page: 'access' });
    return;
});
exports.default = router;
