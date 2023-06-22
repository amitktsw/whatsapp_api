const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");
const mysql=require("mysql");
const con=mysql.createConnection({
    host:"infostructure.in",
    user:"infoskuz_crmtest",
    password:"Hawamahal123",
    database:"infoskuz_whatsapp"
});
               con.connect(function(err){
                 if (err) {
                  return console.error('error: ' + err.message);
                  }
                console.log("database connected");
    
                });
