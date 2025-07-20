const express = require('express');
const app = express();
const myDB = require('./database');
const userRouter = require('./Routes/users')
require('dotenv').config({ path: __dirname + '/../.env' });
const logRouter = require('./Routes/logDetails');
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());

app.get('/', (req,res)=>{
    res.json({message : "Welcome to the API", path : req.path});
});

app.use('/users', userRouter);
app.use('/logs', logRouter);

app.listen(process.env.PORT, ()=>{
    myDB();
    console.log("Server started at http://localhost:8000");
})