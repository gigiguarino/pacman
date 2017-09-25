


//////////////////////////////
// INITIALIZATION
/////////////////////////////

var my_game = 0;
var done = false;
var height = 0;
var width = 0;

var current_index = 0;
var left_index = 0;
var start_index = 0;
var right_index = 0;

var moves_since_blue = 0;
var blue_ghost = false;

var facing = "";
var previous_key = 0;

var num_dots = 0;
var my_dots = 0;

var spots = [];
var ghosts = [];
var ghost_under_types = [];


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
	PACDOT1 	: 1,
	PACDOT2		: 2,
	WALL 		: 3,
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

function turn_ghosts_red(){
	for(var i = 0; i < ghosts.length; i++){
		ghosts[i].type = SpotType.GHOST;
		ghosts[i].img_src = get_image_src(SpotType.GHOST);
		spots[ghosts[i].index].type = SpotType.GHOST;
		$(ghosts[i].id).attr("src", ghosts[i].img_src);
	}
};

function turn_ghosts_blue(){
	for(var i = 0; i < ghosts.length; i++){
		ghosts[i].type = SpotType.BLUE_GHOST;
		ghosts[i].img_src = get_image_src(SpotType.BLUE_GHOST);
		spots[ghosts[i].index].type = SpotType.BLUE_GHOST;
		$(ghosts[i].id).attr("src", ghosts[i].img_src);
	}
	moves_since_blue = 10;
	blue_ghost = true;
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
			var new_ghost = 0;
			switch (type){

				case SpotType.PLAYER:
					current_index = curr_spot;
					start_index = curr_spot;
				break;

				case SpotType.LEFT:
					left_index = curr_spot;
				break;

				case SpotType.RIGHT:
					right_index = curr_spot;
				break;

				case SpotType.PACDOT1:
				case SpotType.PACDOT2:
					window.num_dots += 1;
				break;

				case SpotType.GHOST:
					new_ghost = new Spot(type, curr_spot, w, h);
					window.ghosts.push(new_ghost);
					window.ghost_under_types.push(SpotType.EMPTY);
				break;

				default:
				break;
			}
			var new_spot = new Spot(type, curr_spot, w, h);
			window.spots.push(new_spot);
			curr_spot++;
		}
	}
	assign_spots();
};


function update_spot(index, new_type){
	console.log(index + " " + new_type);
	if (index != left_index && index != right_index) {
		window.spots[index].type = new_type;
	}
	window.spots[index].img_src = get_image_src(new_type);
	$(spots[index].id).attr("src", spots[index].img_src);
}

function get_index(x,y){
	return ((y * width) + x);
};

function up_spot(index){
	if (spots[index].y == 0){
		return spots[index];
	}
	else {
		return spots[get_index(
			spots[index].x,
			spots[index].y - 1)];
	}
};

function down_spot(index){
	if (spots[current_index].y == height-1){
		return spots[index];
	}
	else {
		return spots[get_index(
			spots[index].x,
			spots[index].y + 1)];
	}
};

function left_spot(index){
	if (spots[current_index].type == SpotType.LEFT){
		// wrap around to other side of board
		return spots[get_index(
			(width - 1), 
			spots[index].y)];
	}
	else if (spots[index].x == 0){
		return spots[index];
	}
	else {
		return spots[get_index(
			spots[index].x - 1,
			spots[index].y)];
	}
};

function right_spot(index){
	if (spots[index].type == SpotType.RIGHT){
		// wrap around to other side of board
		return spots[get_index(
			0, spots[index].y)];
	}
	else if (spots[index].x == width-1){
		return spots[index];
	}
	else {
		return spots[get_index(
			spots[index].x + 1,
			spots[index].y)];
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


function check_this_spot(key){
	switch(key){
		case "up":
		break;
		case "down":
		break;
		case "left":
		break;
		case "right":
		break;
		default:
		break;
	}
}

function move_ghosts() {
	// blue ghosts move two times slower
	var left = 0;
	var up = 0;
	var down = 0;
	var right = 0;
	var idx = 0;
	var new_spot = 0;
	var placeholder = 0;
	if (moves_since_blue%2 == 0){
		// move blue ghosts every two times
		// move red ghosts always 
		for (var i = 0; i < ghosts.length; i++){
			idx = ghosts[i].index;
			left = left_spot(idx);
			up = up_spot(idx);
			down = down_spot(idx);
			right = right_spot(idx);
			if (ghosts[i].index > current_index){
				// up > left > right > down
				if (up.type != SpotType.WALL && left.type != SpotType.WALL){
					if ((ghosts[i].index - current_index) > 150){
						new_spot = up;
					}
					else {
						new_spot = left;
					}
				}
				else if (up.type != SpotType.WALL){
					new_spot = up;
				}
				else if (left.type != SpotType.WALL){
					new_spot = left;
				}
				else if (right.type != SpotType.WALL){
					new_spot = right;
				}
				else if (down.type != SpotType.WALL){
					new_spot = down;
				}
			} 
			else {
				if (down.type != SpotType.WALL && right.type != SpotType.WALL){
					if ((current_index - ghosts[i].index) > 150){
						new_spot = down;
					}
					else {
						new_spot = right;
					}
				}
				else if (down.type != SpotType.WALL){
					new_spot = down;
				}
				else if (right.type != SpotType.WALL){
					new_spot = right;
				}
				else if (left.type != SpotType.WALL){
					new_spot = left;
				}
				else if (up.type != SpotType.WALL){
					new_spot = up;
				}
			}
			placeholder = new_spot.type;
			// update new spot with ghost image
			update_spot(new_spot.index, ghosts[i].type);
			// update old spot with pacdot if there was one there before
			// update old spot with empty if there wasnt one
			update_spot(window.ghosts[i].index, ghost_under_types[i]);
			ghost_under_types[i] = placeholder;
			// update ghosts position
			window.ghosts[i].x = new_spot.x;
			window.ghosts[i].y = new_spot.y;
			window.ghosts[i].index = new_spot.index;
			window.ghosts[i].id = new_spot.id;
		}
	}
};

Game.prototype.move = function(direction) {
	var new_spot = 0;
	var checked = true;
	var placeholder = 0;

	if (moves_since_blue == 0 && blue_ghost){
		blue_ghost = false;
		turn_ghosts_red();
	} 
	else if (blue_ghost){
		moves_since_blue -= 1;
	}


	while (checked){
		switch(direction){

			case "up":
				if (previous_key == 0){
					previous_key = direction;
				}
				new_spot = up_spot(current_index);
			break;

			case "down":
				if (previous_key == 0){
					previous_key = direction;
				}
				new_spot = down_spot(current_index);
			break;

			case "left":
				if (previous_key == 0){
					previous_key = direction;
				};
				new_spot = left_spot(current_index);
			break;

			case "right":
				if (previous_key == 0){
					previous_key = direction;
				};
				new_spot = right_spot(current_index);
			break;

			default:
				// error?
			break;
		}

		switch(new_spot.type){

			
			case SpotType.WALL:
				// can't move
				// stay where you are
				// check previous key
				if (!checked){
					checked = true;
				}
				if (previous_key == direction){
					checked = false;
				}
			break;

			case SpotType.LEFT:
			case SpotType.RIGHT:
			case SpotType.PLAYER:
			case SpotType.EMPTY:
				// make new spot player type
				checked = false;
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
				checked = false;
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
				turn_ghosts_blue();
				// make new spot player type
				checked = false;
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
				checked = false;
				facing = "";
				update_spot(current_index, SpotType.EMPTY);
				// reset back at start spot
				update_spot(start_index, SpotType.PLAYER);
				current_index = start_index;
				// enemies are back in center
			break;

			case SpotType.BLUE_GHOST:
				// eat the ghost
				// collect points
				// make new spot player type
				checked = false;
				facing = direction;
				update_spot(new_spot.index, SpotType.PLAYER);
				// make old spot empty
				update_spot(current_index, SpotType.EMPTY);
				current_index = new_spot.index;
			break;
		}
		placeholder = previous_key;
		previous_key = direction;
		direction = placeholder;
	}

	// ghosts move after you
	move_ghosts();
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







