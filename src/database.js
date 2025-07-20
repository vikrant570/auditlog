const mongoose = require('mongoose');

const myDataBase = async () =>{
    await mongoose.connect(process.env.DB_URL);
    console.log('Database Connected..');
}

module.exports = myDataBase;