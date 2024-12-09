const express = require("express");

const { cardsGetRouter } = require("./cardsGetRouter");
const { cardCreateRouter } = require("./cardCreateRouter");

const router = express.Router();

router.use(cardsGetRouter);
router.use(cardCreateRouter);

// router.use(postUpdateRouter);

module.exports = { cardsRouter: router };
