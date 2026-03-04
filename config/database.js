const mongoose=require("mongoose");

const connectDB =async() =>{
    try{
        
        const conn=await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB atlas connected: ${conn.connection.host}`);

        mongoose.connection.on('error',(err)=>{
            console.error(`MongoDB connection error:${err}`);
        });
        
        mongoose.connection.on('disconnected', () =>{
            console.log('MongoDB disconnected');
        })
    }catch(err){
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports=connectDB;

