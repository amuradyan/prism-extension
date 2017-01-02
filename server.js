'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var logger = require('mongo-morgan-ext');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

var upload = multer({storage: storage});
//var upload = multer({ dest: 'uploads/' });

var app = express();
var port = process.env.PORT || 5000;

morgan('combined', {
    skip: function (req, res) {
        return res.statusCode < 400
    }
});

app.use(morgan('combined'));

// var db = 'mongodb://localhost:27017/weedBook';
// var collection = 'Logs';
// var skipfunction = function(req, res) {
//     return res.statusCode > 399; //Thiw would skip if HTTP request response is less than 399 i.e no errors.
// };

//app.use(logger(db,collection,skipfunction));

app.post('/photo', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    //next();
    res.send("fff");
});


//app.use(express.static('public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var wbRouter = require('./server/routes/wbRoutes')();

//route for api
app.use('/api', wbRouter);


//start static routing
//var rootPath = path.normalize(__dirname + '/../');

console.log(__dirname);
var rootPath = __dirname;
app.use(express.static(rootPath + '/extension'));
app.get('/', function (req, res) {
    res.sendFile(rootPath + '/extension/popup.html');
});

//end static routing


app.listen(port, function (err) {
    console.log('running server on port ' + port);
});