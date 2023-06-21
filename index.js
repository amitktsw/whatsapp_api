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


require('dotenv').config();

const app=express().use(body_parser.json());

const token=process.env.TOKEN;

const mytoken=process.env.MYTOKEN;//prasath_token


app.listen(process.env.PORT,()=>{
    console.log("webhook is listening");
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook",(req,res)=>{
   let mode=req.query["hub.mode"];
   let challange=req.query["hub.challenge"];
   let token1=req.query["hub.verify_token"];



    if(mode && token1){


        if(mode==="subscribe" && token1===mytoken){
            res.status(200).send(challange);
        }else{
            res.status(403);
        }

    }

});

app.post("/webhook",(req,res)=>{

    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        console.log("inside body param");
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages && 
            body_param.entry[0].changes[0].value.messages[0]  
            ){
               let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
               let from = body_param.entry[0].changes[0].value.messages[0].from;
               if (body_param.entry[0].changes[0].value.messages[0].type=="image"){
                    var imgid = body_param.entry[0].changes[0].value.messages[0].image.id;
                    var msg_body = "";
                    if(body_param.entry[0].changes[0].value.messages[0].image.caption){
                        msg_body = body_param.entry[0].changes[0].value.messages[0].image.caption;
                    }
                }else if (body_param.entry[0].changes[0].value.messages[0].type=="document"){
                    var docid = body_param.entry[0].changes[0].value.messages[0].document.id;
                    var msg_body = "";
                    if(body_param.entry[0].changes[0].value.messages[0].document.caption){
                        msg_body = body_param.entry[0].changes[0].value.messages[0].document.caption;
                    }
                }else{
                    var msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
                }
               
               let epochTimeStamp = body_param.entry[0].changes[0].value.messages[0].timestamp; 
            
  var d = new Date(epochTimeStamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = d.getFullYear();
  var month = d.getMonth()+1;
  var date = d.getDate();
  var hour = d.getHours();
  var min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  var sec = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
  var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec ;
            
var attachid="";


               console.log("phone number: "+phon_no_id);
               console.log("from: "+from);
               
                if (body_param.entry[0].changes[0].value.messages[0].type=="image"){
                    console.log("body param - imageID: "+imgid);
                    console.log("body param - caption: "+msg_body);
                    attachid=imgid;
                }else if (body_param.entry[0].changes[0].value.messages[0].type=="document"){
                    console.log("body param - docid: "+docid);
                    console.log("body param - caption: "+msg_body);
                    attachid=docid;
                }else{
                console.log("oady param: "+msg_body);
                }
            
               console.log("TimeStamp: "+time);
          

            
               var sql = 'INSERT INTO received_messages (msg_to,msg_from,msg) VALUES ("'+phon_no_id+'" ,"'+from+'" ,"'+msg_body+'")';
               //var values=[phon_no_id,from,msg_body];
               con.query(sql, function (err, result) {  
                if (err) throw err;  
                console.log("1 record inserted");  
               });
             
            

               axios({
                   method:"POST",
                   url:"https://graph.facebook.com/v13.0/"+phon_no_id+"/messages?access_token="+token,
                   data:{
                       messaging_product:"whatsapp",
                       to:from,
                       text:{
                           body:"Hi..."
                       }
                   },
                   headers:{
                       "Content-Type":"application/json"
                   }

               });

               res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }

    }

});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup");
});
