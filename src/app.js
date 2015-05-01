express = require('express.io');
redis = require('redis');

var app = express();
app.http().io();

app.use(express.cookieParser());
app.use(express.session({secret: 'testpass'}));

app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/../bower_components'));

var room = "public";
app.io.route('connection', function(req) {

	if(req.data=="")
		req.io.emit('prompt','Enter a username');

	else{

		req.io.join(room);

	    app.io.room(room).broadcast('announce',req.data + " has joined the chat.");
	}

	req.io.socket.on('username',function(user){

		req.io.join(room);

	    app.io.room(room).broadcast('announce',user + " has joined the chat.");


	});

	req.io.socket.on('message', function(msg){
		app.io.room(room).broadcast('message',{
												user: msg.user,
												message: msg.message
											  });
  	});

  	req.io.socket.on('leaving',function(msg){
  		req.io.room(room).broadcast('announce',msg.user + " has left the room.");
  	});

});

app.listen(7076);