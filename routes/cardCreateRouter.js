const express = require("express");
const { body } = require("express-validator");

const Card = require("../model/card");
const User = require("../model/user");

const { requireAuth, validateRequest } = require("../middleware");
const card = require("../model/card");

const router = express.Router();

const validators = [
  body("name").not().isEmpty().withMessage("name is required"),
  // body("cardNumber").not().isEmpty().withMessage("cardNumber is required"),
  // body("cvv").not().isEmpty().withMessage("cvv is required"),
  // body("expiryDate").not().isEmpty().withMessage("expiryDate is required"),
];
// Function to generate Visa-like card number
function generateCardNumber() {
  const firstSix = "411111";
  let remainingTen = "";
  for (let i = 0; i < 10; i++) {
    remainingTen += Math.floor(Math.random() * 10);
  }
  return firstSix + remainingTen;
}

// POST route
router.post("/", requireAuth, validators, validateRequest, async (req, res) => {
  try {
    req.body.cardNumber = generateCardNumber();
    const newCard = await Card.create(req.body);
    res.status(201).json(newCard);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { cardCreateRouter: router };
