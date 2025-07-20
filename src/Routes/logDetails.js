const express = require("express");
const router = express.Router();
const AuditLog = require("../Models/AuditLog");
const isLoggedIn = require("../MiddleWares/TokenAuthentication");
const auditlogger = require("../MiddleWares/AuditLogger");

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const logs = await AuditLog.find({ userId: req.user.userId });
    auditlogger(req, null, null, req.user.userId);
    res.json({ logs });
  } catch (err) {
    res.json({ message: "Something went wrong" });
  }
});

module.exports = router;