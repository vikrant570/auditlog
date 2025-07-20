const mongoose = require('mongoose');

const auditLogSchema = mongoose.Schema({
    userId : mongoose.Schema.Types.ObjectId,
    operation : String,
    collectionAffected : String,
    oldData : Object || null,
    newData : Object || null,
},{
    timestamps : true
})

const AuditLog = mongoose.model("auditlogs", auditLogSchema);
module.exports = AuditLog;