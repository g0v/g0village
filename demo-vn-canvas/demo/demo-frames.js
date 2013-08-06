///////////////////////////////////////////////////////////////////////////////
//  This is the DEMO for Multi-frame support of VN-CANVAS                    //
//  This applies to background objects, character sprites and avatars        //
///////////////////////////////////////////////////////////////////////////////

demo_frame = [
	label, "demo_frame",
	macro, "frame_init",
	scene, {src:"#101008"},
	
	box, {pos:"center", back:"none"},

	text, {align:"center", value:"This is a scene object with multiple frames.", duration:3},
	box, {show:false},

	// Note: x, y is from canvas center, since there's no base image 
	scene, {src:"#101008", objects:["demo/animated_monk.jpg", -158, -186, 25, 20]},
	wait, 0,
	scene, {src:"#101008"},

	text, {value:"This is a character sprite with multiple frames.", duration:3},
	box, {show:false},

	// Note: sprite is purposely centered, default is floored
	actor, {id:"monk", sprite:["monk-anim", "demo/animated_monk.jpg", "center", 25, 20]},
	wait, 0,
	/*
	// The following lines demonstrate changing character sprites, uncomment to view
	actor, {id:"monk", sprite:["v-town", "demo/vina01.png"]},			// place a dummy new sprite
	wait, 0,
	actor, {id:"monk", sprite:"monk-anim"},								// re-invoke animated sprite with previous settings
	wait, 0,
	actor, {id:"monk", sprite:["monk-anim", "demo/animated_monk.jpg", "center", 25, 40, 3]},		// 3 repetitions, faster fps
	wait, 0,
	actor, {id:"monk", sprite:["monk-anim", "demo/animated_monk.jpg", "center", 25, 20, 1]},		// single repetition
	wait, 0,
    */
	
	box, {pos:"bottom", align:"left", back:"dim"},
	actor, { id:"monk", 
			 sprite:["monk-anim", "demo/animated_monk.jpg", "center", 25, 20],
			 avatar:["base","demo/avatar_monk.jpg", 25, 15], 
			 say:"This is my character avatar with multiple frames."},
	// Uncomment the following lines to re-load the avatar animation, useful for "speaking" animations 
	/*
	actor, { id:"monk", 
			 avatar:["base","demo/avatar_monk.jpg", 25, 15, 3], 
			 say:"Let's try a finite avatar animation."},
	actor, { id:"monk", 
			 avatar:"base", 
			 say:"Let's trigger the avatar again."},
	*/

	box, {pos:"center", align:"center", back:"none"},
	text, "Don't forget to check out demo-frames.js to see how this was done, along with some animations hidden in the script.",
	text, "Images borrowed from a popular Blizzard game. ;)"
	
];

function frame_init() {
	// didn't want to create a new config file, so just modified it here
	Helper.setValue("actorPerspective", false);
	Config.activeTheme.formFontStyle = "bold 16px M1m #C0C0C0";
	Helper.configUpdate("activeTheme");
	// as a cheat to preload fontface, an invisible <div> was added in demo-frames.html
}

