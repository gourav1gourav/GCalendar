var express = require('express');
var app = express();
const path = require('path');
const connections= require('./../DB/connection');
const UserCalendar= require('../src/All_API/user');
const bodyParser = require("body-parser");
const route= express.Router();
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', route);
console.log("*****************************************************",UserCalendar.userCalendarfun);
connections.connectDB();
// This responds with "Hello World" on the homepage
app.get('/test', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('Hello GET');
})

app.use(express.static(path.join(__dirname, './../build')))

app.use('/api/usermodel',  require('../src/All_API/user'));
app.use(express.json({extended:false}));
app.get('/ping', (req, res) => {
  return res.send('pong')
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './../build', 'index.html'))
})

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})