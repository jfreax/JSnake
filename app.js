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


/**
 * "Enums"
 */
var east = { x: 1, y: 0 };
var west = { x: -1, y: 0 };
var north = { x: 0, y: -1 };
var south = { x: 0, y: 1 };


/**
 * Prototypes
 */
function SnakeTransport()
{
  this.color     = [];
  this.blocks    = [];
  this.direction = [];
  this.position  = null;
};


/**
 * Socket.io
 */
io.sockets.on('connection', function(client) {
  client.on('wantMulti', function( data ) {
     if( waiting === null ) {
       waiting = client;
     } else {
        newGame = { c1: waiting, c2: client };
        players.pop( newGame );
        waiting = null;
        
        var player1 = new SnakeTransport();
        var player2 = new SnakeTransport();
        
        player1.color = "#00F";
        player1.blocks = [[5,5],[6,5],[7,5]];
        player1.direction = east;
        player1.position = { x: 7, y: 5 };
        
        player2.color = "#F00";
        player2.blocks = [[22,5],[21,5],[20,5]];
        player2.direction = west;
        player2.position = { x: 20, y: 5 };
        
        player1JSON = JSON.stringify(player1);
        player2JSON = JSON.stringify(player2);
        
        newGame.c1.emit( 'setSnakes', player1JSON, player2JSON );
        newGame.c2.emit( 'setSnakes', player2JSON, player1JSON);
     }
  });

});