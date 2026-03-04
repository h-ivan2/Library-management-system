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
   due_date: {
    type: Date,
    required: true,
    default: function() {
      const date = new Date();
      date.setDate(date.getDate() + 14);
      return date;
    }
  },
  returned_at: {
    type: Date,
    default: null
  },
  fine: {
    type: Number,
    default: 0
  },
  
  lastOverdueNotification:{
    type:Date,
    default:null
  }
});

borrowSchema.index({ userId: 1, returned_at: 1 });
borrowSchema.index({ due_date: 1 });

// checking if book is overdue
borrowSchema.virtual('isOverdue').get(function() {
  return !this.returned_at && this.due_date < new Date();
});

//if overdue we fine the borrower
borrowSchema.methods.calculateFine = function() {
  if (this.returned_at) return 0;
  
  const today = new Date();
  if (this.due_date > today) return 0;
  
  const daysOverdue = Math.ceil((today - this.due_date) / (1000 * 60 * 60 * 24));
  return daysOverdue * 1; // $1 per day fine
};

const Borrow=mongoose.model("Borrow",borrowSchema);
module.exports =Borrow;


