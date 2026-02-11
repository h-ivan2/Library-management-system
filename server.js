const dotenv=require('dotenv');
dotenv.config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const express = require('express');
const connectDB = require('./config/database');
const booksRouter = require('./routes/books');
const userRoutes = require('./routes/users');
const borrowRoutes = require('./routes/borrow');
const { connect } = require('mongoose');
const authRoutes = require('./routes/auth');
const errorMiddleware = require('./middleware/errorMiddleware');
const cors = require("cors");

const app = express();


app.use(cors()); 
app.use(express.json());


connectDB();


app.use('/api/v1/books', booksRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/borrow', borrowRoutes);
app.use('/api/v1/auth', authRoutes); 


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 

//the server is listening on the port 5000;
