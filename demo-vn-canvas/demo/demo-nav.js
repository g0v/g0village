demo_nav = [
	label, "demo_nav",
	macro, "nav_init",
	box, {pos:"center", back:"dim"},
	
	menu, ["Choose navigation demo:",
		"Map-based navigation", "nav_map",
		"Tile-based navigation", "nav_tile"	],

	/* Map-based Navigation Demo */	
	label, "nav_map",
	scene, {src:"black"},
	text, "Click on the marked map locations to go there. You can only access your \
present location and those adjacent to it.\n\nYou are currently in the Midlands.",
	box, {show:false},

	set, {_nav_loc:"midlands"},
	map, {id:"nav_map",
		  westland:["midlands"],
		  midlands:["westland", "dhara", "oldworld"],
		  dhara:["midlands"],
		  oldworld:["dhara", "midlands"],
	},
	
	label, "back_to_map",
	box, {show:false},
	cform, [ "nav_map", true,
		picture, {name:"nav_image", x:60, y:20, frames:["demo/map.jpg"]},
		button, {name:"westland", x:105, y:195, w:80, h:40, base:"rgba(255,128,0,0.25)", hover:"rgba(247,221,204,0.5)", link:[jump, "westland"], tip:"Go to Westland", showText:false},
		button, {name:"midlands", x:365, y:180, w:80, h:40, base:"rgba(255,128,0,0.25)", hover:"rgba(247,221,204,0.5)", link:[jump, "midlands"], tip:"Go to Midlands", showText:false},
		button, {name:"dhara", x:525, y:140, w:80, h:40, base:"rgba(255,128,0,0.25)", hover:"rgba(247,221,204,0.5)", link:[jump, "dhara"], tip:"Go to D\'Hara", showText:false},
		button, {name:"oldworld", x:495, y:350, w:80, h:40, base:"rgba(255,128,0,0.25)", hover:"rgba(247,221,204,0.5)",link:[jump, "oldworld"], tip:"Go to the Old World", showText:false},
	],
	jump, "back_to_map",
	
	label, "westland",
	cform, "hide",
	set, {_nav_loc:"westland"},
	text, "You have reached Westland.\nDo something here.\nClick to go back to map.",
	jump, "back_to_map",
	
	label, "midlands",
	cform, "hide",
	set, {_nav_loc:"midlands"},
	text, "You have reached Midlands.\nDo something here.\nClick to go back to map.",
	jump, "back_to_map",

	label, "dhara",
	cform, "hide",
	set, {_nav_loc:"dhara"},
	text, "You have reached the D\'Haran Empire.\nDo something here.\nClick to go back to map.",
	jump, "back_to_map",
	
	label, "oldworld",
	cform, "hide",
	set, {_nav_loc:"oldworld"},
	text, "You have reached the Old World.\nDo something here.\nClick to go back to map.",
	jump, "back_to_map",
	
	/* Tile-based Navigation Demo */
	label, "nav_tile",
	scene, {src:"white"},
	text, "Click on the arrow buttons to move about.",
	box, {pos:"top", align:"center", back:"none", show:false},
	
	set, {_nav_move:"", msg:""},
	cform, [ "nav_tile", false, 
		picture, {name:"nav_arrows", x:480, y:240, frames:["demo/arrows.png"]},
		button, {name:"nav_up", x:540, y:240, base:"demo/arrows-up.png", hover:"transparent", click:"transparent", link:[set, {_nav_move:"forward"}], tip:"Move forward", showText:false	},
		button, {name:"nav_down", x:540, y:380, base:"demo/arrows-down.png", hover:"transparent", click:"transparent", link:[set, {_nav_move:"back"}], tip:"Move back", showText:false	},
		button, {name:"nav_left", x:480, y:300, base:"demo/arrows-left.png", hover:"transparent", click:"transparent", link:[set, {_nav_move:"left"}], tip:"Turn left", showText:false	},
		button, {name:"nav_left", x:620, y:300, base:"demo/arrows-right.png", hover:"transparent", click:"transparent", link:[set, {_nav_move:"right"}], tip:"Turn right", showText:false	},
	],
	automap, {src:"demo/minimap.png", offset:[660,180], size:[3,3]},

	/* this starts at tile1, facing north; but can be started anywhere by jumping to target label */
	label, "tile1",
	tile, {id:"Tile1",
		wall:["demo/wall2.jpg", "demo/wall4.jpg", "demo/wall3.jpg", "demo/wall1.jpg"],
		link:["tile1", "tile3", "tile1", "tile1"],
		map:[0,1],
	},
	/* do some stuff here, hide/show cform if necessary */
	macro, "set_msg",
	text, "#msg#",
	jump, "tile1",
	
	label, "tile2",
	tile, {id:"Tile2",
		wall:["demo/wall1.jpg", "demo/wall2.jpg", "demo/wall4.jpg", "demo/wall3.jpg"],
		link:["tile2", "tile2", "tile3", "tile2"],
		map:[1,0],
	},
	/* do some stuff here, hide/show cform if necessary */
	macro, "set_msg",
	text, "#msg#",
	jump, "tile2",

	label, "tile3",
	tile, {id:"Tile3",
		wall:["demo/wall5.jpg", "demo/wall5.jpg", "demo/wall5.jpg", "demo/wall5.jpg"],
		link:["tile2", "tile5", "tile4", "tile1"],
		map:[1,1],		
	},
	/* do some stuff here, hide/show cform if necessary */
	macro, "set_msg",
	text, "#msg#",
	jump, "tile3",

	label, "tile4",
	tile, {id:"Tile4",
		wall:["demo/wall4.jpg", "demo/wall3.jpg", "demo/wall1.jpg", "demo/wall2.jpg"],
		link:["tile3", "tile4", "tile4", "tile4"],
		map:[1,2],		
	},
	/* do some stuff here, hide/show cform if necessary */
	macro, "set_msg",
	text, "#msg#",
	jump, "tile4",

	label, "tile5",
	tile, {id:"Tile5",
		wall:["demo/wall3.jpg", "demo/wall1.jpg", "demo/wall2.jpg", "demo/wall4.jpg"],
		link:["tile5", "tile5", "tile5", "tile3"],
		map:[2,1],		
	},
	/* do some stuff here, hide/show cform if necessary */
	macro, "set_msg",
	text, "#msg#",
	jump, "tile5",
];

function nav_init() {
	// didn't want to create a new config file, so just modified it here
	Helper.setValue("actorPerspective", false);
}
function set_msg() {
	var dir = ["North", "East", "South", "West"];
	Helper.setValue("msg", "You are at "+Helper.getValue("_nav_loc")+
				    ", facing "+dir[Helper.getValue("_nav_dir")]+".");
}