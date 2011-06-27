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
 * Functions
 */
function GetUserByID( idIAmLookingFor, callback ) // deprecated
{
  io.store.clients(function (ids) {
    ids.forEach( function ( id ) {
      if ( id == idIAmLookingFor ) {
        callback( io.store.client(id) );
        return; 
      }
    });

  });
  return 0; // Ohh ooh O.o
}

/**
 * Socket.io
 */
io.sockets.on('connection', function(client) {
  client.on('wantMulti', function( data ) {
     if( waiting === null ) {
       waiting = client;
     } else {
        // Save player sockets
        var localWaiting = waiting;
        waiting = null;
        
        var player1 = new SnakeTransport();
        var player2 = new SnakeTransport();
        
        // Create start snakes
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
        
        // Send start snakes
        client.emit( 'setSnakes', player1JSON, player2JSON );
        localWaiting.emit( 'setSnakes', player2JSON, player1JSON );
        
        // Store opponent player ids
        client.set('opponent', localWaiting, function () {
            //console.log( "Set opponent: ", waitingUser );
          client.emit('ready');
        });
        localWaiting.set('opponent', client, function () {
          //console.log( "Set opponent2: ", client );
          localWaiting.emit('ready');
        });
        
        // Save some general variables
        client.set( 'pause', true );
        localWaiting.set( 'pause', true );
        
     }
  });
  
  
  // Change opponents direction
  client.on('chDir', function( direction ) {
    client.get('opponent', function ( err, opponent ) {   
      opponent.emit( 'chDir', direction );
    });
  });
  
  // Toggle between pause and play
  client.on('togglePause', function( direction ) {
    client.get('pause', function ( err, pause ) {

      client.get('opponent', function ( err, opponent ) {
        client.emit( 'togglePause', !pause );
        opponent.emit( 'togglePause', !pause );
        
        client.set('pause', !pause );
        opponent.set('pause', !pause );
      });
      
    });
  });
  
  client.on('disconnect', function () {
    console.log("Ohh fuck, und weg...");
  });
  
  
  client.on('connect', function () {
    console.log("Gut, gut, wieder da :) ...");
  });

});

  