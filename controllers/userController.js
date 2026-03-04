const User = require("../models/User");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const allowedRoles = ["user", "admin"];
    const userRole = role || "user";

    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({ message: "Invalid role. Must be 'user' or 'admin'" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 }); // Sort by newest first

    const totalUsers = await User.countDocuments();

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      hasNextPage: page < Math.ceil(totalUsers / limit),
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) {
      const allowedRoles = ["user", "admin"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      updateData.role = role;
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById=async(req,res)=>{
  try{
    const {id}=req.params;
    const user=await User.findById(id).select("-password");

    if(!user){
      return res.status(404).json({message :"User not found"});
    }
    res.json(user);

  }catch(error){
    console.error(error);
    res.status(500).json({message:"Server error"});
  }
};

const updateProfile=async(req,res)=>{
  try{
    const {name,email}=req.body;
    const userId=req.user.id;

    const updateData={};
    if(name) updateData.name=name;
    if(email)updateData.email=email;

    const user=await User.findByIdAndUpdate(
      userId,
      updateData,
      {new:true,runValidators:true}
    ).select("-password");

    res.json({
      message:"Profile updated successfully",
      user
    });
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Server error"});
  }
};

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserById,
  updateProfile

};

