const express = require("express");
const Card = require("../model/card");

const router = express.Router();

router.get("/", async (req, res) => {
  const cards = await Card.find();
  res.json(cards);
});

module.exports = { cardsGetRouter: router };
