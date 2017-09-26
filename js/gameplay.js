


//////////////////////////////
// INITIALIZATION
/////////////////////////////

var GHOST1_SPEED = 300;
var GHOST2_SPEED = 320;
var GHOST3_SPEED = 280;
var GHOST4_SPEED = 240;
var PLAYER_SPEED = 200;

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

var previous_key = "";

var num_dots = 0;
var my_dots = 0;
var pacdot1_pts = 10;
var pacdot2_pt2 = 50;

var spots = [];
var ghosts = [];
var ghost_under_types = [];
var ghost_previous_move = [];
var ghost_facing = [];
var ghost_num = 0;


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
	GHOST1		: 4,
	GHOST2		: 5,
	GHOST3		: 6,
	GHOST4		: 7,
	PLAYER		: 8,
	LEFT 		: 9,
	RIGHT 		: 10
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

		case SpotType.GHOST4:
			if (blue_ghost){

			}
			switch (ghost_facing[3]){
				case "up":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost4_3.png";
				break;

				case "down":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost4_4.png";
				break;

				case "left":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost4_1.png";
				break;

				case "right":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost4_2.png";
				break;

				default:
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost4_1.png";
				break;
			}
		break;

		case SpotType.GHOST3:
			if (blue_ghost){

			}
			switch (ghost_facing[2]){
				case "up":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost3_3.png";
				break;

				case "down":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost3_4.png";
				break;

				case "left":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost3_1.png";
				break;

				case "right":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost3_2.png";
				break;

				default:
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost3_1.png";
				break;
			}
		break;

		case SpotType.GHOST2:

			switch (ghost_facing[1]){
				case "up":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost2_3.png";
				break;

				case "down":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost2_4.png";
				break;

				case "left":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost2_1.png";
				break;

				case "right":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost2_2.png";
				break;

				default:
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost2_1.png";
				break;
			}
		break;

		case SpotType.GHOST1:
			switch (ghost_facing[0]){
				case "up":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost1_3.png";
				break;

				case "down":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost1_4.png";
				break;

				case "left":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost1_1.png";
				break;

				case "right":
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost1_2.png";
				break;

				default:
					if (blue_ghost){
						return "tiles/blue_ghost.png";
					}
					return "tiles/ghost1_1.png";
				break;
			}		
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
			return ("tiles/" + type_in + ".png");
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
// GHOSTS
/////////////////////////////

function turn_ghosts_normal(){
	for(var i = 0; i < ghosts.length; i++){
		window.ghosts[i].img_src = get_image_src(ghosts[i].type);
		window.spots[ghosts[i].index].type = ghosts[i].type;
		$(ghosts[i].id).attr("src", ghosts[i].img_src);
	}
};

function turn_ghosts_blue(){
	blue_ghost = true;
	moves_since_blue = 10;
	for(var i = 0; i < ghosts.length; i++){
		window.ghosts[i].img_src = get_image_src(ghosts[i].type);
		window.spots[ghosts[i].index].type = ghosts[i].type;
		$(ghosts[i].id).attr("src", ghosts[i].img_src);
	}
};


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
			ghost_num++;
			switch(ghost_num){
				case 1:
					return SpotType.GHOST1;
				break;

				case 2:
					return SpotType.GHOST2;
				break;

				case 3:
					return SpotType.GHOST3;
				break;

				case 4:
					return SpotType.GHOST4;
				break;
			}
			
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

		case "1":
			return "wall1";
		break;

		case "2":
			return "wall2";
		break;

		case "3":
			return "wall3";
		break;

		case "4":
			return "wall4";
		break;

		case "5":
			return "wall5";
		break;

		case "6":
			return "wall6";
		break;

		case "7":
			return "wall7";
		break;

		case "8":
			return "wall8";
		break;

		case "9":
			return "wall9";
		break;

		case "0":
			return "wall10";
		break;

		case "#":
			return "wall11";
		break;

		case "&":
			return "wall12";
		break;

		case "*":
			return "wall13";
		break;

		case "@":
			return "wall14";
		break;


		default:
			// error?
			return SpotType.EMPTY;
		break;
	}
};

function initialize_game(height_in, width_in, spots_in) {
	height = height_in;
	width = width_in;
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
					num_dots += 1;
				break;

				case SpotType.GHOST4:
				case SpotType.GHOST3:
				case SpotType.GHOST2:
				case SpotType.GHOST1:
					new_ghost = new Spot(type, curr_spot, w, h);
					window.ghosts.push(new_ghost);
					window.ghost_under_types.push(SpotType.EMPTY);
					window.ghost_previous_move.push("");
					window.ghost_facing.push("left");
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
	var type = 0;
	console.log(index + " " + new_type);

	switch(new_type){
		case 0:
			type = SpotType.EMPTY;
		break;

		case 1:
			type = SpotType.PACDOT1;
		break;

		case 2:
			type = SpotType.PACDOT2;
		break;

		case 3:
			type = SpotType.WALL;
		break;

		case 4:
			type = SpotType.GHOST1;
		break;

		case 5:
			type = SpotType.GHOST2;
		break;

		case 6:
			type = SpotType.GHOST3;
		break;

		case 7:
			type = SpotType.GHOST4;
		break;

		case 8:
			type = SpotType.PLAYER;
		break;

		case 9:
			type = SpotType.LEFT;
		break;

		case 10:
			type = SpotType.RIGHT;
		break;

	}
	window.spots[index].img_src = get_image_src(type);
	console.log(type);
	$(spots[index].id).attr("src", get_image_src(type));
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


function game_init(text) {
	var values = text.split('\n');
	// make board
	initialize_game(values[0], values[1], values[2]);
};


//////////////////////////////
// CONTROLS
//////////////////////////////

var up_pressed = false;
var down_pressed = false;
var left_pressed = false;
var right_pressed = false;
var last_released = "";

$(document).keyup(function(e){
	switch(e.keyCode){
		case 13:
			// enter
		break;

		case 38:
			// up
			up_pressed = false;
			last_released = "up";
		break;

		case 40:
			// down
			down_pressed = false;
			last_released = "down";
		break;

		case 39:
			// right
			right_pressed = false;
			last_released = "right";
		break;

		case 37:
			// left
			left_pressed = false;
			last_released = "left";
		break;

		case 32:
			// space
		break;

		default:
		break;
	}
});

$(document).keydown(function(e){
	switch(e.keyCode){
		case 13:
			// enter
		break;

		case 38:
			// up
			up_pressed = true;
		break;

		case 40:
			// down
			down_pressed = true;
		break;

		case 39:
			// right
			right_pressed = true;
		break;

		case 37:
			// left
			left_pressed = true;
		break;

		case 32:
			// space
		break;

		default:
		break;
	}
});


var ghost_interval1 = setInterval(function(){
	if (ghosts[0] != null){
		move_ghost(1);
	}
}, GHOST1_SPEED);

var ghost_interval2 = setInterval(function(){
	if (ghosts[1] != null){
		move_ghost(2);
	}
}, GHOST2_SPEED);

var ghost_interval3 = setInterval(function(){
	if (ghosts[2] != null){
		move_ghost(3);
	}
}, GHOST3_SPEED);

var ghost_interval4 = setInterval(function(){
	if (ghosts[3] != null){
		move_ghost(4);
	}
}, GHOST4_SPEED);


function move_ghost(index) {

	var i = index - 1;
	var new_spot = 0;

	// blue ghosts move two times slower
	var idx = ghosts[i].index;
	var left = left_spot(idx);
	var up = up_spot(idx);
	var down = down_spot(idx);
	var right = right_spot(idx);

	var placeholder = 0;

	var found = false;

	// if diff_x is negative, the player is left
	// if diff_x is positive, the player is right
	var diff_x = spots[current_index].x - idx.x;
	// if diff_y is negative, the player is north
	// if diff_y is positive, the player is south 
	var diff_y = spots[current_index].y - idx.y;


	if (blue_ghost) {
		// moves blue ghosts away from player

		if (left.type == SpotType.WALL && right.type == SpotType.WALL){
			if (ghost_previous_move[i] == "up"){
				new_spot = up;
				ghost_previous_move[i] = "up";
				found = true;
			}
			else {
				new_spot = down;
				ghost_previous_move[i] = "down";
				found = true;
			}
		}
		else if (up.type == SpotType.WALL && down.type == SpotType.WALL){
			if (ghost_previous_move[i] == "left"){
				new_spot = left;
				ghost_previous_move[i] = "left";
				found = true;
			}
			else {
				ghost_previous_move[i] = "right";
				new_spot = right;
				found = true;
			}
		}
		else if (up.type == SpotType.WALL && right.type == SpotType.WALL){
			// top right corner
			if (ghost_previous_move[i] == "up"){
				ghost_previous_move[i] = "left";
				new_spot = left;
				found = true;
			}
			else {
				ghost_previous_move[i] = "down";
				new_spot = down;
				found = true;
			}
		}
		else if (right.type == SpotType.WALL && down.type == SpotType.WALL){
			// bottom right corner
			if (ghost_previous_move[i] == "down"){
				ghost_previous_move[i] = "left";
				new_spot = left;
				found = true;
				
			}
			else {
				ghost_previous_move[i] = "up";
				found = true;
				new_spot = up;
			}
		}
		else if (left.type == SpotType.WALL && down.type == SpotType.WALL){
			// bottom left corner
			if (ghost_previous_move[i] == "down"){
				ghost_previous_move[i] = "right";
				new_spot = right;
				found = true;
			}
			else {
				ghost_previous_move[i] = "up";
				new_spot = up;
				found = true;
			}
		}
		else if (left.type == SpotType.WALL && up.type == SpotType.WALL){
			// top left corner
			if (ghost_previous_move[i] == "up"){
				new_spot = right;
				ghost_previous_move[i] = "right";
				found = true;
			}
			else {
				ghost_previous_move[i] = "down";
				new_spot = down;
				found = true;
			}
		}
		else {

			if (Math.abs(diff_x) > Math.abs(diff_y)){
				if (diff_y < 0){
					// go south
					if (down.type != SpotType.WALL){
						new_spot = down;
						ghost_previous_move[i] = "down";
						found = true;
					}
					else if (idx.x > width/2 && left.type != SpotType.WALL){
						new_spot = left;
						ghost_previous_move[i] = "left";
						found = true;
					}
					else if (idx.x < width/2 && right.type != SpotType.WALL){
						new_spot = right;
						ghost_previous_move[i] = "right";
						found = true;
					}
					else if (left.type != SpotType.WALL){
						new_spot = left;
						ghost_previous_move[i] = "left";
						found = true;
					}
					else if (right.type != SpotType.WALL){
						new_spot = right;
						ghost_previous_move[i] = "right";
						found = true;
					}
				}
				else {
					// go north
					if (up.type != SpotType.WALL){
						new_spot = up;
						ghost_previous_move[i] = "up";
						found = true;
					}
					else if (idx.x < width/2 && right.type != SpotType.WALL){
						new_spot = right;
						ghost_previous_move[i] = "right";
						found = true;
					}
					else if (idx.x > width/2 && left.type != SpotType.WALL){
						new_spot = left;
						ghost_previous_move[i] = "left";
						found = true;
					}
					else if (right.type != SpotType.WALL){
						new_spot = right;
						ghost_previous_move[i] = "right";
						found = true;
					}
					else if (left.type != SpotType.WALL){
						new_spot = left;
						ghost_previous_move[i] = "left";
						found = true;
					}
				}
			}
			else {
				if (diff_x < 0){
					// go right
					if (right.type != SpotType.WALL){
						new_spot = right;
						ghost_previous_move[i] = "right";
						found = true;
					}
					else if (idx.y < height/2 && down.type != SpotType.WALL){
						new_spot = down;
						ghost_previous_move[i] = "down";
						found = true;
					}
					else if (idx.y > height/2 && up.type != SpotType.WALL){
						new_spot = up;
						ghost_previous_move[i] = "up";
						found = true;
					}
					else if (down.type != SpotType.WALL){
						new_spot = down;
						ghost_previous_move[i] = "down";
						found = true;
					}
					else if (up.type != SpotType.WALL){
						new_spot = up;
						ghost_previous_move[i] = "up";
						found = true;
					}
				}
				else {
					// go left
					if (left.type != SpotType.WALL){
						new_spot = left;
						ghost_previous_move[i] = "left";
						found = true;
					}
					else if (idx.y > height/2 && up.type != SpotType.WALL){
						new_spot = up;
						ghost_previous_move[i] = "up";
						found = true;
					}
					else if (idx.y < height/2 && down.type != SpotType.WALL){
						new_spot = down;
						ghost_previous_move[i] = "down";
						found = true;
					}
					else if (up.type != SpotType.WALL){
						new_spot = up;
						ghost_previous_move[i] = "up";
						found = true;
					}
					else if (down.type != SpotType.WALL){
						new_spot = down;
						ghost_previous_move[i] = "down";
						found = true;
					}
				}
				
			}

			if (!found){
				console.log("i don't know if this will ever happen?");
				new_spot = up;
			}
		}

		ghost_facing[i] = ghost_previous_move[i];

		switch (new_spot.type){
			case SpotType.GHOST1:
				placeholder = ghost_under_types[0];
				window.ghost_under_types[0] = ghost_under_types[i];
				window.ghost_under_types[i] = placeholder;
				placeholder = ghosts[0];
				window.ghosts[0] = ghosts[i];
				window.ghosts[i] = placeholder;
			break;

			case SpotType.GHOST2:
				placeholder = ghost_under_types[1];
				window.ghost_under_types[1] = ghost_under_types[i];
				window.ghost_under_types[i] = placeholder;
				placeholder = ghosts[1];
				window.ghosts[1] = ghosts[i];
				window.ghosts[i] = placeholder;
			break;

			case SpotType.GHOST3:
				placeholder = ghost_under_types[2];
				window.ghost_under_types[2] = ghost_under_types[i];
				window.ghost_under_types[i] = placeholder;
				placeholder = ghosts[2];
				window.ghosts[2] = ghosts[i];
				window.ghosts[i] = placeholder;
			break;

			case SpotType.GHOST4:
				placeholder = ghost_under_types[3];
				window.ghost_under_types[3] = ghost_under_types[i];
				window.ghost_under_types[i] = placeholder;
				placeholder = ghosts[3];
				window.ghosts[3] = ghosts[i];
				window.ghosts[i] = placeholder;
			break;

			case SpotType.PLAYER:
				update_spot(new_spot.index, ghosts[i].type);
				update_spot(ghosts[i].index, ghost_under_types[i]);
				update_spot(start_index, SpotType.PLAYER);
				current_index = start_index;
				window.ghost_under_types[i] = SpotType.EMPTY;
				window.ghosts[i].x = new_spot.x;
				window.ghosts[i].y = new_spot.y;
				window.ghosts[i].index = new_spot.index;
				window.ghosts[i].id = new_spot.id;
			break;

			case SpotType.PACDOT2:
			case SpotType.EMPTY:
			case SpotType.LEFT:
			case SpotType.RIGHT:
			case SpotType.PACDOT1:
				placeholder = new_spot.type;
				update_spot(new_spot.index, ghosts[i].type);
				update_spot(ghosts[i].index, ghost_under_types[i]);
				window.ghost_under_types[i] = placeholder;
				window.ghosts[i].x = new_spot.x;
				window.ghosts[i].y = new_spot.y;
				window.ghosts[i].index = new_spot.index;
				window.ghosts[i].id = new_spot.id;
			break;

			case SpotType.WALL:
			default:
				// error?
			break;
		}
	}

	else
	{
		if (left.type == SpotType.WALL && right.type == SpotType.WALL){
			if (ghost_previous_move[i] == "up"){
				new_spot = up;
				ghost_previous_move[i] = "up";
				found = true;
			}
			else {
				new_spot = down;
				ghost_previous_move[i] = "down";
				found = true;
			}
		}
		else if (up.type == SpotType.WALL && down.type == SpotType.WALL){
			if (ghost_previous_move[i] == "left"){
				new_spot = left;
				ghost_previous_move[i] = "left";
				found = true;
			}
			else {
				ghost_previous_move[i] = "right";
				new_spot = right;
				found = true;
			}
		}
		else if (up.type == SpotType.WALL && right.type == SpotType.WALL){
			// top right corner
			if (ghost_previous_move[i] == "up"){
				ghost_previous_move[i] = "left";
				new_spot = left;
				found = true;
			}
			else {
				ghost_previous_move[i] = "down";
				new_spot = down;
				found = true;
			}
		}
		else if (right.type == SpotType.WALL && down.type == SpotType.WALL){
			// bottom right corner
			if (ghost_previous_move[i] == "down"){
				ghost_previous_move[i] = "left";
				new_spot = left;
				found = true;
				
			}
			else {
				ghost_previous_move[i] = "up";
				found = true;
				new_spot = up;
			}
		}
		else if (left.type == SpotType.WALL && down.type == SpotType.WALL){
			// bottom left corner
			if (ghost_previous_move[i] == "down"){
				ghost_previous_move[i] = "right";
				new_spot = right;
				found = true;
			}
			else {
				ghost_previous_move[i] = "up";
				new_spot = up;
				found = true;
			}
		}
		else if (left.type == SpotType.WALL && up.type == SpotType.WALL){
			// top left corner
			if (ghost_previous_move[i] == "up"){
				new_spot = right;
				ghost_previous_move[i] = "right";
				found = true;
			}
			else {
				ghost_previous_move[i] = "down";
				new_spot = down;
				found = true;
			}
		}
		else {

			if (Math.abs(diff_x) > Math.abs(diff_y)){
				if (diff_y > 0){
					// go south
					if (down.type != SpotType.WALL){
						new_spot = down;
						ghost_previous_move[i] = "down";
						found = true;
					}
					else if (idx.x > width/2 && left.type != SpotType.WALL){
						new_spot = left;
						ghost_previous_move[i] = "left";
						found = true;
					}
					else if (idx.x < width/2 && right.type != SpotType.WALL){
						new_spot = right;
						ghost_previous_move[i] = "right";
						found = true;
					}
					else if (left.type != SpotType.WALL){
						new_spot = left;
						ghost_previous_move[i] = "left";
						found = true;
					}
					else if (right.type != SpotType.WALL){
						new_spot = right;
						ghost_previous_move[i] = "right";
						found = true;
					}
				}
				else {
					// go north
					if (up.type != SpotType.WALL){
						new_spot = up;
						ghost_previous_move[i] = "up";
						found = true;
					}
					else if (idx.x < width/2 && right.type != SpotType.WALL){
						new_spot = right;
						ghost_previous_move[i] = "right";
						found = true;
					}
					else if (idx.x > width/2 && left.type != SpotType.WALL){
						new_spot = left;
						ghost_previous_move[i] = "left";
						found = true;
					}
					else if (right.type != SpotType.WALL){
						new_spot = right;
						ghost_previous_move[i] = "right";
						found = true;
					}
					else if (left.type != SpotType.WALL){
						new_spot = left;
						ghost_previous_move[i] = "left";
						found = true;
					}
				}
			}
			else {
				if (diff_x > 0){
					// go right
					if (right.type != SpotType.WALL){
						new_spot = right;
						ghost_previous_move[i] = "right";
						found = true;
					}
					else if (idx.y < height/2 && down.type != SpotType.WALL){
						new_spot = down;
						ghost_previous_move[i] = "down";
						found = true;
					}
					else if (idx.y > height/2 && up.type != SpotType.WALL){
						new_spot = up;
						ghost_previous_move[i] = "up";
						found = true;
					}
					else if (down.type != SpotType.WALL){
						new_spot = down;
						ghost_previous_move[i] = "down";
						found = true;
					}
					else if (up.type != SpotType.WALL){
						new_spot = up;
						ghost_previous_move[i] = "up";
						found = true;
					}
				}
				else {
					// go left
					if (left.type != SpotType.WALL){
						new_spot = left;
						ghost_previous_move[i] = "left";
						found = true;
					}
					else if (idx.y > height/2 && up.type != SpotType.WALL){
						new_spot = up;
						ghost_previous_move[i] = "up";
						found = true;
					}
					else if (idx.y < height/2 && down.type != SpotType.WALL){
						new_spot = down;
						ghost_previous_move[i] = "down";
						found = true;
					}
					else if (up.type != SpotType.WALL){
						new_spot = up;
						ghost_previous_move[i] = "up";
						found = true;
					}
					else if (down.type != SpotType.WALL){
						new_spot = down;
						ghost_previous_move[i] = "down";
						found = true;
					}
				}
				
			}

			if (!found){
				console.log("i don't know if this will ever happen?");
				new_spot = up;
			}
		}

		ghost_facing[i] = ghost_previous_move[i];

		switch (new_spot.type){
			case SpotType.GHOST1:
				placeholder = ghost_under_types[0];
				window.ghost_under_types[0] = ghost_under_types[i];
				window.ghost_under_types[i] = placeholder;
				placeholder = ghosts[0];
				window.ghosts[0] = ghosts[i];
				window.ghosts[i] = placeholder;
			break;

			case SpotType.GHOST2:
				placeholder = ghost_under_types[1];
				window.ghost_under_types[1] = ghost_under_types[i];
				window.ghost_under_types[i] = placeholder;
				placeholder = ghosts[1];
				window.ghosts[1] = ghosts[i];
				window.ghosts[i] = placeholder;
			break;

			case SpotType.GHOST3:
				placeholder = ghost_under_types[2];
				window.ghost_under_types[2] = ghost_under_types[i];
				window.ghost_under_types[i] = placeholder;
				placeholder = ghosts[2];
				window.ghosts[2] = ghosts[i];
				window.ghosts[i] = placeholder;
			break;

			case SpotType.GHOST4:
				placeholder = ghost_under_types[3];
				window.ghost_under_types[3] = ghost_under_types[i];
				window.ghost_under_types[i] = placeholder;
				placeholder = ghosts[3];
				window.ghosts[3] = ghosts[i];
				window.ghosts[i] = placeholder;
			break;

			case SpotType.PLAYER:
				update_spot(new_spot.index, ghosts[i].type);
				update_spot(ghosts[i].index, ghost_under_types[i]);
				update_spot(start_index, SpotType.PLAYER);
				current_index = start_index;
				window.ghost_under_types[i] = SpotType.EMPTY;
				window.ghosts[i].x = new_spot.x;
				window.ghosts[i].y = new_spot.y;
				window.ghosts[i].index = new_spot.index;
				window.ghosts[i].id = new_spot.id;
			break;

			case SpotType.PACDOT2:
			case SpotType.EMPTY:
			case SpotType.LEFT:
			case SpotType.RIGHT:
			case SpotType.PACDOT1:
				placeholder = new_spot.type;
				update_spot(new_spot.index, ghosts[i].type);
				update_spot(ghosts[i].index, ghost_under_types[i]);
				window.ghost_under_types[i] = placeholder;
				window.ghosts[i].x = new_spot.x;
				window.ghosts[i].y = new_spot.y;
				window.ghosts[i].index = new_spot.index;
				window.ghosts[i].id = new_spot.id;
			break;

			case SpotType.WALL:
			default:
				// error?
			break;
		}
	}
};


var player_interval = setInterval(function(){
	move_player();
}, PLAYER_SPEED);

function move_player() {
	
	if (!up_pressed && !down_pressed && !left_pressed && !right_pressed && previous_key == ""){
		return;
	}
	

	var up = up_spot(current_index);
	var left = left_spot(current_index);
	var right = right_spot(current_index);
	var down = down_spot(current_index);
	var new_spot = 0;

	if (moves_since_blue == 0 && blue_ghost){
		blue_ghost = false;
		turn_ghosts_normal();
	} 
	else if (blue_ghost){
		moves_since_blue -= 1;
	}


	// types of paths
	// top right corner
	// bottom right corner
	// top left corner
	// bottom left corner 
	// left-right
	// up-down
	// 4-way intersection
	// 3-way intersection 

	if (previous_key == ""){
		if (left_pressed && left.type != SpotType.WALL){
			new_spot = left;
			previous_key = "left";
		}
		else if (right_pressed && right.type != SpotType.WALL) {
			new_spot = right;
			previous_key = "right";
		} 
		else if (up_pressed && up.type != SpotType.WALL) {
			new_spot = up;
			previous_key = "up";
		}
		else if (down_pressed && down.type != SpotType.WALL){
			new_spot = down;
			previous_key = "down";
		}
	}
	else if (up.type == SpotType.WALL && right.type == SpotType.WALL){
		// top right corner
		if (previous_key == "up"){
			if (down_pressed){
				// go down
				new_spot = down;
				previous_key = "down";
			}
			else if (left_pressed) {
				// go left
				new_spot = left;
				previous_key = "left";
			}
		}
		else if (previous_key == "right"){
			if (left_pressed){
				// go left
				new_spot = left;
				previous_key = "left";
			} 
			else if (down_pressed) {
				// go down 
				new_spot = down;
				previous_key = "down";
			}
		}
	}
	else if (right.type == SpotType.WALL && down.type == SpotType.WALL){
		// bottom right corner
		if (previous_key == "down"){
			if (up_pressed){
				// go up
				new_spot = up;
				previous_key = "up";
			}
			else if (left_pressed) {
				// go left
				new_spot = left;
				previous_key = "left";
			}
		}
		else if (previous_key == "right"){
			if (left_pressed){
				// go left
				new_spot = left;
				previous_key = "left";
			}
			else if (up_pressed) {
				// go up
				new_spot = up;
				previous_key = "up";
			}
		}
	}
	else if (left.type == SpotType.WALL && down.type == SpotType.WALL){
		// bottom left corner
		if (previous_key == "down"){
			if (up_pressed){
				// go up
				new_spot = up;
				previous_key = "up";
			}
			else if (right_pressed) {
				// go right
				new_spot = right;
				previous_key = "right";
			}
		}
		else if (previous_key == "left"){
			if (right_pressed){
				// go right
				new_spot = right;
				previous_key = "right";
			}
			else if (up_pressed) {
				// go up
				new_spot = up;
				previous_key = "up";
			}
		}
	}
	else if (left.type == SpotType.WALL && up.type == SpotType.WALL){
		// top left corner
		if (previous_key == "up"){
			if (down_pressed){
				// go down
				new_spot = down;
				previous_key = "down";
			}
			else {
				// go right
				new_spot = right;
				previous_key = "right";
			}
		}
		else if (previous_key == "left"){
			if (right_pressed){
				// go right
				new_spot = right;
				previous_key = "right";
			}
			else {
				// go down
				new_spot = down;
				previous_key = "down";
			}
		}
	}
	else if (left.type == SpotType.WALL && right.type == SpotType.WALL){
		if (up_pressed && !down_pressed){
			// go up
			new_spot = up;
			previous_key = "up";
		}
		else if (down_pressed && !up_pressed){
			// go down
			new_spot = down;
			previous_key = "down";
		}
		else if (previous_key == "up"){
			// go up
			new_spot = up;
			previous_key = "up";
		}
		else if (previous_key == "down"){
			// go down
			new_spot = down;
			previous_key = "down";
		}
	}
	else if (up.type == SpotType.WALL && down.type == SpotType.WALL){
		if (left_pressed && !right_pressed){
			// go left
			new_spot = left;
			previous_key = "left";
		}
		else if (right_pressed && !left_pressed){
			// go right
			new_spot = right;
			previous_key = "right";
		}
		else if (previous_key == "left"){
			// go left
			new_spot = left;
			previous_key = "left";
		}
		else if (previous_key == "right"){
			// go right
			new_spot = right;
			previous_key = "right";
		}
	}
	else {
		if (left_pressed && left.type != SpotType.WALL){
			// go left
			new_spot = left;
			previous_key = "left";
		}
		else if (right_pressed && right.type != SpotType.WALL){
			// go right
			new_spot = right;
			previous_key = "right";
		}
		else if (up_pressed && up.type != SpotType.WALL){
			// go up
			new_spot = up;
			previous_key = "up";
		}
		else if (down_pressed && down.type != SpotType.WALL){
			// go down
			new_spot = down;
			previous_key = "down";
		}
		else {
			switch(previous_key){
				case "left":
					if (left.type == SpotType.WALL){
						new_spot = spots[current_index];
						previous_key = "left";
						return;
					}
					else {
						// go left
						new_spot = left;
						previous_key = "left";
					}
				break; 

				case "right":
					if (right.type == SpotType.WALL){
						new_spot = spots[current_index];
						previous_key = "right";
						return;
					}
					else {
						// go right
						new_spot = right;
						previous_key = "right";
					}
				break;

				case "up":
					if (up.type == SpotType.WALL){
						new_spot = spots[current_index];
						previous_key = "up";
						return;
					}
					else {
						// go up
						new_spot = up;
						previous_key = "up";
					}
				break;

				case "down":
					if (down.type == SpotType.WALL){
						previous_key = "down";
						new_spot = spots[current_index];
						return;
					}
					else {
						// go down
						new_spot = down;
						previous_key = "down";
					}
				break;

				default:
				break;
			}
		}
	}

	var checked = true;
	var placeholder = 0;


	switch(new_spot.type){

		
		case SpotType.WALL:
			// can't move
			// stay where you are
			// check previous key
			// shouldn't get here
		break;

		case SpotType.LEFT:
		case SpotType.RIGHT:
		case SpotType.PLAYER:
		case SpotType.EMPTY:
			// make new spot player type
			facing = previous_key;
			placeholder = new_spot.index;
			// make old spot empty
			update_spot(current_index, SpotType.EMPTY);
			update_spot(new_spot.index, SpotType.PLAYER);
			current_index = placeholder;
		break;

		case SpotType.PACDOT1:
			// erase dot
			my_dots += 1;
			// collect point
			// make new spot player type
			placeholder = new_spot.index;
			facing = previous_key;
			update_spot(current_index, SpotType.EMPTY);
			update_spot(new_spot.index, SpotType.PLAYER);
			// make old spot empty
			current_index = placeholder;
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
			placeholder = new_spot.index;
			// make new spot player type
			facing = previous_key;
			// make old spot empty
			update_spot(current_index, SpotType.EMPTY);
			update_spot(new_spot.index, SpotType.PLAYER);
			current_index = placeholder;
			if (my_dots == num_dots){
				win();
			}
		break;

		case SpotType.GHOST2:
		case SpotType.GHOST3:
		case SpotType.GHOST4:
		case SpotType.GHOST1:
			if (blue_ghost){
				// eat the ghost
				// remove the ghost from the ghost array
				for (var i = 0; i < ghosts.length; i++){
					if (ghosts[i].index == new_spot.index){
						ghosts.splice(i, 1);
					}
				}
				// collect points
				// make new spot player type
				// make old spot empty
				update_spot(current_index, SpotType.EMPTY);
				update_spot(new_spot.index, SpotType.PLAYER);
				current_index = new_spot.index;
			}
			else {
				// die
				// lose points
				// make old spot empty
				facing = "";
				update_spot(current_index, new_spot.type);
				update_spot(new_spot.index, SpotType.EMPTY);
				// reset back at start spot
				update_spot(start_index, SpotType.PLAYER);
				current_index = start_index;
				// enemies are back in center
			}
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
				game_init(data);
			}
		}
	});
}







