const express = require("express");
const Card = require("../model/card");
const { requireAuth } = require("../middleware");

const router = express.Router();

// PUT route to set a card's isExpired to true
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const cardId = req.params.id;

    // 1. Find the card by ID
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found." });
    }

    // 2. Ensure the card belongs to the authenticated user
    if (card.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this card." });
    }

    // 3. Update the card's isExpired field to true
    card.isExpired = true;
    await card.save();

    res.status(200).json({
      message: "Card has been marked as expired.",
      card: {
        id: card._id,
        name: card.name,
        cardNumber: card.cardNumber,
        isExpired: card.isExpired,
      },
    });
  } catch (error) {
    console.error("Error expiring card:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { cardDeleteRouter: router };
