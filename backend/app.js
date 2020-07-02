const express = require('express'); 
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const { use } = require('passport');
const { Socket } = require('dgram');

const app = express();



// cors middleware
app.use(cors()); 
app.use(express.json());

// Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI; 

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( () => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false}));

// Express Session
app.use(session({
    secret: 'secret', 
    resave: true,
    saveUninitialized: true,
}));

// Static content
app.use( express.static( __dirname + "/public" ) );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

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
app.use('/products', require('./routes/products'));
app.use('/vendor', require('./routes/vendor'));
app.use('/admin', require('./routes/admin'));
app.use('/chat', require('./routes/chat'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
