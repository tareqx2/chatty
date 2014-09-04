express = require('express.io');

var app = express();
app.http().io();
console.log(__dirname);
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/../bower_components'));

app.io.route('connection', function(req) {
	req.io.emit('message', 'sup nerd');

	req.io.socket.on('message', function(msg){
    	console.log('message: ' + msg);

  	});

});



app.listen(7076);