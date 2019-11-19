const express = require ('express');
const app = express();
// giving the message to the terminal from where we get the request
const morgan = require( 'morgan' );

// routes
const postRoutes = require ('./routes/post');

// middleware
app.use(morgan('dev'));
app.use('/', postRoutes);

const port = 8080;
app.listen(port, () => console.log(`A Node Js API is listening on port :  ${port}`));