const express = require("express");
const Card = require("../model/card");
const User = require("../model/user");
const Transaction = require("../model/transaction");
const { requireAuth } = require("../middleware");

const router = express.Router();

// POST route to make a payment using the card
router.post("/pay", requireAuth, async (req, res) => {
  try {
    const { cardNumber, amount, paramName } = req.body;

    // 1. Validate input
    if (!cardNumber || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid cardNumber or amount." });
    }

    // 2. Find the card
    const card = await Card.findOne({ cardNumber }).populate("user");
    if (!card) {
      return res.status(404).json({ error: "Card not found." });
    }

    const user = card.user;

    // 3. Check if the card is expired
    if (card.isExpired) {
      return res
        .status(400)
        .json({ error: "This card is expired and cannot be used." });
    }

    // 4. Check if amount exceeds card limit
    if (amount > card.limit) {
      return res
        .status(400)
        .json({ error: "Transaction amount exceeds card limit." });
    }

    // 5. Check if user has sufficient balance
    if (user.balance < amount) {
      return res.status(400).json({ error: "Insufficient user balance." });
    }

    // 6. Deduct the amount from the user's balance
    user.balance -= amount;
    card.isExpired = true;
    await card.save();

    // 7. Create a new Transaction
    const newTransaction = await Transaction.create({
      name: `${paramName} Transaction is a Payment using card ${card.cardNumber}`,
      amount,
    });

    // 8. Add the transaction to the user's transaction array
    user.transaction.push(newTransaction._id);
    await user.save();

    res.status(200).json({
      message: "Payment successful!",
      transaction: {
        id: newTransaction._id,
        name: newTransaction.name,
        amount: newTransaction.amount,
        remainingBalance: user.balance,
        isExpired: card.isExpired,
      },
    });
  } catch (error) {
    console.error("Error processing payment:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { cardPaymentRouter: router };
