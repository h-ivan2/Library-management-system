const express = require("express");
const router = express.Router();
const Book = require("../models/books");
const User = require("../models/User");
const Borrow = require("../models/borrow");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

router.get("/dashboard", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.countDocuments({ available: true });
    const borrowedBooks = await Book.countDocuments({ available: false });
    const totalUsers = await User.countDocuments();
    const activeBorrows = await Borrow.countDocuments({ returned_at: null });
    
    // Get most borrowed books
    const mostBorrowed = await Borrow.aggregate([
      { $group: { _id: "$bookId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
      { $unwind: "$book" }
    ]);
    
    res.json({
      totalBooks,
      availableBooks,
      borrowedBooks,
      totalUsers,
      activeBorrows,
      mostBorrowed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;