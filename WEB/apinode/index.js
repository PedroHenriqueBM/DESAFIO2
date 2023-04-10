const express = require('express');
const dotenv = require('dotenv').config({});
const helmet = require('helmet');
const cors = require('cors');
const users = require('./user/index.js');

const app = express();
app.use(helmet());
app.use(cors({origin:process.env.ORIGIN}));
app.use(express.urlencoded({extended:false}))
app.use(express.json())




app.use("/users",users);

app.listen(process.env.PORT_API,()=>{
    console.log(`API RODANDO NA PORTA ${process.env.PORT_API}`)
})