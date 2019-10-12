let router = require('express').Router();

//add token check
const { AuthenticateUserToken } = require("../middleware/auth.js");
router.use(AuthenticateUserToken);

router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to CarBooker crafted with love!'
    });
});

// Export API routes
module.exports = router;

