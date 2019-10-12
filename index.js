require("dotenv").config()
let express = require('express')

let app = express();
let mongoose = require("mongoose");
let bodyParser = require("body-parser");

const { AuthenticateUserToken } = require("./middleware/authMiddleware");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true});
var db = mongoose.connection;

var port = process.env.PORT || 8080;

let apiRoutes = require("./routes/api-routes.js")
apiRoutes.use(AuthenticateUserToken);

app.use("/api",apiRoutes);

app.listen(port, function () {
     console.log("Running Server on port " + port);
});