const AuditLog = require("../Models/AuditLog");
// const User = require("../Models/UserSchema");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

const auditlogger = async (req, newData, oldData, id) => {
  await AuditLog.create({
    userId : id,
    operation : req.method,
    collectionAffected : req.originalUrl.split('/')[1],
    oldData : oldData,
    newData : newData
  })

  return
};

module.exports = auditlogger;
