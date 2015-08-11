var app   = require('express')();
var http = require('http').Server(app);
var mysql = require('mysql');
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

	
app.get('/',function(req,res){
	var data = {
		
	};
	data = "Welcome to Book Store DEMO...";
	res.json(data);
});
process.on('uncaughtException', function (error) {
   console.log(error.stack);
});

var db_config = {
		host     : 'media.zeboba.com',
		user     : 'root',
		password : '0909@BLUEzeboba',
		database : 'geotracer',
};

var con = mysql.createPool(db_config);
con.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});
app.get('/stream',function(req,res){
		var deviceName = req.query.devicename;
	var data = {"error":1,"geo_details":""};
	//data["devicename"] = req.query.devicename;
	//console.log(deviceName);
	if(!!deviceName)
	{
		con.getConnection(function(err, connection){
			var sqlQuery = 'select tracking.latitude,tracking.longitude,tracking.dateTime as "trackingtime", devices.devicename  from tracking, devices where latitude!=0 and longitude!=0 and tracking.deviceId = devices.id  and devices.devicename='+ connection.escape(deviceName) +' ORDER BY dateTime DESC LIMIT 1' ;
		connection.query(sqlQuery,function(err, rows, fields){
			connection.release();
			if(!rows)
			{
				console.log("Error in app");
			}
			if(!err){
				//console.log(rows[0]);
				data["error"] = 0;
				data["geo_details"] = rows;
				res.json(data);
			}else{
				data["geo_details"] = err;
				res.json(data);
			}
						
	});

		});
	}
	else
	{
		data["geo_details"] = "Api request invalid";
			res.json(data);
	}
});

http.listen(8080,function(){
	console.log("Connected & Listen to port 8080");
});