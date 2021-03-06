// import modules
var express = require('express'), // npm install express
    app = express(),
    async = require('async'),
    fs = require("fs"),
    readfile = require('./server/readfile.js');



//app.get('/crawler', crawlerExpressHandler.callback);

/*
app.get('/project', function(){
    setTimeout(function() {
        res.setHeader('transfer-encoding', 'chunked');
        res.status(200);
        util.log("timeout")
        res.write("hello world");
        res.end();
    }, 3 * 60 * 1000)
});
*/

app.get('/compare', readfile.callback);


var port = process.env.PORT || 4000;

app.listen(port, function () {
    console.log("Express server listening on port %d", port);
});

app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/html/'));

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});