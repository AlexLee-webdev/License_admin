var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const session = require('express-session')

require('./models');

const db = require("./models");
db.mongoose.connect(db.url, db.options)
    .then(() => {
        console.log("\x1b[31m Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

var licenseRouter = require('./routes/license')

var app = express();

const corsOptions = {
    origin: true,
    credentials: true
}

const loggingMiddleware = (req, res, next) => {
  console.log('middle: ', req);
  next();
}

app.use(cors(corsOptions));

app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: "hamletshu",
        cookie: {
            httpOnly: true,
            secure: false
        }
    })
)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/auth', authRouter);

app.use('/license', licenseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;