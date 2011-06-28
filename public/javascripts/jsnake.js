var east = { x: 1, y: 0 };
var west = { x: -1, y: 0 };
var north = { x: 0, y: -1 };
var south = { x: 0, y: 1 };


function opposite( dir )
{
  switch( dir ) {
    case north:
      return south;
      break;
    case south:
      return north;
      break;
    case west:
      return east;
      break;
    case east:
      return west;
      break;
  }
}


function SnakeTransport()
{
  this.color     = [];
  this.blocks    = [];
  this.direction = [];
  this.position  = null;
};


function Snake()
{
  this.color    = "#f00";
  this.blocks   = [];
  this.position = { x: 5, y: 5 };
  this.width    = 16;
  this.height   =  16;
  this.direction= east;
  
  this.init = function( JSONSnake ) {
    this.blocks.length = this.length = 0;
    
    if( JSONSnake === undefined ) {
      for ( var i = 0; i < 3; ++i ) {
        this.addBlock();
      }
    } else {
      console.log( "Init snake from server" );
      var tSnake = $.parseJSON( JSONSnake );
      this.color     = tSnake.color;
      this.direction = tSnake.direction;
      this.position  = tSnake.position;
      
      for (var i = 0; i < tSnake.blocks.length; ++i) {
        console.log("Set block on x pos: ", tSnake.blocks[i][0] );
        var c = gameBoard.rect( tSnake.blocks[i][0] * this.width+3, tSnake.blocks[i][1] * this.height+3, this.width, this.height, 3 );
        c.attr("fill", this.color);
        c.attr("stroke", "#333");
        this.blocks.unshift( c );
      }
    }
  };
  
  
  this.remove = function() {
    console.log("Remove!");
    for (var i = 0; i < this.blocks.length; ++i) {
      this.blocks[i].remove();
    }
  }
  
  
  this.addBlock = function() {
    var x = this.position.x + this.direction.x;
    var y = this.position.y + this.direction.y;
    
    if( x >= gameBoard.sizeX )
      x = 0;
    if( y >= gameBoard.sizeY )
      y = 0;
    if( x < 0 )
      x = gameBoard.sizeX-1;
    if( y < 0 )
      y = gameBoard.sizeY-1;
    
    var c = gameBoard.rect( x * this.width+3, y * this.height+3, this.width, this.height, 3 );
    c.attr("fill", this.color);
    c.attr("stroke", "#333");
    
    this.blocks.unshift( c );
    
    this.position.x = x;
    this.position.y = y;
  };
  
  this.move = function() {
    this.blocks.pop().remove();
    this.addBlock();
  };
  
  this.changeDirection = function( direction ) {
    if ( snake.direction != opposite(direction) ) {
      snake.direction = direction;
      socket.emit( 'chDir', direction );
    }
  };
};


function Game()
{
  this.play = function() {
    snake.move();
    if( isMultiplayer )
      snake2.move();
  };
  
  
  this.synchronize = function() {
    socket.emit( 'synchronize', snake.position );
  }
  
};
