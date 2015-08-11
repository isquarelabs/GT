var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();      
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    //console.log(req);
    next(); // make sure we go to the next routes and don't stop here
});
router.get('/healthcheck', function(req, res) {
    res.json({ message: 'Api is working perfectly...' });   
});
// router.get('/oget', function(req, res) {
    // //res.json({ message : req.query.fType}); 
// //res.json({ message : req.query.fromid});	
// getTweets(req, res);
// });
router.get('/oget', getTweets);
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

function getTweets(req, res, next)
{
var sql = require('mssql'); 

var config = {
    user: 'twitrapuser',
    password: 'Pr@ket@1@',
    //server: 'Praketa\\sql',
server: '184.168.194.55',
// You can use 'localhost\\instance' to connect to named instance
    database: 'TRDB2015',
	// driver: 'tedious'

    options: {
         max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}
console.log(req.query.ftype);
console.log(req.query.fromid);
var connection = new sql.Connection(config, function(err) {
if(err)
throw err;


var data = [];
    var request = new sql.Request(connection);
	request.multiple = true;
    request.input('fType', sql.Int, req.query.ftype);
	request.input('fromId', sql.Int, req.query.fromid);
    //request.output('output_parameter', sql.VarChar(50));
    request.execute('dbo.USP_FetchCATLoveTweets', function(err, recordsets, returnValue) {
        // ... error checks
        //console.dir(recordsets);
if(err)
throw err;

 // for(var i = 0; i < recordsets.length; i++) {
                 // data.push({
                // results: recordsets[0][i]
            // });
               // // console.log(i + ": " + "Culture = " + result.rows[i][1]);
              // // console.log(i + ": " + "Value = " + result.rows[i][2]);
         // }
		 res.json(recordsets[0] );
		 //response.send(data);
    });
 connection.close();
});
}
