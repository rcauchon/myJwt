// Service to get JWT 


//
// Example sur Medium Corporation
// https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e
// Check the below example also
// https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4
//
'use strict';

var express = require('express');
var app = express();

const fs = require('fs');
const jwt = require('jsonwebtoken');

// PAYLOAD
var payload = {
  data1: "Data 1",
  data2: "Data 2",
  data3: "Data 3",
  data4: "Data 4",
};

// PRIVATE and PUBLIC key
var privateKEY = fs.readFileSync('./keys/private.key', 'utf8');
var publicKEY = fs.readFileSync('./keys/public.key', 'utf8');

var i = 'Mysoft corp' ; // issuer
var s = 'some@user.com' // Subject
var a = 'http://mysoftcorp.in' // Audience

var e = "1h";

var signOptions = {
  issuer: i,
  subject: s,
  audience: a,
  expiresIn: e,
  algorithm: "RS256"
};

/*
  JWT Verify
*/
var verifyOptions = {
  issuer: i,
  subject: s,
  audience: a,
  expiresIn: e,
  algorithm: ["RS256"]
};

// Method get GENTOKEN
app.get('/genToken', function (req, res) {
  // Generate a token with the PRIVATE KEY
  var token = jwt.sign(payload, privateKEY, signOptions);
  res.send('Token: ' + token);
});

// Method get VERIFY
app.get('/verify', function (req, res) {

  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (typeof token === "undefined"){
    return res.json({success: false, message: 'Auth token is not supplied'});
  }
  if (token.startsWith('Bearer ')){
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, publicKEY, verifyOptions, (err, decoded)=>{
      if (err) {
        return res.json({success: false, message: 'Auth token is not valid: '+ err.message});
      } else {
        //req.decoded = decoded;
        return res.send('JWT verication result: ' + JSON.stringify(decoded));
      }
    }
  );
   
  } else {
    return res.json({success: false, message: 'Auth token is not supplied'});
  }
});

// Method Post LOGIN
app.post('/login', function (req, res) {

  let username = req.query.username;
  let password = req.query.password;

  // call the database to validate password
  let mockUsername = "admin";
  let mockPassword = "password";

  if (typeof username === "undefined" || typeof password === "undefined"){
    return res.status(400).json({success: false, message: 'Missing required parameters username and password'});
  }

  if (username && password) {
    if (username === mockUsername && password === mockPassword){
      var token = jwt.sign({username: username}, privateKEY, signOptions);
      return res.status(200).json({
        success: true,
        message: 'Authentication successful!',
        token: token
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Incorrect username or password'
      });
    }
  } 
});

// Listen port : 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});