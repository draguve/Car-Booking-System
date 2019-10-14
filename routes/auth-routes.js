
const { Register, Login } = require("../controllers/authController");

let router = require('express').Router();
// Set default API response

router.post("/register", Register);
router.post("/login", Login);

// Export API routes
module.exports = router;