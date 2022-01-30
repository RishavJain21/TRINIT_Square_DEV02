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
const defaultuser = new user({name:"None",email:"none",password:"none",employee:false, admin:false});

const user1 = new user({name:"John",email:"abc@gmail.com",password:"hello",employee:false, admin:false});
const user2 = new user({name:"Mary",email:"a@gmail.com",password:"hello",employee:false, admin:false});
const emp1 = new user({name:"Rose",email:"adc@gmail.com",password:"hello",employee:true, admin:false, emplevel:2});
const emp2 = new user({name:"Jasmin",email:"fsdc@gmail.com",password:"hello",employee:true, admin:false, emplevel:3});
const admin1 = new user({name:"Peter",email:"fc@gmail.com",password:"hello",employee:true, admin:true, emplevel:5});
// user.insertMany([user1, user2, emp1, emp2, admin1], function(err){
//     if(err){console.log(err);}
//     else console.log("Successfully saved");
// });
// const chatSchema = new mongoose.Schema({
//     messages: [{ message_body: String, user_message: Boolean }],
// });
// const chat = mongoose.model("Chat",chatSchema);
const bugSchema = new mongoose.Schema({
    project: String,
    bugtitle: String,
    bugdesc: String,
    reported_by: userSchema,
    date: Date,
    threatlevel: Number,
    assigned: Boolean,
    assigned_by: userSchema,
    assigned_to: [userSchema],
    assigned_on: Date,
    deadline: Date,
    resolved_on: Date,
    resolved: Boolean,
    report: String,
    messages: [{ message_body: String, user_message: Boolean, time_of_message:Date }],
});
const defaultmessage= {
    message_body: "How can I help you?",
    user_message: false,
    time_of_message: new Date()
}
const bug = mongoose.model("Bug", bugSchema);

const bug1= new bug({project:"1",bugtitle:"bug1",bugdesc:"not opening",reported_by:user1,assigned:true,assigned_to:[emp1],date:new Date(),threatlevel:3});
const bug2= new bug({project:"1",bugtitle:"bug2",bugdesc:"not closing",reported_by:user2,assigned:true,assigned_to:[emp2,emp2],date:new Date(),threatlevel:4});
const bug3= new bug({project:"1",bugtitle:"bug3",bugdesc:"not closing",reported_by:user2,assigned:true,assigned_to:[emp2],date:new Date(),threatlevel:1});
const bug4= new bug({project:"1",bugtitle:"bug4",bugdesc:"not closing",reported_by:user2,assigned:false,date:new Date(),threatlevel:1});
// bug.insertMany([bug1, bug2, bug3, bug4], function(err){
//     if(err){console.log(err);}
//     else console.log("Successfully saved");
// });

// const taskSchema = new mongoose.Schema({
//     bug: bugSchema,
//     assigned_by: userSchema,
//     assigned_to: userSchema,
//     assigned_on: Date,
//     deadline: Date,
//     resolved_on: Date,
//     resolved: Boolean
// });
// const task = mongoose.model("Task", taskSchema);

// const task1 = new task({bug:bug1,assigned_by:admin1,assigned_to:emp1,assigned_on:new Date(),resolved:false})
// const task2 = new task({bug:bug2,assigned_by:admin1,assigned_to:emp2,assigned_on:new Date(),resolved:false})
// task.insertMany([task1,task2], function(err){
//     if(err){console.log(err);}
//     else console.log("Successfully saved");
// });

app.post("/alltask",function(req,res){
    console.log("^^^^^^^^^^");
    console.log(req.body);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// mongoose.connect(
//   "mongodb+srv://user1:user1@cluster0.mcznv.mongodb.net/todolistDB"
// );

let currentuser=defaultuser;
let alertSignIn="";
let alertSignUp="";
// app.post("/signup")
app.post("/signin",function(req,res){
    // console.log(req.body);
    user.find({email:req.body.your_email},function(err,found){
        if(!err){
            if(found.length===0){
                alertSignIn="Email is not registered, sign up first."
                res.redirect("/signin");
            }
            else{
                if(found[0].password===req.body.your_pass){
                    if(found[0].employee){
                        currentuser=found[0];
                        res.render("homeemp");}
                    else{
                        currentuser=found[0];
                        res.render("homeuser");
                    }
                }
                else{
                    alertSignIn="Password incorrect.";
                    res.redirect("/signin");
                }
            }
        }else{console.log(err);}
    });
});

app.post("/signup",function(req,res){
    user.find({email:req.body.email},function(err,found){
        console.log(found);
        if(!err){
            if(found.length===0){
                const newuser= new user({name:req.body.name, email:req.body.email, password:req.body.pass,employee:false, admin:false});
                    user.insertMany([newuser],function(err){
                        if (err) {
                            console.log(err);}
                    });
                currentuser= newuser;
                res.render("homeuser");
            }
            else{
                alertSignUp="Account already exist with this email, try signing in.";
                res.redirect("/signup");
            }
        }else{console.log(err);}
    });
});

app.post("/bug",function(req,res){
    if(currentuser===defaultuser){res.redirect("/signin")};
    // console.log("*");
    // console.log(currentuser);
    var dt = new Date();
   dt.setDate(dt.getDate() + 5);
//    alert(dt);
    const newbug= new bug({
        project:req.body.state,
        bugtitle:req.body.Title ,
        bugdesc:req.body.desc,
        date:new Date(),
        threatlevel:req.body.threatlevel,
        reported_by:currentuser,
        assigned:true,
        assigned_to:[emp1],
        resolved:false,
        messages:[defaultmessage],
        deadline:dt
    });
    console.log(newbug);
    bug.insertMany([newbug],function(err){
        if (err) {
            console.log(err);}
    });
    // const newtask = new task({bug:newbug,resolved:false})
    // task.insertMany([newtask],function(err){
    //     if (err) {
    //         console.log(err);}
    // });
    if(currentuser.employee)res.redirect("/homeemp");
    else res.redirect("/homeuser");
});
app.get("/resolved/:bugid",function(req,res){
    // if(currentuser===defaultuser){res.redirect("/signin")};
    // const onetask=bug.findById(req.params.bugid);
        // console.log("\n\n\nreached\n\n\n");
        bug.updateOne({_id:req.params.bugid},{resolved:true},function(err){console.log(err);});
        bug.findOne({ _id:req.params.bugid }, function (err, found) {
            if(!err){
                // console.log(found);
                console.log("\n\n"+found.resolved+"\n\n");
                // res.render("taskemp",{task:found});
                res.send("report page with post <a>submit</a>");

            }
            else{console.log(err);}
        });
});

app.get("/", function (req, res) {
    res.render("signin");
});
app.get("/report/:bugid",function(req,res){
    res.render("report",{bugid:req.params.bugid});
});
app.get("/myTeam",function(req,res){
    user.find({employee:true},function(err,found){
        res.render("myTeam",{team:found});
    });
});
app.post("/report/:bugid",function(req,res){
    console.log(req.body);
    console.log(req.params);
    bug.updateOne({_id:req.params.bugid},{report:req.body.bugREPORT,resolved:true},function(err){console.log(err);});
    res.redirect("/taskemp/"+req.params.bugid);
});

app.get("/chat/:bugid",function(req,res){
    bug.findOne({ _id:req.params.bugid }, function (err, found) {
        if(!err){
            console.log(found);
            res.render("chat",{bug:found,employee:currentuser.employee});
        }else{console.log(err);}
      });
    // render("chat",)
});
app.post("/chat/:bugid",function(req,res){
    console.log(req.body);
    const msg={
        message_body:req.body.newmsg,
        user_message:req.body.emp,
        time_of_message:new Date()
    }
    // bug.updateOne({_id:req.params.bugid},{messages:messages},function(err){console.log(err);});
    console.log(msg);
    bug.findOne({ _id:req.params.bugid }, function (err, found) {
        if(!err){
            const msgs=found.messages;
            msgs.push(msg);
            console.log(msgs);
            bug.updateOne({_id:req.params.bugid},{messages:msgs},function(err){console.log(err);});
        }else{console.log(err);}
    });
    res.redirect("/chat/"+req.params.bugid);
});
app.get("/homeuser",function (req, res) {
    console.log(currentuser);
    if(currentuser===defaultuser){res.redirect("/signin")};
    res.render("homeuser");
});

app.get("/homeemp",function (req, res) {
    if(currentuser===defaultuser){res.redirect("/signin")};
    res.render("homeemp");
});

app.get("/signin", function (req, res) {
  res.render("signin",{alertSignIn:alertSignIn});
});
app.get("/signup", function (req, res) {
    res.render("signup",{alertSignUp:alertSignUp});
  });

app.get("/bug", function (req, res) {
    if(currentuser===defaultuser){res.redirect("/signin")};
    console.log(currentuser);
    res.render("bug",{alertSignIn:alertSignIn,alertSignUp:alertSignUp});
});

app.get("/alltask",function(req,res){
    if(currentuser===defaultuser){res.redirect("/signin")};
    bug.find({threatlevel:{$lt:currentuser.emplevel+1}},function(err,found){//threatlevel:{$lt:currentuser.emplevel-1}
        user.find({employee:true,emplevel:{$lt:currentuser.emplevel}},function(err,sub){//threatlevel:{$lt:currentuser.emplevel-1}
            console.log(sub);
            res.render("alltask",{allTasks:found,sub:sub});
        });
    });
});

app.get("/mytasks",function(req,res){
    if(currentuser===defaultuser){res.redirect("/signin")};
    bug.find({assigned:true},function(err,foundassigned){
        const myTasks=[];
        for(var i=0;i<foundassigned.length;i++){
            for(var j=0;j<foundassigned[i].assigned_to.length;j++){
                if(foundassigned[i].assigned_to[j].email===currentuser.email){
                    myTasks.push(foundassigned[i]);
                }
            }
        }
        res.render("mytasks",{myTasks:myTasks});
    });
});



app.get("/taskemp/:bugid",function (req, res) {
    if(currentuser===defaultuser){res.redirect("/signin")};
    // const onetask=bug.findById(req.params.bugid);
  bug.findOne({ _id:req.params.bugid }, function (err, found) {
    if(!err){
        console.log(found);
        res.render("taskemp",{task:found});
    }else{console.log(err);}
  });
    
});

app.get("/request",function (req, res) {
    // if(currentuser===defaultuser){res.redirect("/signin")};
    res.render("request");
});

app.get("/adminteam",function(req,res){
    res.render("adminmyteam");
});
app.get("/adminteam/:userid",function(req,res){
    console.log(req.params.userid);
    res.render("adminmyteam");
    // if(currentuser===defaultuser){res.redirect("/signin")};
    // const onetask=bug.findById(req.params.bugid);
        // console.log("\n\n\nreached\n\n\n");
        // bug.updateOne({_id:req.params.bugid},{resolved:true},function(err){console.log(err);});
        // bug.findOne({ _id:req.params.bugid }, function (err, found) {
        //     if(!err){
        //         // console.log(found);
        //         console.log("\n\n"+found.resolved+"\n\n");
        //         // res.render("taskemp",{task:found});
        //         res.render("adminmyteam");
        //     }
        //     else{console.log(err);}
        // });
});

app.get("/addemp",function(req,res){
    res.render("addemp");
});
app.post("/addemp",function(req,res){
    console.log(req.body);
    user.find({email:req.body.email},function(err,found){
        var adminlevel=req.body.level===5;
        console.log(found);
        if(!err){
            if(found.length!==0){
                user.deleteOne({email:req.body.name},function(err){
                    if(err){console.log(err);}
                    else{console.log("Successfully deleted");}
                });    
            }
            // if(req.body.level===5){}
            const newuser= new user({name:req.body.name, email:req.body.email, password:req.body.pass,employee:true,emplevel:req.body.level, admin:adminlevel});
            console.log(newuser);
            user.insertMany([newuser],function(err){
                    if (err) {console.log(err);}
                    else{console.log("successfully added");}
            });
            // currentuser= newuser;
            res.render("adminmyteam");
        }else{console.log(err);}
    });
});

app.get("/raisedbug",function(req,res){
    if(currentuser===defaultuser){res.redirect("/signin")};
    bug.find({},function(err,found){
        var raisedbugs=[];
        console.log(found.length);
        console.log("*"+currentuser.name+"*");
        found.forEach(function(bug){
            console.log("*"+bug.reported_by.name+"*");
            if(bug.reported_by.name===currentuser.name){
                console.log("inside iffff");
                raisedbugs.push(bug);
            }
        });
        console.log(raisedbugs.length);
        res.render("raisedbug",{raisedbugs:raisedbugs});
    });
});

app.get("/resolvedbugs",function(req,res){
    if(currentuser===defaultuser){res.redirect("/signin")};
    bug.find({resolved:true},function(err,found){
        if(err) console.log(err);
        else res.render("resolvedbugs",{resolvedbugs:found});
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
}); //process.env.PORT ||
