//jshint esversion:6
require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/userDb', {useNewUrlParser: true, useUnifiedTopology: true});
// const encrypt = require("mongoose-encryption");

//for security
// var md5 = require('md5');

//using bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User ({
      email: req.body.username,
      // password: md5(req.body.password)
      password: hash
    });

    newUser.save(function(err) {
      if(err){
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
});
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  // const password = md5(req.body.password);
  const password = req.body.password;
  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        // if (foundUser.password === password) {
        //   res.render("secrets");
        // }
        bcrypt.compare(password, foundUser.password, function(err, result) {

        if (result === true) {
          res.render("secrets");
        }
    });
  } //if
} //else
});//user.find
});











app.listen(3000, function(req, res) {
  console.log("Server started on port 3000");
});
