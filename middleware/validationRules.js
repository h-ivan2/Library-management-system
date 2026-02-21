const {body,param,query} = require('express-validator');

const createUserRules= () => [
        body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({min: 2,max: 50}).withMessage('Name must be between 2 and 50 characters'),

        body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),

        body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({min:6}).withMessage('Password must be altleast 6 characters'),

        body('role')
        .optional()
        .isIn(["user","admin"]).withMessage("Role must be 'user' or 'admin'" )
        
    ];

    const updateUserRules = () =>[
        param("id")
         .isMongoId().withMessage("Invalid user ID "),

         body("name")
         .optional()
         .trim()
         .isLength({min :2 ,max :50}).withMessage("Name must be between 2 and 5o characters"),

         body("email")
         .optional()
         .trim()
         .isEmail().withMessage("Must be a valid email address")
         .normalizeEmail(),

         body("role")
         .optional()
         .isIn(["user","admin"]).withMessage("Role must be 'user' or 'admin'")
    ];



//Book validation 

const createBookRules =() =>[
    body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({max:200}).withMessage("TIle can not exceed 200 characters"),

    body("author")
    .trim()
    .notEmpty().withMessage("Author is reqyired")
    .isLength({max:100}).withMessage("Author cannot exceed 100 characters"),

    body("isbn")
    .trim()
    .notEmpty().withMessage("ISBN is required")
    .matches(/^[\d\-]{10,20}$/).withMessage("ISBN must be 10-20 characters(hyphen allowed)")

];

const updateBookRules = () =>[
    param("id")
    .isMongoId().withMessage("Invalid book ID"),

    body("title")
    .optional()
    .trim()
    .isLength({max :200}).withMessage("Title cannot exceed 200 characters"),

    body("author")
    .optional()
    .trim()
    .isLength({max:100}).withMessage("Author cannot exceed 100 characters"),

    body("isbn")
    .optional()
    .matches(/^[\d\-]{10,20}$/).withMessage("ISBN must be 10-20 digits (hyphens allowed"),

    body("available")
    .optional()
    .isBoolean().withMessage("Available must be true or false")
];

//Borrow validation

const borrowRules =() =>[
    body("userId")
    .notEmpty().withMessage("UserId is required")
    .isMongoId().withMessage("UserId must be a valid MongoDB ID"),

    body("bookId")
    .notEmpty().withMessage("bookId is required")
    .isMongoId().withMessage("bookId must be a valid MondoDB ID")
];

const loginRules =() =>[
    body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address"),

    body("password")
    .notEmpty().withMessage("Password is required")
];

module.exports ={
    createUserRules,
    updateUserRules,
    createBookRules,
    updateBookRules,
    borrowRules,
    loginRules
};