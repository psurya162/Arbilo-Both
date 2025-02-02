const express = require("express");
const router = express.Router();
const {adminLogin,adminSignup,getAllUsers,toggleUserActiveStatus} = require("../controllers/adminController");
const adminAuthMiddleware = require("../middleware/adminMiddleware");

// Admin Registration
router.post("/signup", adminSignup);

// Admin Login
router.post("/login", adminLogin);

router.get("/users", adminAuthMiddleware, getAllUsers);
router.put("/users/:userId/toggle-active", adminAuthMiddleware, toggleUserActiveStatus);

module.exports = router;