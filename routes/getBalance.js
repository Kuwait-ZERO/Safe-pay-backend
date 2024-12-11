const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { requireAuth } = require("../middleware");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's balance
    res.status(200).json({
      message: "User balance retrieved successfully",
      balance: user.balance,
    });
  } catch (error) {
    console.error("Error fetching balance:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { balanceRouter: router };
