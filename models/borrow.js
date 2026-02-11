const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },
  borrowed_at: {
    type: Date,
    default: Date.now
  },
  returned_at: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("Borrow", borrowSchema);


