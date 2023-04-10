const express = require('express');
const jwt = require('jsonwebtoken');
const { USERSDB } = require('../fakedb/fakedb');
const User = require('../models/users');
const users = express.Router();

users.post('/loggin',(req,res,next)=>{

    
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let user = new User(req.body.nome, req.body.senha, req.body.email);
  
    if(
        validRegister(user.email) === true && 
        validRegister(user.nome) === true && 
        validRegister(user.email)===true  &&
        validLogin(user.email,user.senha,"v")
        ){
            
    
        let token = jwt.sign(validLogin(user.email,user.senha,"g"),jwtSecretKey,{
            expiresIn:'1h'
        })
    
        return res.status(200).send(token);
    
    
    
        }else{
        return res.sendStatus(400);
        }
    

   


})

users.post('/register',(req,res,next)=>{

    let tam = USERSDB.length;
    let id = tam + 1;
    
    
    let user = new User(req.body.nome, req.body.senha, req.body.email, id);

    if(
    validRegister(user.email) === true && 
    validRegister(user.nome) === true && 
    validRegister(user.email)===true  &&
    validEmail(user.email) === true
    ){
        

     USERSDB.push(user);

     return res.sendStatus(200);



    }else{
    return res.sendStatus(400);
    }
    
    




})

users.get('/getUser',validUserToken,(req,res,next)=>{


    return res.status(200).send(USERSDB)


})

users.get("/decode", (req, res, next) => {
   
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
  
    try {

        const token = req.header('token')
  
        const verified = jwt.decode(token);

        return res.send(verified)

    } catch (error) {
        return res.status(401).send(false);
    }

});





users.get("/users",(req,res,next)=>{
    res.status(200).send(USERSDB);
})






function validUserToken(req, res, next){

    let jwtSecretKey = process.env.JWT_SECRET_KEY;
  
    try {

        const token = req.header('token')
  
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            next()
        }else{
            // Access Denied
            return res.status(401).send(false);
        }

    } catch (error) {
        return res.status(401).send(false);
    }

}


function validLogin(email,senha, ope){

    for(let user of USERSDB){
        if(user.email === email && user.senha ===senha){
            if(ope==="v"){
                 return true
            }else if(ope==="g"){
                return {
                    nome: user.nome,
                    senha: user.senha,
                    email: user.email,
                    id: user.id
                }
            }
           
        }
    }

    return false;

}

function validRegister(item){

 switch(item){
    case null: return false;
    case '': return false;
    case undefined: return false;
    case (item.length===0): return false;
    default:  return true;
 }

}

function validEmail(email){

    for(let user of USERSDB){
        if(user.email === email){

            return false;
        }
    }
    
    return true;
}

module.exports = users;