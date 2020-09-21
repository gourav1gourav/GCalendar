const express= require('express');
const mongoose= require('mongoose');
const User= require('../DB/user');
const route= express.Router();

// exports.userCalendarfun= function(db){
//     return async (req,res)=>{
//     const firstName= req.body.firstName;
//     const lastName= req.body.lastName;
//     // const {firstName, lastName} = req.body;
//     let user={};
//     user.firstName= firstName;
//     user.lastName= lastName;
//     let userModel= new User(user);
//     await userModel.save();
//     res.json(userModel);
//     }
// }
route.post('/', async (req, res) => {
  console.log("reqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",req.body);
    const { firstName, lastName } = req.body;
    let user = {};
    user.firstName = firstName;
    user.lastName = lastName;
    let userModel = new User(user);
    await userModel.save();
    res.json(userModel);
  });

module.exports =route;