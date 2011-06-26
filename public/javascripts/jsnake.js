function Snake()
{
  this.blocks   = [];
  this.position = { x: 5, y: 5 };
  this.width    = 16;
  this.height   =  16;
  this.direction= east;
  
  this.init = function() {
    this.blocks.length = this.length = 0;
    
    for ( var i = 0; i < 3; ++i ) {
      this.addBlock();
    }
  };
  
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
    
    var c = gameBoard.rect( x * this.width+3, y * this.height+3, this.width, this.height, 3 )
    c.attr("fill", "#f00");
    c.attr("stroke", "#333");
    
    this.blocks.unshift( c );
    
    this.position.x = x;
    this.position.y = y;
  };
  
  this.move = function() {
    console.log("Move: ", this);
    this.blocks.pop().remove();
    this.addBlock();
  };
};