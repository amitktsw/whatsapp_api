var mysql = require('mysql');

var con = mysql.createConnection({
  host: "tswserver.theworkpc.com",
  user: "amitktsw",
  password: "Hawamahal@12#"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
