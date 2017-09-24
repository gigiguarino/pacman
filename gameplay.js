
//////////////////////////////
// DEFINES
/////////////////////////////

var start_x = 9;
var start_y = 15;
var height = 21;
var width = 19;


//////////////////////////////
// INITIALIZATION
/////////////////////////////

var my_game = 0;

$(document).ready(function(){
	get_divs("divs/div1.txt");
	start("boards/board1.txt");
});

//////////////////////////////
// SPOT ON BOARD
/////////////////////////////

function get_image_src(type_in){
	switch(type_in){

		case LEFT:
		case RIGHT:
		case EMPTY:
			return "beta_tiles/empty.png";
		break;

		case WALL:
			return "beta_tiles/wall.png";
		break;

		case PACDOT1:
			return "beta_tiles/pacdot1.png";
		break;

		case PACDOT2:
			return "beta_tiles/pacdot2.png";
		break;

		case GHOST:
			return "beta_tiles/ghost.png";
		break;

		case BLUE_GHOST:
			return "beta_tiles/blue_ghost.png";
		break;

		default:
			// error?
			return "beta_tiles/empty.png";
		break;
	}
};

SpotType = {
	EMPTY 		: 0,
	WALL 		: 1,
	PACDOT1		: 2,
	PACDOT2 	: 3,
	GHOST		: 4,
	BLUE_GHOST	: 5,
	PLAYER		: 6,
	LEFT 		: 7,
	RIGHT 		: 8
}

var Spot = function(type_in, index_in, x_in, y_in) {
	this.type = type_in;
	this.index = index_in;
	this.x = x_in;
	this.y = y_in;
	this.img_src = get_image_src(type_in);
};

Spot.prototype.type = SpotType.EMPTY;
Spot.prototype.index = 0;
Spot.prototype.x = 0;
Spot.prototype.y = 0;
Spot.prototype.img_src = "";




//////////////////////////////
// BOARD
/////////////////////////////

function get_type(type_in) {
	// switch statement
	switch(type_in){

		case " ":
			return SpotType.EMPTY;
		break;

		case "X":
			return SpotType.WALL;
		break;

		case ".":
			return SpotType.PACDOT1;
		break;

		case "o":
			return SpotType.PACDOT2;
		break;

		case "G":
			return SpotType.GHOST;
		break;

		case "B":
			return SpotType.BLUE_GHOST;
		break;

		case "P":
			return SpotType.PLAYER;
		break;

		default:
			// error?
			return SpotType.EMPTY;
		break;
	}
};

Board.prototype.height = 0;
Board.prototype.width = 0;
Board.prototype.current_spot = 0;
Board.prototype.spots = [];

Board.prototype.update_spot = function(index, new_type){
	this.spots[index].type = new_type;
	this.spots[index].img_src = get_image_src(new_type);
}

Board.prototype.get_index = function(x,y){
	return ((x * this.height) + y);
};

Board.prototype.up_spot = function() {
	if (this.current_spot.y == 0){
		return spots[this.current_spot.index];
	}
	else {
		return spots[this.get_index(
			this.current_spot.x,
			this.current_spot.y - 1)];
	}
};

Board.prototype.down_spot = function() {
	if (this.current_spot.y == this.height-1){
		return spots[this.current_spot.index];
	}
	else {
		return spots[this.get_index(
			this.current_spot.x,
			this.current_spot.y + 1)];
	}
};

Board.prototype.left_spot = function() {
	if (spots[this.current_spot.index].type == SpotType.LEFT){
		// wrap around to other side of board
		return spots[this.get_index(
			(this.width - 1), 
			this.current_spot.y)];
	}
	else if (this.current_spot.x == 0){
		return spots[this.current_spot.index];
	}
	else {
		return spots[this.get_index(
			this.current_spot.x - 1,
			this.current_spot.y)];
	}
};

Board.prototype.right_spot = function() {
	if (spots[this.current_spot.index].type == SpotType.RIGHT){
		// wrap around to other side of board
		return spots[this.get_index(
			0, this.current_spot.y)];
	}
	else if (this.current_spot.x == this.width-1){
		return spots[this.current_spot.index];
	}
	else {
		return spots[this.get_index(
			this.current_spot.x + 1),
			this.current_spot.y];
	}
};


var Board = function() {};
var Board = function(height_in, width_in, x_in, y_in, spots_in) {
	this.height = height_in;
	this.width = width_in;
	var curr_spot = 0;
	for (var h = 0; h < this.height; h++){
		for (var w = 0; w < this.width; w++){
			
			if (x_in == w && y_in == h){
				this.current_index = curr_spot;
			}

			var type = get_type(spots_in[curr_spot]);
			var new_spot = new Spot(type, curr_spot, h, w);
			this.spots.push(new_spot);
			curr_spot++;
		}
	}
};


//////////////////////////////
// CONTROLS
//////////////////////////////

$(document).keydown(function(e){

	switch(e.keyCode){
		case 13:
			// enter
		break;

		case 38:
			// up
			my_game.move("up");
		break;

		case 40:
			// down
			my_game.move("down");
		break;

		case 39:
			// right
			my_game.move("right");
		break;

		case 37:
			// left
			my_game.move("left");
		break;

		case 32:
			// space
		break;

		default:
		break;
	}
});

Game.prototype.move = function(direction) {
	var new_spot = 0;

	switch(direction){

		case "up":
			new_spot = board.up_spot;
		break;

		case "down":
			new_spot = board.down_spot;
		break;

		case "left":
			new_spot = board.left_spot;
		break;

		case "right":
			new_spot = board.right_spot;
		break;

		default:
			// error?
		break;
	}

	switch(new_spot.type){
		
		case SpotType.WALL:
			// can't move
			// stay where you are
		break;

		case SpotType.PLAYER:
		case SpotType.EMPTY:
			// make new spot player type
			this.board.update_spot(new_spot.index, SpotType.PLAYER);
			// make old spot empty
			this.board.update_spot(this.board.current_spot.index, SpotType.EMPTY);
			this.board.current_spot = new_spot;
		break;

		case SpotType.PACDOT1:
			// erase dot
			// collect point
			// make new spot player type
			this.board.update_spot(new_spot.index, SpotType.PLAYER);
			// make old spot empty
			this.board.update_spot(this.board.current_spot.index, SpotType.EMPTY);
			this.board.current_spot = new_spot;

		break;

		case SpotType.PACDOT2:
			// erase dot
			// collect points
			// turn ghosts blue
			// make new spot player type 
			this.board.update_spot(new_spot.index, SpotType.PLAYER);
			// make old spot empty
			this.board.update_spot(this.board.current_spot.index, SpotType.EMPTY);
			this.board.current_spot = new_spot;
		break;

		case SpotType.GHOST:
			// die
			// lose points
			// make old spot empty
			this.board.update_spot(this.board.current_spot.index, SpotType.EMPTY);
			// reset back at start spot
			this.board.update_spot(get_index(start_x, start_y), SpotType.PLAYER);
			// enemies are back in center
		break;

		case SpotType.BLUE_GHOST:
			// eat the ghost
			// collect points
			// make old spot empty
			// make new spot player type
		break;
	}
};


//////////////////////////////
// GAME
//////////////////////////////

Game.prototype.board = 0;

var Game = function() {};
var Game = function(text) {

	// remove newlines from text
	var new_text = text.replace(/\n/g, "");
	// make board
	this.board = new Board(height, width, start_x, start_y, new_text);
};

function get_divs(filename){
	var text = "";
	$.ajax({
		url: filename,
		dataType: "text",
		success: function (data) {
			if (data == ""){
				// nothing in file?
				// error?
				alert("error?");
			}
			else{
				alert(data);
				text = data;
			}
		}
	});

	$("#board").html(text);
}

function start(filename){
	var text = "";
	$.ajax({
		url: filename,
		dataType: "text",
		success: function (data) {
			if (data == ""){
				// nothing in file?
				// error?
				alert("error?");
			}
			else{
				alert(data);
				text = data;
			}
		}
	});

	my_game = new Game(text);
}







