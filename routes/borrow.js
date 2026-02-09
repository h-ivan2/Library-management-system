const express = require("express");
const router = express.Router();
const { borrowBook, returnBook } = require("../controllers/borrowController");
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /borrow/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Borrow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bookId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *                 description: The MongoDB ObjectId of the user
 *               bookId:
 *                 type: string
 *                 example: 507f191e810c19729de860ea
 *                 description: The MongoDB ObjectId of the book
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Book borrowed successfully
 *       400:
 *         description: Book not available or invalid request
 *       404:
 *         description: Book or user not found
 *       500:
 *         description: Server error
 */
router.post("/borrow", borrowBook);

/**
 * @swagger
 * /borrow/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Borrow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bookId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *                 description: The MongoDB ObjectId of the user
 *               bookId:
 *                 type: string
 *                 example: 507f191e810c19729de860ea
 *                 description: The MongoDB ObjectId of the book
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Book returned successfully
 *       400:
 *         description: Book was not borrowed by this user
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.post("/return", returnBook);

module.exports = router;