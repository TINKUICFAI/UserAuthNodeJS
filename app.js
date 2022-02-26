const express = require("express");
const helmet = require("helmet");
const formData = require("express-form-data");
const os = require("os");
const cors = require("cors");
// const morgan = require("morgan");

//PostMan collection
//https://www.getpostman.com/collections/60e7873f5ca166126830`

const routes = require("./router/routes.js");

const errorHandler = require("./utils/errorHandler.js");

const app = express();

// Set template engine
app.set("view engine", "ejs");

// Config middlewares for api
const options = {
    uploadDir: os.tmpdir(),
    autoClean: true,
};

// parse data with connect-multiparty.
app.use(formData.parse(options));
app.use(cors());
app.use(helmet());
app.use(express.json());
// app.use(formData());
// app.use(morgan("dev"));

// Public static files
app.use(express.static("public"));

// Initiail route for mounting
app.use("/", routes);

// Error handler for whole app
app.use(errorHandler);

module.exports = app;
