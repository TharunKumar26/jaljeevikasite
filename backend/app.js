const express = require('express'); 
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path')

const app = express();

// Passport config
require('./config/passport')(passport);


// DB Config
const db = require('./config/keys').mongoURI; 

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true } )
    .then( () => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Bodyparser
app.use(express.urlencoded({ extended: false}));

// Express Session
app.use(session({
    secret: 'secret', 
    cookie :{
        expires : false,
        
    },
    resave: true,
    saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

app.use('/static', express.static(path.join(__dirname, 'public')))

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/vendor', require('./routes/vendor'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));