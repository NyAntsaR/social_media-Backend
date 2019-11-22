const express = require ('express');
const app = express();
// giving the message to the terminal from where we get the request
const morgan = require( 'morgan' );
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');

//db connection
mongoose.connect(
    process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true}
).then(() => console.log('DB Connected'))

// db error
mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
});

// routes
const postRoutes = require ('./routes/post');

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/', postRoutes);

const port = 8080;
app.listen(port, () => console.log(`A Node Js API is listening on port :  ${port}`));