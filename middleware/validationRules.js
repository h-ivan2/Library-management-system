const {body,param,query} = require('express-validator');

const userValidationRules= () =>{
    return [
        body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({min: 2,max: 50}).withMessage('Name must be between 2 and 50 characters'),

        body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
         
    ]

}