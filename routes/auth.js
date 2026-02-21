const express = require("express");
const router = express.Router();
const { loginUser ,logoutUser} = require("../controllers/authController");
const {loginRules}=require("../middleware/validationRules")
const validate=require("../middleware/validationMiddleware")

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login",loginRules(),validate, loginUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *      -bearerAuth: []
 *     description: Logout the current user. Since JWT is stateless, the client should remove the token from storage.
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *                 note:
 *                   type: string
 *                   example: Please remove the token from client storage
 *       500:
 *         description: Server error
 */
router.post("/logout", logoutUser);

module.exports = router;

