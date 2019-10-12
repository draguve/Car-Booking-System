
const { Register, Login } = require("../controllers/authController");

let router = require('express').Router();
// Set default API response

router.post("/auth/register", Register);
router.post("/auth/login", Login);

// Export API routes
module.exports = router;