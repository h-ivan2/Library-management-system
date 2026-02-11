const Book = require("../models/books");

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching books" });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, isbn } = req.body;

    if (!title || !author || !isbn) {
      return res.status(400).json({
        message: "Title, author and ISBN are required"
      });
    }

    const book = await Book.create({ title, author, isbn });

    res.status(201).json({
      message: "Book added successfully",
      book
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding book" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({
      message: "Book deleted successfully",
      book
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting book" });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, available } = req.body;

    const book = await Book.findByIdAndUpdate(
      id,
      { title, author, isbn, available },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({
      message: "Book updated successfully",
      book
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating book" });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  deleteBook,
  updateBook
};


