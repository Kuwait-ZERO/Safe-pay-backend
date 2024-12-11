const jwt = require("jsonwebtoken");
const { model, Schema } = require("mongoose");

const PasswordManager = require("../helpers/passwordManager");
const transaction = require("./transaction");

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 1000 },

  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
  transaction: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

UserSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

module.exports = model("User", UserSchema);
