express = require('express.io');
redis = require('redis');

RedisStore = express.io.RedisStore;

var app = express();
app.http().io();
workers = function() {

	app.io.set('store', new express.io.RedisStore({
	    redisPub: redis.createClient(),
	    redisSub: redis.createClient(),
	    redisClient: redis.createClient()
	}));

	app.use(express.static(__dirname + '/'));
	app.use(express.static(__dirname + '/../bower_components'));

	var room = "public";
	app.io.route('connection', function(req) {
		
		req.io.socket.on('message', function(msg){
			app.io.room(room).broadcast('message',{
													user: msg.user,
													message: msg.message
												  });
	  	});

	  	req.io.socket.on('leaving',function(msg){
	  		req.io.room(room).broadcast('announce',msg.user + " has left the room.");
	  	})

		req.io.join(room);
		if(req.data==null)
			req.data = "anonymous";
	    app.io.room(room).broadcast('announce',req.data + " has joined the chat.");

	});

	app.listen(7076);

}

cluster = require('cluster');
numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) { cluster.fork() }
} else { workers() }