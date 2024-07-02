
// requiring mongoose
const mongoose=require("mongoose");
const express=require('express');
const app=express();
const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));

app.listen(3500,function(){
    console.log("Hello");
})
app.get("/",function(req,res){
    console.log(__dirname);
    // res.sendFile(__dirname+"/index.html")
    res.redirect("/")
});