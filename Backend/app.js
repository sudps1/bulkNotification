const express = require('express');
// const BookData = require('./src/model/Bookdata');
const Studentdata = require('./src/model/Studentdata');
const Activitydata = require('./src/model/Activitydata');
const Coursedata = require('./src/model/Coursedata');
const Profdata = require('./src/model/Profdata');
const Subscriptiondata = require('./src/model/Subscriptiondata');

const port = process.env.PORT || 3000;
const cors = require('cors');
var bodyparser=require('body-parser');
const jwt = require('jsonwebtoken')
var app = new express();
app.use(cors());
app.use(bodyparser.json());
// username='admin';
// password='12345678';




function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }



  app.post('/studlogin',function(req,res){
  
    let email =req.body.uname;
    let password =req.body.password;   

    Studentdata.findOne({email:email})
   .then(function(user){
         if(user.password == password)
         {
          console.log('Valid User!');
          let payload = {subject: email + password};
          let token = jwt.sign(payload,'secretKey');
          res.status(200).send({token});
           }

         else{
            res.status(401).send('Invalid Credentials');
            }
    })
    .catch( ()=> {

            res.status(401).send('User not found! Please SIGN UP!');
  });
})



app.post('/studentdetails',function(req,res){
   
  console.log(req.body);
 
  var student = {       
    fullname : req.body.student.firstname,
    qualification : req.body.student.username,
    email : req.body.student.email,
    mobno : req.body.student.mobno,
    dob : req.body.student.dob,
    password : req.body.student.password

 }       
 var student = new Studentdata(student);
 student.save();
});

app.post('/professordetails',function(req,res){
   
  console.log(req.body);
 
  var professor = {       
    fullname : req.body.professor.firstname,
    qualifications : req.body.professor.username,
    experiences : req.body.professor.experience,    
    email : req.body.professor.email,
    mobno : req.body.professor.mobno,
    dob : req.body.professor.dob,
    password : req.body.professor.password

 }       
 var professor = new Profdata(professor);
 professor.save();
});

app.post('/proflogin',function(req,res){
  
  let email =req.body.uname;
  let password =req.body.password;   

  Profdata.findOne({email:email})
 .then(function(user){
       if(user.password == password)
       {
        console.log('Valid User!');
        let payload = {subject: email + password};
        let token = jwt.sign(payload,'secretKey');
        res.status(200).send({token});
         }

       else{
          res.status(401).send('Invalid Credentials');
          }
  })
  .catch( ()=> {

          res.status(401).send('User not found! Please SIGN UP!');
});
})

app.post('/newcourse',function(req,res){
   
  console.log(req.body);
 
  var course = {       
    title : req.body.course.title,
    fee : req.body.course.fee,
    intended : req.body.course.intended,
    description : req.body.course.description,
    url : req.body.course.url,
    profemail : req.body.course.email,



 }       
 var course = new Coursedata(course);
 course.save();
});

app.get('/profcourse/:id',  (req, res) => {
  
  const profemail = req.params.id; 
  
  console.log(profemail);
  // Chefresdata.find({'roomnumber':roomnumber})
  //   .then((chefres)=>{
  //       res.send(chefres);
  //   });
  Coursedata.find({ profemail: profemail }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
      
    }
  })
})

app.get('/allcourses',function(req,res){
    
  Coursedata.find()
                .then(function(courses){
                    res.send(courses);
                });
});


app.get('/singlecourse/:id',  (req, res) => {
  
  const id = req.params.id;
  Coursedata.findOne({"_id":id})
    .then((course)=>{
        res.send(course);
    });
})

app.get('/singleprof/:id',  (req, res) => {
  
  const email = req.params.id; 
  
  console.log(email);
  // Chefresdata.find({'roomnumber':roomnumber})
  //   .then((chefres)=>{
  //       res.send(chefres);
  //   });
  Profdata.findOne({ email: email }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
      
    }
  })
})

app.post('/studreq',function(req,res){
   
  console.log(req.body);
 
  var studrequst = {       
    title : req.body.studrequst.title,
    studemail : req.body.studrequst.studemail,
    profemail : req.body.studrequst.profemail,
    status : req.body.studrequst.status
  

 }       
 var studrequst = new Subscriptiondata(studrequst);
 studrequst.save();
});

app.get('/studentreqs/:id',  (req, res) => {
  
  const profemail = req.params.id; 
  
  console.log(profemail);
  // Chefresdata.find({'roomnumber':roomnumber})
  //   .then((chefres)=>{
  //       res.send(chefres);
  //   });
  Subscriptiondata.find({ profemail: profemail }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
      
    }
  })
})
app.get('/studreqstatus/:id',  (req, res) => {
  
  const studemail = req.params.id; 
  
  console.log(studemail);
  // Chefresdata.find({'roomnumber':roomnumber})
  //   .then((chefres)=>{
  //       res.send(chefres);
  //   });
  Subscriptiondata.find({ studemail: studemail }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
      
    }
  })
})

app.get('/updatestudre/:id',(req,res)=>{
  const id = req.params.id; 

  console.log(id),


  Subscriptiondata.findByIdAndUpdate({"_id":id},
                              {$set:{
                              "status":"approved",
                             }})
 .then(function(){
     res.send();
 })
})

app.get('/rejectstudre/:id',(req,res)=>{
  const id = req.params.id; 

  console.log(id),


  Subscriptiondata.findByIdAndUpdate({"_id":id},
                              {$set:{
                              "status":"rejected",
                             }})
 .then(function(){
     res.send();
 })
})

app.post('/newactivity',function(req,res){
   
  console.log(req.body);
 
  var activity = {      
     
    activities : req.body.activity.activities,
    url1discrip : req.body.activity.url1discrip,
    url1 : req.body.activity.url1,
    url2discrip : req.body.activity.url2discrip,
    url2 : req.body.activity.url2,
    url3discrip : req.body.activity.url3discrip,
    url3 : req.body.activity.url3,
    title : req.body.activity.title,
    profemail : req.body.activity.profemail



 }       
 var activity = new Activitydata(activity);
 activity.save();
});

app.get('/courseactivity/:id',  (req, res) => {
  
  const title = req.params.id; 
  
  console.log(title);
  // Chefresdata.find({'roomnumber':roomnumber})
  //   .then((chefres)=>{
  //       res.send(chefres);
  //   });
  Activitydata.find({ title: title }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
      
    }
  })
})







  
app.post('/patientlogin',function(req,res){
  
  let roomnumber =req.body.uname;
  let password =req.body.password;   

  Userdata.findOne({roomnumber:roomnumber})
 .then(function(user){
       if(user.password == password)
       {
        console.log('Valid User!');
        let payload = {subject: username + password};
        let token = jwt.sign(payload,'secretKey');
        res.status(200).send({token});
         }

       else{
          res.status(401).send('Invalid Credentials');
          }
  })
  .catch( ()=> {

          res.status(401).send('User not found! Please SIGN UP!');
});
})

app.post('/order',function(req,res){
   
  console.log(req.body);
 
  var order = {       
    email : req.body.order.email,
    id : req.body.order.id,
    diabetes : req.body.order.diabetes,
    hypertension : req.body.order.hypertension,
    emergency : req.body.order.emergency,
    quantity : req.body.order.quantity,
    message : req.body.order.message,
    status : req.body.order.status
    


 }       
 var order = new Orderdata(order);
 order.save();
});
  
app.post('/insert',verifyToken,function(req,res){
   
    console.log(req.body);
   
    var chef = {       
      fullname : req.body.chef.fullname,
      chefid : req.body.chef.chefid,
      email : req.body.chef.email,
      mobno : req.body.chef.mobno,
      password : req.body.chef.password,
      confirmpassword : req.body.chef.confirmpassword

   }       
   var chef = new Chefdata(chef);
   chef.save();
});





app.post('/servedin',function(req,res){
   
  console.log(req.body);
 
  var chefres = {       
    roomnumber : req.body.chefres.email,
    foodname : req.body.chefres.foodname,
    quantity : req.body.chefres.quantity,
    servedin : req.body.chefres.servedin,
    id : req.body.chefres.id



 } 



//  Orderdata.findByIdAndUpdate({"_id":chefres.id},
//                                   {$set:{
//                                   "status":"true"}})


var order_id = chefres.id; 
console.log(order_id) 

Orderdata.findByIdAndUpdate(order_id, { status: 'true' }, 
                            function (err, docs) { 
    if (err){ 
        console.log(err) 
    } 
    else{ 
        console.log("Updated User : ", docs); 
    } 
});
// Orderdata.books.update(
//   { _id: 1 },
//   {
//     $inc: { stock: 5 },
//     $set: {
//       item: "ABC123",
//       "info.publisher": "2222",
//       tags: [ "software" ],
//       "ratings.1": { by: "xyz", rating: 3 }
//     }
//   }
// )


 
//  Chefresdata.find({ roomnumber: roomnumber }, function(err, result) {
//   if (err) {
//     console.log(err);
//   } else {
//     res.json(result);
    
//   }
// })

 var chefres = new Chefresdata(chefres);
 chefres.save();
});







app.post('/inputfood',function(req,res){
   
  console.log(req.body);
 
  var food = {       
    foodname : req.body.food.foodname,
    price : req.body.food.price,
    cuisine : req.body.food.cuisine,
    description : req.body.food.description,
    url : req.body.food.url    


 }       
 var food = new Fooddata(food);
 food.save();
});


app.get('/foods',function(req,res){
    
  Fooddata.find()
                .then(function(foods){
                    res.send(foods);
                });
});

app.get('/getorders',function(req,res){
    
  Orderdata.find()
                .then(function(orders){
                    res.send(orders);
                });
});

app.get('/chefs',function(req,res){
    
  Chefdata.find()
                .then(function(chefs){
                    res.send(chefs);
                });
});


app.get('/:id',  (req, res) => {
  
  const id = req.params.id;
  Chefdata.findOne({"_id":id})
    .then((chef)=>{
        res.send(chef);
    });
})
app.get('/room/:id',  (req, res) => {
  
  const roomnumber = req.params.id; 
  
  console.log(roomnumber);
  // Chefresdata.find({'roomnumber':roomnumber})
  //   .then((chefres)=>{
  //       res.send(chefres);
  //   });
  Chefresdata.find({ roomnumber: roomnumber }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
      
    }
  })
})
// app.post('/patientlogin',function(req,res){
  
//   let email =req.body.uname;
//   let password =req.body.password;   

//   Userdata.findOne({email:email})
//  .then(function(user){
//        if(user.password == password)
//        {
//         console.log('Valid User!');
//         let payload = {subject: username + password};
//         let token = jwt.sign(payload,'secretKey');
//         res.status(200).send({token});
//          }

//        else{
//           res.status(401).send('Invalid Credentials');
//           }
//   })
//   .catch( ()=> {

//           res.status(401).send('User not found! Please SIGN UP!');
// });
// })

app.get('/order/:id',  (req, res) => {
  
  const id = req.params.id;
  Orderdata.findOne({"_id":id})
    .then((order)=>{
        res.send(order);
    });
})

app.get('/food/:id',  (req, res) => {
  
  const id = req.params.id;
  Fooddata.findOne({"_id":id})
    .then((food)=>{
        res.send(food);
    });
})

app.post('/login', (req, res) => {
    let userData = req.body
    
      
        if (username !== userData.uname) {
          res.status(401).send('Invalid Username')
        } else 
        if ( password !== userData.password) {
          res.status(401).send('Invalid Password')
        } else {
          let payload = {subject: username+password}
          let token = jwt.sign(payload, 'secretKey')
          res.status(200).send({token})
        }
      
    })
    app.put('/updatefood',(req,res)=>{
      console.log(req.body)
      id=req.body._id,
      foodname= req.body.foodname,
      price = req.body.price,
      cuisine = req.body.cuisine,
      description = req.body.description,      
      url = req.body.url

      Fooddata.findByIdAndUpdate({"_id":id},
                                  {$set:{
                                  "foodname":foodname,
                                  "price":price,
                                  "cuisine":cuisine,
                                  "description":description,                                  
                                  "url":url}})
     .then(function(){
         res.send();
     })
   })

    app.put('/update',(req,res)=>{
      console.log(req.body)
      id=req.body._id,
      fullname= req.body.fullname,
      chefid = req.body.chefid,
      email = req.body.email,
      mobno = req.body.mobno,      
      password = req.body.password,
      confirmpassword = req.body.confirmpassword

      Chefdata.findByIdAndUpdate({"_id":id},
                                  {$set:{
                                  "fullname":fullname,
                                  "chefid":chefid,
                                  "email":email,
                                  "mobno":mobno,                                  
                                  "password":password,
                                  "confirmpassword":confirmpassword}})
     .then(function(){
         res.send();
     })
   })


   app.delete('/removefood/:id',(req,res)=>{
   
    id = req.params.id;
    Fooddata.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })
   
   
app.delete('/remove/:id',(req,res)=>{
   
     id = req.params.id;
     Chefdata.findByIdAndDelete({"_id":id})
     .then(()=>{
         console.log('success')
         res.send();
     })
   })
  
     
   

app.listen(port, function(){
    console.log('listening to port 3000');
});

