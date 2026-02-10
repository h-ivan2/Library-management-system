require('dotenv').config({path: '../.env'});
const mongoose=require('mongoose');
const User=require('../models/User');
const bcrypt=require('bcrypt')

const seedUsers = async ()=>{
    try{

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        //Create default users
        const defaultUsers=[
            {
                name:'admin',
                email:'admin@library.com',
                password:'admin123',
                role:'admin'
            },
            {
                name:'Test User',
                email:'user@library.com',
                password:'user123',
                role:'user'
            }
        ];

        for(let userData  of defaultUsers){
            const existingUser= await User.findOne({email: userData.email});
            if(!existingUser){
                const hashedPassword=await bcrypt.hash(userData.password,10);
                const user=new User({
                    ...userData,
                password:hashedPassword
            });
                await user.save();
                console.log(`Created user: ${userData.email}/${userData.password}`);
                
            }else {
                console.log(`User already exists: ${userData.email}`)
            }
        }
        console.log('Seeding completed!');
        process.exit(0);
    }catch(error){
        console.error('Error seeding database:',error);
        process.exit(1);

    };

    
};
seedUsers();

////