const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require ("cookie-parser");
const expressValidator = require("express-validator");

dotenv.config();

const app = express();

// Database
mongoose
    .connect(
        process.env.MONGO_URI,
        { 
            useNewUrlParser: true ,
            useUnifiedTopology: true 
        }
    )
    .then(() => console.log("DB Connected"));

mongoose.connection.on("error", err => {
    console.log(`DB connection error: ${err.message}`);
});

// bring in routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// apiDocs
app.get('/', (req, res) => {
    fs.readFile("docs/apiDocs.json", (err, data ) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json({
            docs
        })
    });
})

// middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(expressValidator());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
// middleware to handle unauthorized error using express-jwt
app.use(function(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ 
            error: "Unauthorized!" 
        });
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`A Node Js API is listening on port: ${port}`);
});