const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const products = await Product.find({userId: req.user.userId});
        res.json({products});
    } catch(err){
        res.json({message: "Something went wrong"});
    }
})