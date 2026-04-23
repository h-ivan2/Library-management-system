const dotenv=require('dotenv');
dotenv.config();

const requiredEnvVars=["MONGODB_URI","JWT_SECRET","EMAIL_USER","EMAIL_PASS"];
const missingEnvVars=requiredEnvVars.filter((key) => !process.env[key]);
if(missingEnvVars.length>0){
    console.error(`Missing required environment variables: ${missingEnvVars.join(",")}`);
    console.error("Please check your .env file");
    process.exit(1);
}

const express=require("express");
const cors=require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const connectDB = require('./config/database');
const errorMiddleware = require('./middleware/errorMiddleware');
const { limiter }=require('./middleware/rateLimiter');

// Routes
const authRoutes = require('./routes/auth');
const booksRouter = require('./routes/books');
const userRoutes = require('./routes/users');
const borrowRoutes = require('./routes/borrow');
const profileRoutes=require("./routes/profile");
const statisticsRoutes=require("./routes/statistics");
require("./jobs/overdueChecker");

const app = express();

// Fix: trust proxy for express-rate-limit to work correctly
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

connectDB();

app.use(limiter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books', booksRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/borrow', borrowRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/statistics', statisticsRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/v1/health",(req,res)=>{
    res.json({status:"ok",timestamp: new Date().toISOString()});
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
<!-- chore: register notification service in server.js -->
<!-- chore: register admin routes in server.js -->
<!-- chore: apply sanitize middleware globally in server.js -->
<!-- feat: add graceful shutdown handler in server.js -->
