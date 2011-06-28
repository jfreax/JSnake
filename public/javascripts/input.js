function bindKeyboard() {
  $(document).keydown(function(e) {
    switch( e.keyCode ) {
      case 40:
        if( isMenu ) {
          multiplayer.attr("stroke", "#000").attr("stroke-width", "3");
          singleplayer.attr("stroke", "#000").attr("stroke-width", "0");
          isMultiplayer = true;
        } else {
          snake.changeDirection( south );
        }
        break;
      case 38:
        if( isMenu ) {
          singleplayer.attr("stroke", "#000").attr("stroke-width", "3");
          multiplayer.attr("stroke", "#000").attr("stroke-width", "0");
          isMultiplayer = false;
        } else {
          snake.changeDirection( north );
        }
        break;
      case 37:
        snake.changeDirection( west );
        break;
      case 39:
        snake.changeDirection( east );
        break;
      case 13: // Enter
        if( isMenu ) {
          startGame();
        }
        break;
      case 80: // 'p'
        togglePause();
        break;
    }
  });
};