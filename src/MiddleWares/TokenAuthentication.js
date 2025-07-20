const User = require("../Models/UserSchema");
const jwt = require("jsonwebtoken");

const tokenAuthentication = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(decoded.userId);
  console.log(user)
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
  }

  req.user = { userId: user._id, email: user.email };
  next();
};

module.exports = tokenAuthentication