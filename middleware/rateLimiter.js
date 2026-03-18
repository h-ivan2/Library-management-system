const rateLimit=require('express-rate-limit');

const limiter=rateLimit({

    windowMs: 1* 60 * 1000, //limit is 1 minute
    max:50,//Limit each IP to 50 requests per minute
    message:'Too many requests from this IP ,please try again later' ,
    standardHeaders:true,
    legacyHeaders:false,
});

const loginLimiter=rateLimit({
windowMs:15 *60 *1000,
max:10 ,
message:'Too manty login attempts , please try again later .',
standardHeaders:true,
legacyHeaders:false,
});

module.exports={
    limiter,
    loginLimiter
};