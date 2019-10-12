require("dotenv").config()
let express = require('express')

let app = express();
let mongoose = require("mongoose");
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    bodyParser.json()(req, res, err => {
        if (err) {
            return res.sendStatus(400); // Bad request
        }
        next();
    });
});

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true});
var db = mongoose.connection;

var port = process.env.PORT || 8080;

let apiRoutes = require("./routes/api-routes.js");
let authRoutes = require("./routes/auth-routes.js");

app.use("/api",authRoutes);
app.use("/api",apiRoutes);

app.listen(port, function () {
     console.log("Running Server on port " + port);
});