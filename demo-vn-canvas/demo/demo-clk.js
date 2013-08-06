demo_clk = [
	label, "demo_clk",
	
	scene, {src:"white"},
	//macro, {macro_with_param:[0,1,2,3]},
	set, {a:1, b:true, c:"hello"},
	jump, {label:"end", a:1, b:true, c:"world"},
	macro, "clk_init",
	cform, [ "title", false, 
		button, {name:"Not-so-precise Clock", x:20, y:20, w:250, h:20, base:"transparent"},
		button, {name:"A simple macro and plugins demo.", x:25, y:40, w:350, h:20, base:"transparent"},
	],
	
	/* create the clock face */
	set, {rots:0, rotm:0, roth:0},
	actor, {id:"back", sprite:["back", "demo/clk_b.png"], position:"center"},
	actor, {id:"hr", sprite:["hr", "demo/clk_h.png"], position:"center"},
	actor, {id:"min", sprite:["min", "demo/clk_m.png"], position:"center"},
	actor, {id:"sec", sprite:["sec", "demo/clk_s.png"], position:"center"},
	
	/* animate the clock */
	label, "loop",
	macro, "get_time",
	actor, {id:"hr", effect:"rotateAbs roth"},
	actor, {id:"min", effect:"rotateAbs rotm"},
	actor, {id:"sec", effect:"rotateAbs rots"},
	wait, 0.2,	/* update approx 4-5x per sec */
	jump, "loop",
	
	label, "end",
];

/* These are sample custom javascripts accessible via "macro" keyword. */
/* Note: Can be placed in any file, not necessary the chapter files, but be sure
   to include it in TOC file. */
// macros to initialize and get current time
function clk_init() {
	// didn't want to create a new config file, so just modified it here
	Config.actorPerspective = false;
	Config.actorYPosition = 0.8;
	Config.activeTheme.formFontStyle = "bold 16px M1m #404040";
	Helper.configUpdate("activeTheme");
	// as a cheat to preload fontface, an invisible <div> was added in demo-clk.html
}
function get_time() {
	var d = new Date();
	var hour = d.getHours()%12;
	var min = d.getMinutes();
	var sec = d.getSeconds();
	
	// set clock hands rotation according to hour/min/sec
	Helper.setValue("rots", sec*6);
	/*angle of rotation is too small and prone to accumulation errors*/
	/*Helper.setValue("rotm", (min + sec/60)*6); */
	Helper.setValue("rotm", (min + (sec/6>>0)/10)*6);
	Helper.setValue("roth", (hour + min/60)*30);
}
function macro_with_param(param) {
	alert(param);
}

// the default rotation is relative to current orientation
// this custom rotation plugin uses absolute orientation
TransEffects.rotateAbs = {
	_init: function(obj, param) {
		obj.orientation = Helper.parseArg(param[0]) % 360;
		// define a temporary variable to hold accumulated rotation
		if ((obj.accum_rotation == undefined) || (obj.accum_rotation == null)) 
			obj.accum_rotation = 0;
	},
	_in: function(obj, elapsed) {
		// set the usual 'show' flags
		obj.alpha = 1.0;
		obj.visible = true;
		obj.redraw = true;
		obj.drawn = true;
		obj.effects = 'done';
		// compute the object rotation here
		obj.rotation = obj.orientation - obj.accum_rotation;
		obj.accum_rotation = obj.orientation % 360;
	},
	_out: function(obj, elapsed) {
		// set the usual 'hide' flags
		obj.alpha = 0.0;
		obj.visible = false;
		obj.redraw = true;
		obj.drawn = true;
		obj.effects = 'done';
	}		
}