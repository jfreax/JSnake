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

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'JSnake'
  });
});

app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


io.sockets.on('connection', function(client) {
  client.on('message', function( data ) {

  });

});