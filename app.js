/**
 * Module dependencies.
 */
var express = require('express')
, app = module.exports = express.createServer()
, io = require('socket.io').listen(app);


/**
 * Configuration
 */
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view options', {layout: false});
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


/**
 * Routes
 */
app.get('/', function(req, res){
  res.render('index', {
    title: 'JSnake'
  });
});

app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


/**
 * Globals
 */
var waiting = null;
var players = [];



io.sockets.on('connection', function(client) {
  client.on('wantMulti', function( data ) {
     if( waiting === null ) {
       waiting = client;
     } else {
        newGame = { c1: waiting, c2: client };
        players.pop( newGame );
        waiting = null;
        
        // prepare the snakes for both players
        var snake = {
          blocks:    [],
          position:  { x: 5, y: 5 },
          width:     16,
          height:     16,
          direction: east
        };
        
        newGame.c1.emit('go');
        newGame.c2.emit('go');
     }
  });

});