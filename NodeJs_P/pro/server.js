var restify = require('restify');
var server = restify.createServer();
server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});


var conn_str = "Driver={SQL Server Native Client 11.0};Server=#{server}\\sql;Database=#{database};Uid=#{user};Pwd=#{password};"
function Employees(req, res, next) {
    res.header("Content-Type: application/json");
    // (Comment: Need to specify the Content-Type which is
    // JSON in our case. )
    sql.open(conn_str, function (err, conn) {
        if (err) {
           // (Comment: Logs an error)
            console.log("Error opening the database connection!");
            return;
        }
        console.log("before query!");
        conn.queryRaw("exec sp_GetEmployees", function (err, results) {
            if (err) {
    // (Comment: Connection is open but an error occurs while execution)
                console.log("Error running query!");
                return;
            }
            var result = []; 
            // (Comment: Declare an array for the result)
           for (var i = 0; i < results.rows.length; i++) {
            // (Comment: Regular 'for-loop' for displaying results)
result.push({
    id: results.rows[i][0], 
    lastName: results.rows[i][1] });
            }
            // (Commment: res - response from Restify. )
            res.send(result);
        });
        console.log("after query!");
    });
}

server.get('/data', Employees);