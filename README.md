# Library Management System

Backend API for a library management app built with Node.js, Express, and MongoDB.

## Features

- JWT-based authentication and role-based access control
- Book management (create, update, delete, search, pagination)
- Borrow/return workflow with overdue and fine tracking
- Profile and user management endpoints
- Swagger API documentation at `/api-docs`

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (`jsonwebtoken`)
- Request validation (`express-validator`)
- Rate limiting (`express-rate-limit`)

## Getting Started

1. Install dependencies:
   - `npm install`
2. Create environment file:
   - `cp .env.example .env`
3. Fill your `.env` values.
4. Start the server:
   - `npm run dev`

## Main Scripts

- `npm run dev` - start in development with nodemon
- `npm start` - start in production mode
- `npm run seed` - seed default users

## Environment Variables

See `.env.example` for required values:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
