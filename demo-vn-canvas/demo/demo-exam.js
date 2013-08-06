demo_exam = [
	label, "demo_exam",

	scene, {src:"black"},
	overlay, {src:"demo/ppttemplate.jpg"},
	
	set, {my_name:"", my_nick:""},
	form, ["Information",
		fieldset, "left_controls",
		input, {name:"Name:", placeholder:"Enter your name", bind:"my_name"},
		input, {name:"Nickname:", placeholder:"Optional", bind:"my_nick"},
		submit, {name:"OK"},
	],
	/* set nickname as name if not given */
	jump, {my_nick:"", label:"fill_nick"},
	jump, "start",
	label, "fill_nick",
	set, {my_nick:"my_name"},
	
	label, "start",
	box, {pos:"center", back:"none"},
	text, "VN-Canvas Demo Exam\n\
Greetings, #my_name#!\n\
You will be given 1 minute to answer 3 questions.\n\
Click mouse button to start.",

	cform, ["timer", false,
		marquee, {name:"timer", x:630, y:10, w:80, h:20, timeout:60, link:[jump, "end_exam"]},
		//marquee, {name:"mq", x:630, y:10, w:80, h:20, fps:0.5, frames:["This", "is", "a", "marquee", "text."]},
		picture, {name:"pic", x:328, y:300, fps:10, 
				frames:["demo/animated0.png",
						"demo/animated1.png",
						"demo/animated2.png",
						"demo/animated3.png",
						"demo/animated4.png",
						"demo/animated5.png",
						"demo/animated6.png",
						"demo/animated7.png"]},
	],
	
	set, {score:0},
	menu, [ "1 + 2 = ?",
		"A. 1", "l1n",
		"B. 2", "l1n",
		"C. 3", {score:"+1"},
		"D. None of the above", "l1n",
	],
	
	/* this automatically checks correct or incorrect */
	/* alternatively, just store answer here on a user variable and check later */
	//label, "l1y",
	//set, {score:"+1"},
	label, "l1n",
	
	menu, [ "sin(45 deg) = ?",
		"A. 1", "l2n",
		"B. sqrt(2)/2", {score:"+1"},
		"C. Pi", "l2n",
		"D. None of the above", "l2n",
	],
	
	//label, "l2y",
	//set, {score:"+1"},
	label, "l2n",

	menu, [ "log(10) = ?",
		"A. 1", {score:"+1"},
		"B. 2", "l3n",
		"C. 3", "l3n",
		"D. None of the above", "l3n",
	],
	
	//label, "l3y",
	//set, {score:"+1"},
	label, "l3n",

	label, "end_exam",
	cform, "close",
	
	/* emulate long computation here... */
	set, {Waiting:0},
	cform, ["wait", false,
		cfelement, {type:"progressBar", name:"Waiting", x:260, y:300, w:200, h:20, timeout:10},
	],
	text, {value:"Please wait while your score is being computed...", duration:10},
	cform, "close",
	
	/* compute remaining time = 60 - timer */
	set, {remain:"timer"},
	set, {remain:"*(-1)"},
	set, {remain:"+60"},
	text, {append:true, value:"#my_nick#, you got #score# correct answers out of 3 "+
							  "in #remain# seconds."},
];

CformElements.progressBar = {
	_init: function (obj, param) {
		var rect = {x:param.x, y:param.y, w:param.w, h:param.h};
		var sprites = ['gray', 'orange'];
		obj.Create(param.name, rect, sprites);
		obj.inputFocus = true;
		// set user variable param.name for the progress bar value
		obj.timeout = param.timeout;
		Helper.setValue(param.name, obj.timeout);
	},
	_update: function (obj, elapsed) {
		if (!obj.aTimerOn) {
			this.aTimer = setTimeout(function() {
				Helper.setValue(obj.id, Helper.getValue(obj.id)-1);
				obj.redraw = true;
				if (Helper.getValue(obj.id) > 0) {
					if (obj.visible) obj.aTimerOn = false;
				}
				else {
					obj.inputFocus = false;
					Stage.pause = false;
				}
			}, 1000 );
			obj.aTimerOn = true;
		}
	},
	_draw: function (obj) {
		obj.DrawImageOrFill(obj.sprites[0]);
		// manually draw the progress bar since this is scaled
		var scale = (obj.timeout - Helper.getValue(obj.id))/obj.timeout;
		obj.context.fillStyle = obj.sprites[1];
		obj.context.fillRect(0,0, scale*obj.context.canvas.width, obj.context.canvas.height);
	}
}