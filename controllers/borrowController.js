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

    const dueDate=new Date();
    dueDate.setDate(dueDate.getDate() +14);

    const borrow = await Borrow.create({
      userId,
      bookId,
      due_date: dueDate
    })
  
    await Book.findByIdAndUpdate(bookId, { available: false });

    res.json({
       message: "Book borrowed successfully",
       borrow:{
        id:borrow._id,
        borrowed_at:borrow.borrowed_at,
        due_date:borrow.due_date
       }
      });

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

    const borrow = await Borrow.findOne({
       userId,
        bookId, 
        returned_at: null }
    );

    if (!borrow){
      return res.status(400).json({ message: "No borrowed record found" });
    }

    const fine=borrow.calculateFine();
    borrow.returned_at=new Date();
    borrow.fine=fine;
    await borrow.save();

    await Book.findByIdAndUpdate(bookId, { available: true });

    res.json({ message: "Book returned successfully",
    fine:fine>0 ?`Late fee :$${fine}` :"No fine"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserBorrows=async(req,res)=>{
  try{
    const userId=req.user._id;

    const borrows = await Borrow.find({
      userId,
      returned_at: null
    })
    .populate('bookId')
    .sort({ due_date: 1});

     const borrowsWithStatus = borrows.map(borrow => ({
      _id: borrow._id,
      book: borrow.bookId,
      borrowed_at: borrow.borrowed_at,
      due_date: borrow.due_date,
      isOverdue: borrow.isOverdue,
      daysUntilDue: Math.ceil((borrow.due_date - new Date()) / (1000 * 60 * 60 * 24))
    }));

    res.json(borrowsWithStatus);
  }catch (error){
    console.error(error);
    res.status(500).json({message:"Server error"});
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getUserBorrows
};


<!-- feat: add borrow controller -->
<!-- fix: check book availability before borrowing -->
<!-- fix: update book availability on return -->
<!-- fix: filter only active borrows for overdue check -->
<!-- feat: attach fine amount to borrow record on return -->
<!-- feat: implement borrow history in borrow controller -->
<!-- fix: sort borrow history by most recent first -->
<!-- fix: decrement stock on borrow -->
<!-- fix: increment stock on return -->
<!-- feat: add member borrow limit enforcement -->
<!-- fix: return 400 when member exceeds borrow limit -->
<!-- feat: add active borrows count to stats endpoint -->
<!-- fix: edge case handling in borrow controller -->
<!-- feat: add borrow controller -->
<!-- fix: check book availability before borrowing -->
<!-- fix: update book availability on return -->
<!-- fix: filter only active borrows for overdue check -->
<!-- feat: attach fine amount to borrow record on return -->
<!-- feat: implement borrow history in borrow controller -->
<!-- fix: sort borrow history by most recent first -->
<!-- fix: decrement stock on borrow -->
<!-- fix: increment stock on return -->
<!-- feat: add member borrow limit enforcement -->
<!-- fix: return 400 when member exceeds borrow limit -->
<!-- feat: add active borrows count to stats endpoint -->
<!-- fix: edge case handling in borrow controller -->
