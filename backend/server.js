const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var bodyParser = require('body-parser')



const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
 

app.use(bodyParser.json())

require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors()); // cors middleware
app.use(express.json());

app.use(express.urlencoded({ extended: false }))

app.set('view engine','ejs')

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});


app.get('/',(req,res)=>{


})
const productsRouter = require('./routes/products');

app.use('/products', productsRouter);



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});