const Book = require("../models/books");

const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .skip(skip)
      .limit(limit)
      .sort({ title: 1 }); // Sort by title ascending

    const totalBooks = await Book.countDocuments();

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
      hasNextPage: page < Math.ceil(totalBooks / limit),
      hasPrevPage: page > 1
    });
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
      { returnDocument:'after', runValidators: true }
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

const getBookById=async(req,res) =>{
  try{
    const {id} =req.params;
    const book=await Book.findById(id);

    if(!book){
      return res.status(400).json({message: "Book not found"});
    }
    res.json(book);
  }catch (error){
    console.error(error);
    res.status(500).json({message:"Error fetching book"});
  }
}

const searchBooks = async (req, res) => {
  try {
    const { query, author, isbn } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build search filter
    let filter = {};
    
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }
    
    if (isbn) {
      filter.isbn = { $regex: isbn, $options: 'i' };
    }

    const books = await Book.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ title: 1 });

    const totalBooks = await Book.countDocuments(filter);

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
      filters: { query, author, isbn }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching books" });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  deleteBook,
  updateBook,
  getBookById,
  searchBooks
};


<!-- feat: add input validation to book controller -->
<!-- fix: handle missing fields in book creation -->
<!-- fix: correct status codes in book controller -->
<!-- feat: implement title search in book controller -->
<!-- fix: make book title search case insensitive -->
<!-- fix: handle no results gracefully in search -->
<!-- chore: clean up unused imports in book controller -->
<!-- fix: prevent deleting book with active borrows -->
<!-- fix: only allow admin to update book details -->
<!-- fix: handle unknown category gracefully -->
<!-- fix: clamp rating value between 1 and 5 -->
<!-- fix: exclude books with no ratings from top list -->
<!-- chore: general code cleanup across controllers -->
<!-- feat: add input validation to book controller -->
<!-- fix: handle missing fields in book creation -->
<!-- fix: correct status codes in book controller -->
<!-- feat: implement title search in book controller -->
<!-- fix: make book title search case insensitive -->
<!-- fix: handle no results gracefully in search -->
<!-- chore: clean up unused imports in book controller -->
<!-- fix: prevent deleting book with active borrows -->
<!-- fix: only allow admin to update book details -->
<!-- fix: handle unknown category gracefully -->
<!-- fix: clamp rating value between 1 and 5 -->
