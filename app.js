const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");

const app = express();
app.set("view engine", "ejs");
mongoose.connect('mongodb://localhost:27017/test');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true]
    },
    email: {
        type: String,
        required: [true]
    },
    password: {
        type: String,
        required: [true]
    },
    employee:{type: Boolean},
    emplevel:{type: Number},
    admin:{type: Boolean}
});
const user = mongoose.model("User", userSchema);

const user1 = new user({name:"John",email:"abc@gmail.com",password:"hello",employee:false, admin:false});
const user2 = new user({name:"Mary",email:"a@gmail.com",password:"hello",employee:false, admin:false});
const emp1 = new user({name:"Rose",email:"adc@gmail.com",password:"hello",employee:true, admin:false, emplevel:2});
const emp2 = new user({name:"Jasmin",email:"fsdc@gmail.com",password:"hello",employee:true, admin:false, emplevel:3});
const admin1 = new user({name:"Peter",email:"fc@gmail.com",password:"hello",employee:true, admin:true, emplevel:5});
user.insertMany([user1, user2, emp1, emp2, admin1], function(err){
    if(err){console.log(err);}
    else console.log("Successfully saved");
});

const bugSchema = new mongoose.Schema({
    project: String,
    bugtitle: String,
    bugdesc: String,
    reported_by: userSchema,
    assigned_to: [userSchema],
    date: Date,
    threatlevel: Number
});
const bug = mongoose.model("Bug", bugSchema);

const bug1= new bug({project:"1",bugtitle:"bug1",bugdesc:"not opening",reported_by:user1,assigned_to:[emp1],date:new Date(),threatlevel:3});
const bug2= new bug({project:"1",bugtitle:"bug2",bugdesc:"not closing",reported_by:user2,assigned_to:[emp2,emp2],date:new Date(),threatlevel:4});
bug.insertMany([bug1, bug2], function(err){
    if(err){console.log(err);}
    else console.log("Successfully saved");
});

const taskSchema = new mongoose.Schema({
    bug: bugSchema,
    assigned_by: userSchema,
    assigned_to: userSchema,
    assigned_on: Date,
    resolved_on: Date,
    resolved: Boolean
});
const task = mongoose.model("Task", taskSchema);

const task1 = new task({bug:bug1,assigned_by:admin1,assigned_to:emp1,assigned_on:new Date(),resolved:false})
const task2 = new task({bug:bug2,assigned_by:admin1,assigned_to:emp2,assigned_on:new Date(),resolved:false})
task.insertMany([task1,task2], function(err){
    if(err){console.log(err);}
    else console.log("Successfully saved");
});

const chatSchema = new mongoose.Schema({
    user_:userSchema,
    emp_:userSchema,
    messages: [{ message_body: String, user_message: Boolean }],
});
const chat = mongoose.model("Chat",chatSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// mongoose.connect(
//   "mongodb+srv://user1:user1@cluster0.mcznv.mongodb.net/todolistDB"
// );

let currentuser=new user();
let alertSignIn="";
let alertSignUp="";
app.post("/login",function(req,res){
    console.log(req.body);
    
    const user_email=req.body.email;
    user.find({email:user_email},function(err,found){
        console.log(found);
        if(found.length===0){  
            if(req.body.signup==="Register"){
                const newuser= new user({name:req.body.your_name, email:req.body.your_email, password:req.body.your_pass,employee:false, admin:false});
                    user.insertMany([newuser],function(err){
                        if (err) {
                            console.log(err);}
                    });
                currentuser= newuser;
                res.redirect("homeuser");
                }
                else{
                    alertSignIn="You don't have an account with this email,try Sign up";
                    res.redirect("/login");
                }
        }
        else{
            if(req.body.signin==="Sign in"){  
                currentuser= found[0];
                if(found.employee===true){res.redirect("homeemp");}
                else{res.redirect("homeuser");}
            }
            else{
                alertSignUp="You already have an account with this email,try Sign in";
                res.redirect("/login");
            }
        }
    })

    // res.redirect("homeuser");
});
app.post("/bug",function(req,res){
    console.log(currentuser);
    const newbug= new bug({project:req.body.state,bugtitle:req.body.Title ,bugdesc:req.body.desc,date:new Date(),threatlevel:req.body.threatlevel})
    bug.insertMany([newbug],function(err){
        if (err) {
            console.log(err);}
    });
});

app.get("/", function (req, res) {
    res.render("login");
});

app.get("/homeuser",function (req, res) {
    res.render("homeuser");
});

app.get("/homeemp",function (req, res) {
    res.render("homeemp");
});

app.get("/login", function (req, res) {
  res.render("login",{alertSignUp:alertSignUp,alertSignIn:alertSignIn});
});

app.get("/bug", function (req, res) {
    console.log(currentuser);
    res.render("bug",{alertSignIn:alertSignIn,alertSignUp:alertSignUp});
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
}); //process.env.PORT ||
