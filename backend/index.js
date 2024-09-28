require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');
const sequelize = require('./config/db');

const PORT= process.env.PORT;
const my_app = express();

const start = async() =>{
try{
    await sequelize.authenticate();
    await sequelize.sync();
    my_app.listen(PORT, () => console.log(`Server started at port ${PORT}`)); 
}
catch(e){
console.log(e);
}
}
start();