


//////////////////////////////
// INITIALIZATION
/////////////////////////////

var my_game = 0;
var height = 0;
var width = 0;
var current_index = 0;
var left_index = 0;
var right_index = 0;
var spots = [];
var facing = "";
var num_dots = 0;
var my_dots = 0;

$(document).ready(function(){
	get_divs("input/divs/board1.txt");
	start("input/boards/board1.txt");
});

function assign_spots() {
	var num = height * width;
	var name = "";
	for (var i = 0; i < num; i++){
		name = "#tile" + i;
		$(name).attr("src", spots[i].img_src);
	}
};

//////////////////////////////
// SPOT ON BOARD
/////////////////////////////

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

function get_image_src(type_in){
	switch(type_in){

		case SpotType.LEFT:
		case SpotType.RIGHT:
		case SpotType.EMPTY:
			return "tiles/empty.png";
		break;

		case SpotType.WALL:
			return "tiles/wall.png";
		break;

		case SpotType.PACDOT1:
			return "tiles/pacdot1.png";
		break;

		case SpotType.PACDOT2:
			return "tiles/pacdot2.png";
		break;

		case SpotType.GHOST:
			return "tiles/ghost.png";
		break;

		case SpotType.BLUE_GHOST:
			return "tiles/blue_ghost.png";
		break;

		case SpotType.PLAYER:
			switch (facing){
				case "up":
					return "tiles/player_up.png";
				break;

				case "down":
					return "tiles/player_down.png";
				break;

				case "left":
					return "tiles/player_left.png";
				break;

				case "right":
					return "tiles/player_right.png";
				break;

				default:
					return "tiles/player.png";
				break;
			}	
		break;

		default:
			// error?
			return "tiles/empty.png";
		break;
	}
};

var Spot = function(type_in, index_in, x_in, y_in) {
	this.type = type_in;
	this.index = index_in;
	this.x = x_in;
	this.y = y_in;
	this.img_src = get_image_src(type_in);
	this.id = "#tile" + index_in;
};

Spot.prototype.type = SpotType.EMPTY;
Spot.prototype.index = 0;
Spot.prototype.id = 0;
Spot.prototype.x = 0;
Spot.prototype.y = 0;
Spot.prototype.img_src = "";


//////////////////////////////
// BOARD
/////////////////////////////

function get_type(type_in) {
	// switch statement
	switch(type_in){

		case "_":
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

		case "L":
			return SpotType.LEFT;
		break;

		case "R":
			return SpotType.RIGHT;
		break;

		default:
			// error?
			return SpotType.EMPTY;
		break;
	}
};

function initialize_game(height_in, width_in, spots_in) {
	window.height = height_in;
	window.width = width_in;
	var curr_spot = 0;
	for (var h = 0; h < height; h++){
		for (var w = 0; w < width; w++){
			var type = get_type(spots_in[curr_spot]);
			if (type == SpotType.PLAYER){
				current_index = curr_spot;
			}
			if (type == SpotType.LEFT){
				left_index = curr_spot;
			}
			if (type == SpotType.RIGHT){
				right_index = curr_spot;
			}
			if (type == SpotType.PACDOT1 || type == SpotType.PACDOT2){
				window.num_dots += 1;
			}
			var new_spot = new Spot(type, curr_spot, w, h);
			window.spots.push(new_spot);
			curr_spot++;
		}
	}
	assign_spots();
};


function update_spot(index, new_type){
	if (index != left_index && index != right_index) {
		window.spots[index].type = new_type;
	}
	window.spots[index].img_src = get_image_src(new_type);
	$(spots[index].id).attr("src", spots[index].img_src);
}

function get_index(x,y){
	return ((y * width) + x);
};

function up_spot(){
	if (spots[current_index].y == 0){
		return spots[current_index];
	}
	else {
		return spots[get_index(
			spots[current_index].x,
			spots[current_index].y - 1)];
	}
};

function down_spot(){
	if (spots[current_index].y == height-1){
		return spots[current_index];
	}
	else {
		return spots[get_index(
			spots[current_index].x,
			spots[current_index].y + 1)];
	}
};

function left_spot(){
	if (spots[current_index].type == SpotType.LEFT){
		// wrap around to other side of board
		return spots[get_index(
			(width - 1), 
			spots[current_index].y)];
	}
	else if (spots[current_index].x == 0){
		return spots[current_index];
	}
	else {
		return spots[get_index(
			spots[current_index].x - 1,
			spots[current_index].y)];
	}
};

function right_spot(){
	if (spots[current_index].type == SpotType.RIGHT){
		// wrap around to other side of board
		return spots[get_index(
			0, spots[current_index].y)];
	}
	else if (spots[current_index].x == width-1){
		return spots[current_index];
	}
	else {
		return spots[get_index(
			spots[current_index].x + 1,
			spots[current_index].y)];
	}
};


var Game = function() {};
var Game = function(text) {
	var values = text.split('\n');
	// make board
	initialize_game(values[0], values[1], values[2]);
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
			new_spot = up_spot();
		break;

		case "down":
			new_spot = down_spot();
		break;

		case "left":
			new_spot = left_spot();
		break;

		case "right":
			new_spot = right_spot();
		break;

		default:
			// error?
		break;
	}

	console.log(spots[current_index]);
	console.log(new_spot);

	switch(new_spot.type){
		
		case SpotType.WALL:
			// can't move
			// stay where you are
		break;

		case SpotType.LEFT:
		case SpotType.RIGHT:
		case SpotType.PLAYER:
		case SpotType.EMPTY:
			// make new spot player type
			facing = direction;
			update_spot(new_spot.index, SpotType.PLAYER);
			// make old spot empty
			update_spot(current_index, SpotType.EMPTY);
			current_index = new_spot.index;
		break;

		case SpotType.PACDOT1:
			// erase dot
			my_dots += 1;
			// collect point
			// make new spot player type
			facing = direction;
			update_spot(new_spot.index, SpotType.PLAYER);
			// make old spot empty
			update_spot(current_index, SpotType.EMPTY);
			current_index = new_spot.index;
			if (my_dots == num_dots){
				win();
			}
		break;

		case SpotType.PACDOT2:
			// erase dot
			my_dots += 1;
			// collect points
			// turn ghosts blue
			// make new spot player type
			facing = direction;
			update_spot(new_spot.index, SpotType.PLAYER);
			// make old spot empty
			update_spot(current_index, SpotType.EMPTY);
			current_index = new_spot.index;
			if (my_dots == num_dots){
				win();
			}
		break;

		case SpotType.GHOST:
			// die
			// lose points
			// make old spot empty
			facing = "";
			update_spot(current_index, SpotType.EMPTY);
			// reset back at start spot
			update_spot(get_index(start_x, start_y), SpotType.PLAYER);
			// enemies are back in center
		break;

		case SpotType.BLUE_GHOST:
			// eat the ghost
			// collect points
			// make new spot player type
			facing = direction;
			update_spot(new_spot.index, SpotType.PLAYER);
			// make old spot empty
			update_spot(current_index, SpotType.EMPTY);
			current_index = new_spot.index;
		break;
	}
};


//////////////////////////////
// WIN!
//////////////////////////////

function win(){
	
}



//////////////////////////////
// READING FILES
//////////////////////////////

function get_divs(filename){
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
				$("#board").html(data);
			}
		}
	});	
}

function start(filename){
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
				my_game = new Game(data);
			}
		}
	});
}







