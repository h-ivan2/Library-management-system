const Borrow = require("../models/borrow");
const Book = require("../models/books");


const borrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({
        message: "userId and bookId are required"
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.available) {
      return res.status(400).json({ message: "Book already borrowed" });
    }

    await Borrow.create({ userId, bookId });
    await Book.findByIdAndUpdate(bookId, { available: false });

    res.json({ message: "Book borrowed successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const returnBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({
        message: "userId and bookId are required"
      });
    }

    const result = await Borrow.findOneAndUpdate(
      { userId, bookId, returned_at: null },
      { returned_at: new Date() },
      {returnDocument:'after'}
    );

    if (!result) {
      return res.status(400).json({ message: "No borrowed record found" });
    }

    await Book.findByIdAndUpdate(bookId, { available: true });

    res.json({ message: "Book returned successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  borrowBook,
  returnBook
};


