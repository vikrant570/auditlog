const express = require("express");
const router = express.Router();
const auditlogger = require("../MiddleWares/AuditLoggerMiddleware");
const User = require("../Models/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isLoggedIn = require("../MiddleWares/TokenAuthentication");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
        
    const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    if(!validPassword){
        return res.json({message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"});
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password : hashedPass,
    });

    const newData = {
      name: newUser.name,
      email: newUser.email,
    };

    auditlogger(req, newData, null, newUser._id);
    res.json({ message: "Registration successfull" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong !" , error: err.message});
  }
});

router.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User doesn't exist !" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({ message: "Invalid password or email !" });
    }

    const oldData = {
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    auditlogger(req, null, oldData, user._id);
    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      maxAge: 60 * 60 * 1000,
    });
    res.send({ messsage: "Login Successfull." });
  } catch (err) {
    res.json({ message: "Something went wrong" });
  }
});

router.put("/profile", isLoggedIn, async (req, res) => {
  try {
    const oldData = await User.findById(req.user.userId, { password: 0 });
    const { name, email, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);
    const newData = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email, password : hashedPass},
      { new: true}
    ).select('-password');

    auditlogger(req, newData, oldData, req.user.userId);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.json({ message: "Something went wrong" });
  }
});

router.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId, { password: 0 });
    auditlogger(req, null, user, req.user.userId);
    res.json({ user });
  } catch (err) {
    res.json({ message: "Something went wrong" });
  }
});

router.patch("/profile", isLoggedIn, async (req, res) => {
  try {
    const oldData = await User.findById(req.user.userId, { password: 0 });
    const { name, email, password } = req.body;
    const newData = await User.findByIdAndUpdate(
      req.user.userId,
      {
        name : name || oldData.name,
        email : email || oldData.email,
        password : password || oldData.password,
      },
      { new: true },

    ).select('-password');

    auditlogger(req, newData, oldData, req.user.userId);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.json({ message: "Something went wrong" });
  }
});

router.delete("/delete", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId, { password: 0 });
    auditlogger(req, null, user, req.user.userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.json({ message: "Something went wrong" });
  }
});

module.exports = router;