let router = require('express').Router();

const { AddCar , GetCars} = require("../controllers/apiController.js");

//add token check
const { AuthenticateUserToken } = require("../middleware/auth.js");
router.use(AuthenticateUserToken);

router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to CarBooker crafted with love!'
    });
});

router.get('/cars',GetCars);
router.post('/cars',AddCar);

// Export API routes
module.exports = router;

