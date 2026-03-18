const nodemailer = require('nodemailer');
const Borrow = require('../models/borrow');
const User = require('../models/User');
const Book = require('../models/books');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send overdue notification
const sendOverdueNotification = async (borrow) => {
  try {
    const user = await User.findById(borrow.userId);
    const book = await Book.findById(borrow.bookId);
    
    if (!user || !book) return;

    const daysOverdue = Math.ceil((new Date() - borrow.due_date) / (1000 * 60 * 60 * 24));
    const fine = daysOverdue * 1; // $1 per day

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '⚠️ Overdue Book Notice - Library Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Book Overdue Notice</h2>
          <p>Dear ${user.name},</p>
          <p>This is a reminder that the following book is overdue:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Due Date:</strong> ${borrow.due_date.toLocaleDateString()}</p>
            <p><strong>Days Overdue:</strong> ${daysOverdue}</p>
            <p><strong>Current Fine:</strong> $${fine}</p>
          </div>
          
          <p>Please return the book as soon as possible to avoid additional fines.</p>
          <p>If you have already returned the book, please disregard this message.</p>
          
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated message from the Library Management System.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Overdue notification sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Check for overdue books and send notifications
const checkOverdueBooks = async () => {
  try {
    const overdueBorrows = await Borrow.find({
      returned_at: null,
      due_date: { $lt: new Date() }
    });

    for (const borrow of overdueBorrows) {
      // Check if notification was already sent today
      const lastNotified = borrow.lastOverdueNotification;
      const today = new Date().setHours(0, 0, 0, 0);
      
      if (!lastNotified || lastNotified.setHours(0, 0, 0, 0) < today) {
        await sendOverdueNotification(borrow);
        
        // Update last notification date
        borrow.lastOverdueNotification = new Date();
        await borrow.save();
      }
    }
  } catch (error) {
    console.error('Error checking overdue books:', error);
  }
};

module.exports = {
  sendOverdueNotification,
  checkOverdueBooks
};