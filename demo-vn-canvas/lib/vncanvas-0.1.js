///////////////////////////////////////////////////////////////////////////////
//  Visual Novel JAVASCRIPT for HTML5 CANVAS by [lo'ner]                     //
//  Author: oclabbao@yahoo.com, oclabbao@gmail.com                           //
//  Based on:                                                                //
//      Construct2 - HTML5 game creator (www.scirra.com)                     //
//      js-vine.js by J. David Eisenberg                                     //
//      enchant.js by Ubiquitous Entertainment Inc.                          //
//      Ren'Py Python VN engine (www.renpy.org)                              //
//  Requires:                                                                //
//      CanvasText by Pere Monfort Pàmies (www.pmphp.net, www.canvastext.com)//
//          - modded to support \n and hover in text                         //
//      [Optional] JQuery by John Resig (jquery.com)                         //
//  Rationale:                                                               //
//      A generic engine, whether event or messaging based, is a bit bloated //
//      for visual novel use. Not only are visual novels notoriously heavy   //
//      on resources (images, media) which engines try to preload at start,  //
//      they also do not require most of the features offered by these       //
//      engines. Hence, this is an attempt to create an engine suitable for  //
//      web-based visual novels, leaving story-tellers with just the task of //
//      story telling. Of course, this is not limited to visual novels, but  //
//      can also be used for ad promotions, PPT-like presentations, etc.     //
//      Oh, did I mention that it's cross-platform on an HTML5-capable       //
//      browser, absolutely malware/adware/spyware free (go ahead, inspect   //
//      the code. bet you can't do that on a flash or server-side script),   //
//      can be used online/offline and, on top of that, FREE.                //
///////////////////////////////////////////////////////////////////////////////
/******************************************************************************
	Copyright © 2011 by OCLabbao a.k.a [lo'ner]
	
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published 
	by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

******************************************************************************/
/******************************************************************************
Revision history:
02.02.12 - Added atmosphere "snow", "rain" direction
01.31.12 - Updated cutscene/movie to play in canvas
		 - Optimized method encapsulation
01.28.12 - Bugfix for non-modal dialog while checkpoint loading
		 - Bugfix for cross-browser compatibility (re:image constructor)
		 - Added timer cform element
		 - Added animated picture cform element
01.25.12 - Added macro for custom javascript
01.12.12 - Updated scene and overlay to accept HTML color
		 - Updated button (cform) to accept HTML color
		 - Optimized memory footprint (a bit)
01.11.12 - Added word filter
		 - Added URL jump
		 - Simplified atmosphere, added cloud and beam
01.09.12 - Added themes
		 - Forms can be instantiated in-game
01.06.12 - Implemented text effects
01.04.12 - Bug fix: avatar, checkpoint
		 - Implemented additional actor effects
		 - Implemented additional overlay effects
		 - Implemented additional background effects
12.30.11 - Simplified 'audio'
12.29.11 - Added configuration file (just the basics)
12.28.11 - Added a subset of HTML forms
12.26.11 - Simplified 'set' and 'jump'
12.25.11 - Added actor avatar
		 - Updated checkpoint saves to include avatar and forms
12.24.11 - Added video for intros, cutscenes, endings
		 - Updated demo and docs
12.21.11 - Added canvas forms (buttons only... so far)
12.20.11 - Added basic saves using checkpoint
         - Completed initial demo
12.08.11 - Added overlay and atmosphere basics
12.06.11 - Added actor basics
12.05.11 - Added script box, flow control using jump
12.01.11 - Basics for background image, music/sounds, flow control using wait
11.27.11 - File creation
******************************************************************************/

// Generic/helper methods
var Helper = {
	// Function for adding an event listener
	addEvent: function (obj, evType, fn, useCapture) {
		if (obj.addEventListener) {
			obj.addEventListener(evType, fn, useCapture);
			return true;
		} else if (obj.attachEvent) {
			var r = obj.attachEvent("on" + evType, fn);
			return r;
		} else {
			alert("Handler could not be attached.");
		}
	},
	// Function for including external javascript files
	includeJs: function (jsFilePath) {
	    var js = document.createElement("script");
	    js.type = "text/javascript";
	    js.src = jsFilePath;
	    //document.getElementsByTagName('head')[0].appendChild(js);
		document.body.appendChild(js);
	},
	// Function to check support for localStorage
	supportsLocalStorage: function () {
	  try {
	    return 'localStorage' in window && window['localStorage'] !== null;
	  } catch(e){
	    return false;
	  }
	},
	// Helper function to search for user variable
	findVar: function (id) {
		for (var i in Stage.variables) {
			if (Stage.variables[i].Name() == id) {
				return i;
			}
		}
		return -1;
	},
	// Helper function to obtain value from stage or config variables
	getValue: function (id) {
		var idx = Helper.findVar(id);
		if (idx != -1)
			return Stage.variables[idx].Value();
		return eval("Config."+id);
	},
	// Helper function to set value to stage or config variables
	setValue: function (id, value) {
		var idx = Helper.findVar(id);
		if (idx != -1)
			Stage.variables[idx].value = value;
		else {
			eval("Config."+id+"="+value);
			// a configuration variable has changed, reflect it back
			Helper.configUpdate(id);
			Stage.redraw = true;
		}
	},
	// Helper function to update game config
	configUpdate: function (id) {
		switch(id) {
			case "activeTheme": 
				// formstyle
				if (Config.activeTheme.formFontStyle) {
					Stage.formStyle.splice(0, Stage.formStyle.length);
					var subs = Helper.parseFontString(Config.activeTheme.formFontStyle);
					if (subs.length >= 4) {
						Stage.formStyle.push(subs.slice(0,3).join(' '));
						Stage.formStyle.push(subs.slice(3).join(' '));
					}
					else
						Stage.formStyle.push(param);
				}
				// tooltips are automatically updated
				// script box
				if (Config.activeTheme.boxFontStyle) { 
					var subs = Helper.parseFontString(Config.activeTheme.boxFontStyle);
					
					if (subs.length > 0) Stage.layers[4][0].fontWeight = subs[0];
					if (subs.length > 1) {
						Stage.layers[4][0].fontSize = subs[1];
						Stage.layers[4][0].lineHeight = eval(subs[1].substring(0,subs[1].length-2)) + 4;
					}			
					if (subs.length > 2) Stage.layers[4][0].fontFamily = subs[2].replace(/\'/g,'');
					if (subs.length > 3) Stage.layers[4][0].fontColor = subs[3];
				}
				if (Config.activeTheme.boxTagStyle) {
					var subs = Helper.parseFontString(Config.activeTheme.boxTagStyle);
					
					if (subs.length > 0) Stage.layers[4][0].tagWeight = subs[0];
					if (subs.length > 1) Stage.layers[4][0].tagSize = subs[1];
					if (subs.length > 2) Stage.layers[4][0].tagFamily = subs[2].replace(/\'/g,'');
					if (subs.length > 3) Stage.layers[4][0].tagColor = subs[3];
				}
				if (Config.activeTheme.boxDimStyle) {
					var subs = Config.activeTheme.boxDimStyle.split(' ');
					Stage.layers[4][0].dimStyle.splice(0,Stage.layers[4][0].dimStyle.length);
					for (var idx in subs)
						Stage.layers[4][0].dimStyle.push(subs[idx]);
				}
				// configure CanvasText
				Stage.layers[4][0].canvasText.config({
			        canvas: Stage.layers[4][0].context.canvas,
			        context: Stage.layers[4][0].context,
			        fontFamily: Stage.layers[4][0].fontFamily,
			        fontSize: Stage.layers[4][0].fontSize,
			        fontWeight: Stage.layers[4][0].fontWeight,
			        fontColor: Stage.layers[4][0].fontColor,
			        lineHeight: Stage.layers[4][0].lineHeight
			    });			
				Stage.layers[4][0].canvasText.defineClass("menu", {
			        fontFamily: Stage.layers[4][0].fontFamily,
			        fontSize: Stage.layers[4][0].fontSize,
			        fontWeight: Stage.layers[4][0].fontWeight,
			        fontColor: Stage.layers[4][0].fontColor,
					fontStyle: "italic"
				});
				break;
			case "volumeAudio":
				for (var idx in Stage.sounds) {
					if (Stage.sounds[idx].length > 0) {
						for (var entry in Stage.sounds[idx]) {
							if ((!Stage.sounds[idx][entry].isPaused) && (!Stage.sounds[idx][entry].isStopping))
								Stage.sounds[idx][entry].audio.volume = Config.volumeAudio;
						}
					}
				}
				break;
			case "volumeVideo":
				for (var idx in Stage.videos) {
					if (!Stage.videos[idx].isStopping) {
						this.videos[idx].movie.volume = Config.volumeVideo;
					}
				}
				break;
		}
	},
	// Helper function to parse font string
	parseFontString: function (s) {
		var splitText = s.split(' ');
		// combine as needed
		var subs = new Array();
		var combine = false;
		var tempText = '';
		for (var i in splitText) {
			if (splitText[i].search("\'")!=-1) {
				if (combine == false) {
					combine = true;
					tempText = splitText[i];
				}
				else {
					combine = false;
					tempText += " " + splitText[i];
					subs.push(tempText);
				}
			}
			else {
				if (combine == true)
					tempText += " " + splitText[i];
				else
					subs.push(splitText[i]);
			}
		}
		return subs;
	},
	// Helper function to check for image file
	checkIfImage: function(src) {
		// crude way of checking if src is an image
		return (/jpg|jpeg|bmp|png|gif/i.test(src));
	},
	// Helper function to process effects
	processEffects: function (obj, elapsed) {
		obj.target_alpha = 1.0;
		switch (obj.effects) {
			case 'scale':
			case 'scalein':
				obj.Reset(false);
				obj.alpha = 1.0;
				obj.drawn = true;
				if (Math.abs(1-obj.target_scale/obj.fxparam) <= 0.01) {
					obj.effects = 'done';
					//obj.drawn = true;
					obj.scale = 1.0;
					//obj.target_scale = 1.0;
				}
				else {
					obj.scale = Math.exp(Math.log(obj.fxparam/obj.target_scale)*elapsed/(obj.transTime * 1000));
					obj.target_scale *= obj.scale;
				}
				break;
			case 'rotate':
			case 'rotatein':
				obj.Reset(false);
				obj.alpha = 1.0;
				obj.drawn = true;
				if (Math.abs(obj.target_rotation - obj.fxparam) <= 0.1) {
					obj.effects = 'done';
					//obj.drawn = true;
					obj.rotation = 0;
					obj.target_rotation = 0;
				}
				else {
					obj.rotation = (obj.fxparam - obj.target_rotation)* elapsed/(obj.transTime * 1000);
					obj.target_rotation += obj.rotation;
				}
				break;
			case 'fadein':
			case 'dissolvein':
			case 'ghostin':
				obj.Reset(false);
				if (obj.effects == 'ghostin') obj.target_alpha = 0.5;
				if (obj.alpha >= obj.target_alpha) {
					obj.effects = 'done';
					obj.drawn = true;
				}
				else {
					obj.alpha += elapsed/(obj.transTime * 1000);
				}
				break;
			case 'fadeout':
			case 'dissolveout':
			case 'ghostout':
				if (obj.alpha <= 0.0) {
					obj.effects = 'done';
					obj.drawn = true;
					obj.visible = false;
				}
				else {
					obj.alpha -= elapsed/(obj.transTime * 1000);
				}
				obj.redraw = true;
				break;
			case 'nonein':
			case 'in':
				obj.Reset(false);
				obj.alpha = 1.0;
				obj.effects = 'done';
				obj.drawn = true;
				break;
			case 'rotateout':
			case 'scaleout':
			case 'noneout':
			case 'out':
				obj.alpha = 0.0;
				obj.effects = 'done';
				obj.drawn = true;
				obj.redraw = true;
				obj.visible = false;
				break;
			case 'left':
			case 'leftin':
				obj.Reset(false);
				obj.drawn = true;
				obj.alpha = 1.0;
				obj.effects = 'done'
				obj.pos.x = -obj.context.canvas.width;
				break;
			case 'right':
			case 'rightin':
				obj.Reset(false);
				obj.drawn = true;
				obj.alpha = 1.0;
				obj.effects = 'done'
				obj.pos.x = Stage.canvas.width + obj.context.canvas.width;
				break;
			case 'bottom':
			case 'bottomin':
				obj.Reset(false);
				obj.drawn = true;
				obj.alpha = 1.0;
				obj.effects = 'done';
				obj.pos.y = Stage.canvas.height + obj.context.canvas.height;
				break;
			case 'top':
			case 'topin':
				obj.Reset(false);
				obj.drawn = true;
				obj.alpha = 1.0;
				obj.effects = 'done';
				obj.pos.y = -obj.context.canvas.height;
				break;
			case 'leftout':
			case 'rightout':
			case 'bottomout':
			case 'topout':
				obj.redraw = true;
				obj.posMode = obj.effects;
				obj.drawn = true;
				obj.effects = 'done';
				break;
			case 'done':
			default:
				obj.drawn = true;
				break;
		}	
	},
	// Helper function to draw visual elements
	drawElements: function(obj, layer, defaults) {
		if (!obj.visible) return false;
		var positionX, positionY;
		var factorX = defaults[0];
		var factorY = defaults[1];
		var running_draw = false;
		switch (obj.posMode) {
			case 'left': factorX = 1/4; break;
			case 'right': factorX = 3/4; break;
			case 'leftout': factorX = -(obj.context.canvas.width/Stage.canvas.width); break;
			case 'rightout': factorX = 1+(obj.context.canvas.width/Stage.canvas.width); break;
			case 'bottomout': factorY = 1+(obj.context.canvas.height/Stage.canvas.height); break;
			case 'topout': factorY = -(obj.context.canvas.height/Stage.canvas.height); break;
			case 'center':
			case 'auto':
			default: break;
		}
		if (Stage.transTime <= 0) {
			positionX = Stage.canvas.width*factorX;
			positionY = Stage.canvas.height*factorY;
			obj.pos.x = positionX;
			obj.pos.y = positionY;
			if (obj.posMode.indexOf('out') != -1) {
				obj.posMode = (layer==1) ? 'auto' : '';
				obj.alpha = 0;
				obj.visible = false;
			}
		}
		else {
			positionX = Stage.transTime * obj.pos.x + (1-Stage.transTime) * Stage.canvas.width*factorX;
			positionY = Stage.transTime * obj.pos.y + (1-Stage.transTime) * Stage.canvas.height*factorY;
			running_draw = true;
		}

		Stage.context.save();
		Stage.context.scale(obj.target_scale, obj.target_scale);
		Stage.context.translate(positionX - obj.target_scale * obj.origin.x + obj.offset[0],
								positionY - obj.target_scale * obj.origin.y + obj.offset[1]);
		Stage.context.drawImage(obj.context.canvas,
								Stage.AddDepth(layer, Stage.canvas.width/2 - Stage.coord.x),
								Stage.AddDepth(layer, Stage.canvas.height/2 - Stage.coord.y)/2,
								obj.context.canvas.width,
								obj.context.canvas.height);	
		Stage.context.restore();
		return running_draw;
	},
	// Helper function to get current speaker
	checkCurrentSpeaker: function(name, append) {
		var current_speaker = '';
		var startIdx = Stage.layers[4][0].text.indexOf(Stage.layers[4][0].tagFamily+";\'>");
		var endIdx = Stage.layers[4][0].text.indexOf("</style><br/>");
		if ((startIdx != -1) && (endIdx != -1)) {
			current_speaker = Stage.layers[4][0].text.substr(startIdx+Stage.layers[4][0].tagFamily.length+3, 
															 endIdx-startIdx-Stage.layers[4][0].tagFamily.length-3);
		}
		//return current_speaker;
		var same_window = false;
		if ((current_speaker != name) || (append == false)) {
			Stage.layers[4][0].cont = false;
			same_window = false;
		}
		else if (append == true) {
			Stage.layers[4][0].cont = true;
			same_window = true;
		}
		else {	// whatever value including undefined
			same_window = Stage.layers[4][0].cont;
		}
		return same_window;
	},
	addTagToDialog: function(tag, tagcolor, text, append) {
		var dialog = '';
		if (tag != null) {
			dialog = "<style=\'font-weight:" + Stage.layers[4][0].tagWeight +
						";color:" + tagcolor + 
						";font-size:" + Stage.layers[4][0].tagSize +
						";font-family:" + Stage.layers[4][0].tagFamily +
						";\'>" + tag + "</style><br/>";
		}
		if (append) {
			// strip speaker name here if present
			var index = Stage.layers[4][0].text.indexOf("</style><br/>");
			if (index!=-1)
				dialog += Stage.layers[4][0].text.slice(index+13);
			else 
				dialog += Stage.layers[4][0].text;
			dialog += '\n';
		}
		if (text != null) {
			var idx = Helper.findVar(text);
			if (idx == -1)
				dialog += text.replace(/\n/g,"<br/>");
			else {
				dialog += Helper.getValue(text).toString().replace(/\n/g,"<br/>");
			}
		}
		
		return Helper.filterBadWords(dialog);
	},
	showTooltip: function(tip) {
		Stage.context.save();
		Stage.context.fillStyle = Config.activeTheme.formTipColor;
		Stage.context.shadowColor = 'black';
		Stage.context.shadowBlur = 2;

		var subs = Helper.parseFontString(Config.activeTheme.formTipStyle);
		Stage.context.font = subs.slice(0,3).join(' ');
		var w = Stage.context.measureText(tip).width;
		var h = parseInt(subs[1]);
		var x = Math.min(Stage.coord.x, Stage.canvas.width - w - 5);
		var y = Math.min(Stage.coord.y, Stage.canvas.height - 2*h - 5);
		Stage.context.fillRect(x-5, y-5+h, w+10, h+10);
		//Stage.context.strokeRect(x-5, y-5+h, w+10, h+10);
		
		Stage.context.shadowBlur = 0;
		Stage.context.fillStyle = subs.slice(3).join(' ');
		Stage.context.textBaseline = 'top';
		Stage.context.fillText(tip, x, y + h);
		Stage.context.restore();
	},
	filterBadWords: function (str) {
		if (Config.gameMatureFilter) {
			var pattern = "/(^|\\n?|\\s*)("+Config.gameBadWords.join('|')+")($|\\n?|\\s*)/img";
			return str.replace(eval(pattern), Config.gameAltWord);
		}
		else
			return str;
	},
	convertTime: function (val) {
		var sec = val % 60;
		var min = (val - sec) / 60;
		min %= 60;
		var hr = (val - sec - 60*min) / 3600;
		if (hr > 0)
			return (hr.toString() + ':' + ((min<10)?'0':'') + min.toString() + ':' + ((sec<10)?'0':'') + sec.toString());
		else
			return (min.toString() + ':' + ((sec<10)?'0':'') + sec.toString());
	}
}
// Function to determine optimal animation frame
window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
    };
})();
// Helper function on window resize
window.onresize = (function(){
	for (var i=0; i<document.forms.length; i++) {
		var x = Stage.canvas.offsetLeft;//- window.pageXOffset;
		var y = Stage.canvas.offsetTop; //- window.pageYOffset;
		document.forms[i].setAttribute('style', 'position:absolute; left:'+x+'px; top:'+y+'px;');
	}
});

// Script method callback/handlers
// label - marks a position in the script
function label(param) { /*alert(param);*/ }
// message - display a message box
function message(param) {
	alert(param);
}
// wait - pauses execution
function wait(param) {
	Stage.pause = true;
	if (param > 0) {
		Stage.utimer = setTimeout(function() { 
			Stage.pause = false; 
			Stage.utimerOn = false;
		}, param * 1000);
		Stage.utimerOn = true;
	}
}
// macro - execute a user function
function macro(param) {
	eval(param).call(this);
}
// set - sets a user variable
function set(param) {
	var str_param = JSON.stringify(param);
	var arr_param = str_param.replace(/[{|}]/g,'').split(/[' '|:|,]/g);
	//alert(arr_param);
	for (var i=0; i<arr_param.length; i+=2) {
		arr_param[i] = eval(arr_param[i]);
		arr_param[i+1] = eval(arr_param[i+1]);
		var idx = Helper.findVar(arr_param[i]);
		if (idx != -1) {
			if (typeof arr_param[i+1] == 'string') {
				// if value is a reference to other variables
				var j = Helper.findVar(arr_param[i+1]);
				if (j != -1) {
					Stage.variables[idx].Set(arr_param[i], Stage.variables[j].Value());
				}
				else {
					// is it an expression with supported operator
					if (arr_param[i+1].search(/[+|-|*|%|\/]/g) != -1) {
						Stage.variables[idx].Set(arr_param[i], eval(Stage.variables[idx].Value() + arr_param[i+1]));
					}
					// or a simple string to set
					else {
						Stage.variables[idx].Set(arr_param[i], arr_param[i+1]);
					}
				}
			}
			else {
				Stage.variables[idx].Set(arr_param[i], arr_param[i+1]);
			}
		}
		else {
			var uv = new UserVars();
			if (typeof arr_param[i+1] == 'string') {
				// if value is a reference to other variables
				var j = Helper.findVar(arr_param[i+1]);
				if (j != -1) {
					uv.Set(arr_param[i], Stage.variables[j].Value());
				}
				else {
					// this is a new variable, don't expect operator elements
					uv.Set(arr_param[i], arr_param[i+1]);
				}
			}
			else {
				uv.Set(arr_param[i], arr_param[i+1]);
			}
			Stage.variables.push(uv);
		}
	}
}
// get - gets value of a user variable
function get(param) {
	var idx = Helper.findVar(param.name);
	if (idx != -1) {
		return Stage.variables[idx].Value();
	}
	return null;
}
// jump - continues execution at given label
function jump(param) {
	if (typeof param == 'string') {
		if (param == 'return') {
			Stage.script.PopFrame();
			Stage.pause = true;
		}
		else if (param.indexOf("http") != -1) {
			window.open(param);
		}
		else {
			Stage.script.PushFrame();
			Stage.script.SetFrame(param);
		}
	}
	else {
		Stage.script.PushFrame();
		var str_param = JSON.stringify(param);
		var arr_param = str_param.replace(/[{|}]/g,'').split(/[' '|:|,]/g);
		//alert(arr_param); // expects only 4 items
		for (var i=0; i<arr_param.length; i+=2) {
			arr_param[i] = eval(arr_param[i]);
			arr_param[i+1] = eval(arr_param[i+1]);
			if (arr_param[i] == 'label') continue;
			
			var idx = Helper.findVar(arr_param[i]);
			if (idx != -1) {
				if (Stage.variables[idx].type == 'number') {
					if (Stage.variables[idx].Value() >= arr_param[i+1])
						Stage.script.SetFrame(param.label);
				}
				else if (Stage.variables[idx].type == 'string') {
					if (Stage.variables[idx].Value() === arr_param[i+1])
						Stage.script.SetFrame(param.label);
				}
				else {
					if (Stage.variables[idx].Value() == arr_param[i+1])
						Stage.script.SetFrame(param.label);
				}
			}
			else {
				// try a config variable
				var val = eval("Config."+arr_param[i]);
				if (val != null) {
					if (typeof val == 'number') {
						if (val > arr_param[i+1])
							Stage.script.SetFrame(param.label);
					}
					else if (typeof val == 'string') {
						if (val === arr_param[i+1])
							Stage.script.SetFrame(param.label);
					}
					else {
						if (val == arr_param[i+1])
							Stage.script.SetFrame(param.label);
					}
				}
			}
		}
	}
	Stage.layers[4][0].jumpTo.splice(0,Stage.layers[4][0].jumpTo.length);
}
// scene - displays a background (layer 0)
function scene(param) {
	var nextid = 0;
	if (Stage.layers[0].length > 0) {
		// background layer has more than one element
		// to conserve memory, maintain only the previous and the incoming backdrop
		while (Stage.layers[0].length > 1) {
			Stage.layers[0].shift();
			// TODO: does removing it from array enough to free memory?
		}
		// do a reverse effect on the previous backdrop
		// current effect is 'done'
		if (param.effect) {
			if ((param.effect == 'dissolve') || 
				(param.effect == 'fade')) {
				Stage.layers[0][0].effects = param.effect + 'out';
			}
			else {
				// do nothing to previous backdrop
				Stage.layers[0][0].effects = 'in';
			}
		}
		else 
			Stage.layers[0][0].effects = 'out';
		Stage.layers[0][0].drawn = false;
		Stage.layers[0][0].update = false;
		nextid = parseInt(Stage.layers[0][0].context.canvas.id.substr(2))+1;
	}
	// add the new background layer
	var bg = new Backdrop();
	var obj = new Array();
	if (param.objects) {
		// assumes multiples of 3
		for (var i=0; i<param.objects.length; i+=3) {
			var item = {src:'', x:0, y:0	};
			item.src = param.objects[i];
			item.x = param.objects[i+1];
			item.y = param.objects[i+2];
			obj.push(item);
		}
	}
	bg.Create('bg' + nextid, param.src, obj);
	if (param.effect) {
		if ((param.effect.indexOf('scale') != -1) || 
			(param.effect.indexOf('rotate') != -1)) {
			var fx = param.effect.split(' ');
			bg.effects = fx[0] + 'in';
			bg.fxparam = parseFloat(fx[1]);
			if (fx[0] == 'rotate') {
				bg.orientation += bg.fxparam;
				bg.orientation %= 360;
			}
			if (fx[0] == 'scale') {
				bg.size = bg.fxparam;
			}
		}
		else 
			bg.effects = param.effect + 'in';
		if ((param.effect == 'fade') && (Stage.layers[0].length > 0))
			bg.alpha = -1;
	}
	else 
		bg.effects = 'in';
	if (param.time != null) bg.transTime = (param.time>0) ? param.time : 0.01;
	Stage.layers[0].push(bg);
	Stage.Transition('show_backdrop');
}
// actor - create and display character (layer 1)
function actor(param) {
	var idx = -1;
	if (Stage.layers[1].length > 0) {
		// look for same id
		for (var i=0; i<Stage.layers[1].length; i++) {
			if (Stage.layers[1][i].id == param.id) {
				idx = i;
				break;
			}
		}
		if (idx != -1) {
			// update an existing actor
			if (param.sprite) {
				if (typeof param.sprite == 'string') {
					for (var i in Stage.layers[1][idx].sprites) {
						if (Stage.layers[1][idx].sprites[i].id == param.sprite) {
							if (Stage.layers[1][idx].visible) {
								Stage.layers[1][idx].prevSprite = Stage.layers[1][idx].activeSprite;
								Stage.layers[1][idx].alpha = 0;
							}
							Stage.layers[1][idx].activeSprite = i;
							break;
						}
					}
				}
				else {
					// assumes array of length 2 to be added to list of sprites
					if (Stage.layers[1][idx].visible) {
						Stage.layers[1][idx].prevSprite = Stage.layers[1][idx].activeSprite;
						Stage.layers[1][idx].alpha = 0;
					}
					Stage.layers[1][idx].AddSprite(param.sprite[0], param.sprite[1]);
				}
			}
			if (param.avatar) {
				Stage.layers[1][idx].AddAvatar(param.avatar);
			}
			if (param.effect) {
				if ((param.effect.indexOf('scale') != -1) || 
					(param.effect.indexOf('rotate') != -1)) {
					var fx = param.effect.split(' ');
					Stage.layers[1][idx].effects = fx[0];
					Stage.layers[1][idx].prevFx = fx[0];
					Stage.layers[1][idx].fxparam = parseFloat(fx[1]);
					if (fx[0] == 'rotate') {
						Stage.layers[1][idx].orientation += Stage.layers[1][idx].fxparam;
						Stage.layers[1][idx].orientation %= 360;
					}
					if (fx[0] == 'scale') {
						Stage.layers[1][idx].size = Stage.layers[1][idx].fxparam;
					}
				}
				else {
					Stage.layers[1][idx].effects = param.effect;
					Stage.layers[1][idx].prevFx = param.effect;
				}
			}
			else
				Stage.layers[1][idx].effects = Stage.layers[1][idx].prevFx;
			//if ((param.remove == true) || (param.show == false))
			if ((param.show == false) ||
				(param.remove == 'actor') || 
				(Stage.layers[1][idx].sprites[Stage.layers[1][idx].activeSprite].id == param.remove) )
				Stage.layers[1][idx].effects += 'out';
			else
				Stage.layers[1][idx].effects += 'in';
			if (param.remove) {
				if (param.remove == 'actor')
					Stage.layers[1][idx].pendingRemoval = true;
				else
					Stage.layers[1][idx].RemoveSprite(param.remove);
			}
				
			if (param.say) {
				var same_window = Helper.checkCurrentSpeaker(Stage.layers[1][idx].nick, param.append);
				Stage.layers[4][0].text = Helper.addTagToDialog(Stage.layers[1][idx].nick, 
																Stage.layers[1][idx].color,
																param.say,
																same_window);
				if (Stage.layers[1][idx].avatar != null)
					Stage.layers[4][0].avatar = Stage.layers[1][idx].avatar;
				else
					Stage.layers[4][0].avatar = null;
				Stage.layers[4][0].alpha = 1;
				Stage.layers[4][0].effects = "none";
				Stage.layers[4][0].scrollOffsetY = 0;
				Stage.layers[4][0].visible = true;
				Stage.layers[4][0].changed = true;
			}
			
			var updchr = '';
			var changepos = false;
			if (param.position) {
				var subs = param.position.split(' ');
				for (var i in subs) {
					if ((subs[i] == 'left') ||
						(subs[i] == 'right') ||
						(subs[i] == 'center') ||
						(subs[i] == 'auto')) {
							Stage.layers[1][idx].posMode = subs[i];
							changepos = true;
						}
					if ((subs[i] == 'front') ||
						(subs[i] == 'back'))
							updchr = subs[i];
				}
			}
			
			// done updating, do not trickle down
			Stage.layers[1][idx].drawn = false;
			Stage.layers[1][idx].update = false;
			//Stage.layers[1][idx].redraw = true;
			if ((Stage.layers[1][idx].visible && (Stage.layers[1][idx].effects.indexOf('out')!=-1)) ||
				(!Stage.layers[1][idx].visible && (Stage.layers[1][idx].effects.indexOf('in')!=-1)) ||
				changepos)
				Stage.Transition('show_actor');
				
			// finally check if a reorder is needed
			if (updchr != '') {
				var chr = Stage.layers[1][idx];
				Stage.layers[1].splice(idx, 1);
				if (updchr == 'front')
					Stage.layers[1].push(chr);
				else if (updchr == 'back')
					Stage.layers[1].unshift(chr);
			}
			return;
		}
	}
	// this is a new actor
	var chr = new Character();
	chr.Create(param.id);
	if (param.nick) 
		chr.nick = param.nick;
	else
		chr.nick = param.id;
	if (param.color)
		chr.color = param.color;
	else
		chr.color = Stage.layers[4][0].tagColor;
	if (param.type)
		chr.type = param.type;
	if (param.sprite) {
		// assumes length == 2
		chr.AddSprite(param.sprite[0], param.sprite[1]);
	}
	if (param.avatar) {
		chr.AddAvatar(param.avatar);
	}
	if (param.effect) {
		if ((param.effect.indexOf('scale') != -1) || 
			(param.effect.indexOf('rotate') != -1)) {
			var fx = param.effect.split(' ');
			chr.effects = fx[0];
			chr.prevFx = fx[0];
			chr.fxparam = parseFloat(fx[1]);
			if (fx[0] == 'rotate') {
				chr.orientation += chr.fxparam;
				chr.orientation %= 360;
			}
			if (fx[0] == 'scale') {
				chr.size = chr.fxparam;
			}
		}
		else {
			chr.effects = param.effect;
			chr.prevFx = param.effect;
		}
		if (param.show == false)
			chr.effects += 'out';
		else
			chr.effects += 'in';
	}
	else {
		if (param.show == false)
			chr.effects = 'out';
		else
			chr.effects = 'in';
	}
	if (param.time != null) chr.transTime = (param.time>0) ? param.time : 0.01;
	if (param.say) {
		// new actor will have new dialog window, continue is ignored
		Stage.layers[4][0].cont = false;
		Stage.layers[4][0].text = Helper.addTagToDialog(chr.nick, chr.color, param.say, false);
		if (chr.avatar != null)
			Stage.layers[4][0].avatar = chr.avatar;
		else
			Stage.layers[4][0].avatar = null;
		Stage.layers[4][0].alpha = 1;
		Stage.layers[4][0].effects = "none";
		Stage.layers[4][0].scrollOffsetY = 0;
		Stage.layers[4][0].visible = true;
		Stage.layers[4][0].changed = true;
	}
	var addchr = 'front';
	if (param.position) {
		var subs = param.position.split(' ');
		for (var i in subs) {
			if ((subs[i] == 'left') ||
				(subs[i] == 'right') ||
				(subs[i] == 'center') ||
				(subs[i] == 'auto'))
					chr.posMode = subs[i];
			if ((subs[i] == 'front') ||
				(subs[i] == 'back'))
					addchr = subs[i];
		}
	}
	if (addchr == 'front')
		Stage.layers[1].push(chr);	
	else
		Stage.layers[1].unshift(chr);
	Stage.Transition('show_actor');
}
// overlay - displays an overlay image (layer 2)
function overlay(param) {
	var nextid = 0;
	Stage.Transition('show_overlay');
	if (Stage.layers[2].length > 0) {
		// overlay layer has more than one element
		// to conserve memory, maintain only the previous and the incoming overlay
		while (Stage.layers[2].length > 1) {
			Stage.layers[2].shift();
		}
		if (!param.src && (param.show != false)) {
			// show the previous overlay
			if (param.effect) {
				if ((param.effect.indexOf('scale') != -1) || 
					(param.effect.indexOf('rotate') != -1)) {
					var fx = param.effect.split(' ');
					Stage.layers[2][0].effects = fx[0] + 'in';
				}
				else
					Stage.layers[2][0].effects = param.effect + 'in';
			}
			else 
				Stage.layers[2][0].effects = 'in';
			Stage.layers[2][0].drawn = false;
			Stage.layers[2][0].update = false;
			return;
		}
		
		// do a reverse effect on the previous overlay
		if (param.effect) {
			if ((param.effect.indexOf('scale') != -1) || 
				(param.effect.indexOf('rotate') != -1)) {
				var fx = param.effect.split(' ');
				Stage.layers[2][0].effects = fx[0] + 'out';
			}
			else
				Stage.layers[2][0].effects = param.effect + 'out';
		}
		else 
			Stage.layers[2][0].effects = 'out';
		Stage.layers[2][0].drawn = false;
		Stage.layers[2][0].update = false;
		nextid = parseInt(Stage.layers[2][0].context.canvas.id.substr(3))+1;
		
		if ((!param.src) && (param.show == false)) {
			// just hiding the previous overlay
			return;
		}
	}
	// add the new overlay layer
	var ovl = new Backdrop();
	ovl.Create('ovl' + nextid, param.src, null);
	if (param.effect) {
		if ((param.effect.indexOf('scale') != -1) || 
			(param.effect.indexOf('rotate') != -1)) {
			var fx = param.effect.split(' ');
			ovl.effects = fx[0] + 'in';
			ovl.fxparam = parseFloat(fx[1]);
			if (fx[0] == 'rotate') {
				ovl.orientation += ovl.fxparam;
				ovl.orientation %= 360;
			}
			if (fx[0] == 'scale') {
				ovl.size = ovl.fxparam;
			}
		}
		else 
			ovl.effects = param.effect + 'in';
	}
	else 
		ovl.effects = 'in';
	if (param.time != null) ovl.transTime = (param.time>0) ? param.time : 0.01;
	if (param.offset) {
		if (typeof (param.offset) == "string") {
			if (param.offset == "scroll")
				ovl.scroll = true;
			else
				ovl.scroll = false;
		}
		else {
			ovl.scroll = false;
			ovl.offset = param.offset;
		}
	}
	else {
		ovl.scroll = false;
		ovl.offset = [0, 0];
	}
	Stage.layers[2].push(ovl);
}
// atmosphere - create atmosphere effects (layer 3)
function atmosphere(param) {
	var str_param = JSON.stringify(param);
	var arr_param = str_param.replace(/[{|}]/g,'').split(/[' '|:|,]/g);
	var type, count, src, action;
	for (var i=0; i<arr_param.length; i+=2) {
		arr_param[i] = eval(arr_param[i]);
		arr_param[i+1] = eval(arr_param[i+1]);
		if ((arr_param[i] == "rain") || 
			(arr_param[i] == "snow") || 	
			(arr_param[i] == "beam")) {
			type = arr_param[i];
			if (typeof arr_param[i+1] == 'number') {
				count = arr_param[i+1];
				action = 'start';
			}
			else
				action = arr_param[i+1];
		}
		else if (arr_param[i] == "cloud") {
			type = arr_param[i];
			if ((arr_param[i+1] == 'start') || (arr_param[i+1] == 'stop'))
				action = arr_param[i+1];
			else {
				src = arr_param[i+1];
				action = 'start';
			}
		}
	}

	var idx = -1;
	var nextid = 0;
	if (Stage.layers[3].length > 0) {
		// look for existing fx
		for (var i=0; i<Stage.layers[3].length; i++ ) {
			if (Stage.layers[3][i].type == type) {
				idx = i;
				break;
			}
		}
		if (idx != -1) {
			if (action)
				Stage.layers[3][idx].action = action;
			else
				Stage.layers[3][idx].action = 'start';
			if (Stage.layers[3][idx].action == 'start') {
				if ((type == "rain") || (type == "snow") ||(type == "beam")) {
					Stage.layers[3][idx].Init(type,
											 (count!=null)?count:null,
											 (param.direction!=null)?param.direction:null);
					if (param.mask)
						Stage.layers[3][idx].mask = param.mask;
				}
				else if (type == "cloud") {
					if (src) Stage.layers[3][idx].src = src;
					Stage.layers[3][idx].Init(type, null,
										     (param.direction!=null)?param.direction:Stage.layers[3][idx].direction);
				}
			}
			return;
		}
		nextid = parseInt(Stage.layers[3][Stage.layers[3].length-1].context.canvas.id.substr(3))+1;
	}
	// this is new fx type
	var atm = new Atmosphere();
	atm.Create('atm' + nextid);
	if (src) atm.src = src;
	atm.Init(type, (count!=null)?count:null, (param.direction!=null)?param.direction:null);
	if (param.mask) atm.mask = param.mask;
	if (action) atm.action = action;
	Stage.layers[3].push(atm);
}
// box - configures script box (layer 4)
function box(param) {
	if (param.show == true)
		Stage.layers[4][0].visible = true;
	else {
		Stage.layers[4][0].visible = false;
		Stage.layers[4][0].text = '';
	}

	if (param.pos) Stage.layers[4][0].pos = param.pos;
	if (param.back) {
		if ((param.back == "none") || (param.back == "dim"))
			Stage.layers[4][0].back = param.back;
		else {
			Stage.layers[4][0].back = 'image';
			Stage.layers[4][0].src = param.back;
		}
	}
	if (param.prompt) {
		if (param.prompt == "none") {
			Stage.layers[4][0].psrc = '';
		}
		else {
			Stage.layers[4][0].isready = false;
			Stage.layers[4][0].psrc = param.prompt;
			Stage.layers[4][0].prompt.src = param.prompt;
		}
	}
	if (param.align) {
		Stage.layers[4][0].textAlign = param.align;
	}

	// assumes this function won't be called unless there are some changes somewhere
	Stage.layers[4][0].changed = true;
}
// text - display text in script box (layer 4)
function text(param) {
	Stage.layers[4][0].avatar = null;
	Stage.layers[4][0].alpha = 1;
	Stage.layers[4][0].effects = "none";
	Stage.layers[4][0].scrollOffsetY = 0;
	if (typeof param == "string") {
		var str = Helper.filterBadWords(param);
		if (Stage.layers[4][0].cont) {
			Stage.layers[4][0].text += '\n' + str.replace(/\n/g,"<br/>");
		}
		else {
			Stage.layers[4][0].text = str.replace(/\n/g,"<br/>");
		}
		//Stage.layers[4][0].text = Helper.filterBadWords(Stage.layers[4][0].text);
		//alert(Stage.layers[4][0].text);
	}
	else {
		if (param.font) { 
			var subs = Helper.parseFontString(param.font);
			
			if (subs.length > 0) Stage.layers[4][0].fontWeight = subs[0];
			if (subs.length > 1) {
				Stage.layers[4][0].fontSize = subs[1];
				Stage.layers[4][0].lineHeight = eval(subs[1].substring(0,subs[1].length-2)) + 4;
			}			
			if (subs.length > 2) Stage.layers[4][0].fontFamily = subs[2];
			if (subs.length > 3) Stage.layers[4][0].fontColor = subs[3];
		}
		if (param.align) {
			Stage.layers[4][0].textAlign = param.align;
		}
		
		if (param.effect) {
			if (param.effect == "fade")
				Stage.layers[4][0].alpha = 0;
			if (param.effect == "scroll")
				Stage.layers[4][0].scrollOffsetY = Stage.layers[4][0].context.canvas.height;
			Stage.layers[4][0].effects = param.effect;
		}
			
		var nick = null;
		var color = '';
		if (param.speaker) {
			nick = param.speaker;
			color = Stage.layers[4][0].tagColor;
			for (var i in Stage.layers[1]) {
				if (Stage.layers[1][i].id == param.speaker) {
					nick = Stage.layers[1][i].nick;
					color = Stage.layers[1][i].color;
					if (Stage.layers[1][i].avatar != null)
						Stage.layers[4][0].avatar = Stage.layers[1][i].avatar;
					else
						Stage.layers[4][0].avatar = null;
					break;
				}
			}
		}
		var same_window = Helper.checkCurrentSpeaker((param.speaker) ? param.speaker : '', param.append);
		Stage.layers[4][0].text = Helper.addTagToDialog(nick, color, 
														(param.value) ? param.value : null, same_window);
		
		if (param.duration > 0) Stage.layers[4][0].timeout = param.duration;
		if (param.offset) {
			Stage.layers[4][0].textOffset.x = param.offset[0];
			Stage.layers[4][0].textOffset.y = param.offset[1];
		}
	}
	//Stage.layers[4][0].avatar = null;	<-- moved to top
	Stage.layers[4][0].visible = true;
	Stage.layers[4][0].changed = true;
}
// menu - display choices in script box (layer 4)
function menu(param) {
	// param is an array of choice-jump pair
	if (Stage.layers[4][0].cont != true)
		Stage.layers[4][0].text = '';
	Stage.layers[4][0].text += param[0];	// prompt
	Stage.layers[4][0].jumpTo.splice(0,Stage.layers[4][0].jumpTo.length);
	for (var i=1; i< param.length; i+=2) {
		Stage.layers[4][0].text += "<br/><class=\'menu\'>" + param[i] + "</class>";
		var menuItem = {hotspot:[], link:param[i+1]};
		Stage.layers[4][0].jumpTo.push(menuItem);
		//Stage.layers[4][0].jumpTo.push(param[i+1])
	}
	Stage.layers[4][0].avatar = null;
	Stage.layers[4][0].visible = true;
	Stage.layers[4][0].changed = true;
	Stage.layers[4][0].inputFocus = true;
}
// button - create a canvas button (layer 4), independent of cform
function button(param) {
	// check existing button w/ same id
	/*
	for (var i in Stage.layers[4]) {
		if ((Stage.layers[4][i].type == "button") && 
			(Stage.layers[4][i].text == param.name)) {
			Stage.layers[4][i].inputFocus = true;
			return;
		}
	}
	*/
	// or new button
	var bt = new ActiveImage();
	var rect = {x:param.x, y:param.y, w:0, h:0};
	if (param.w) rect.w = param.w;
	if (param.h) rect.h = param.h;
	var obj = new Array();
	if (param.base) obj.push(param.base);
	if (param.hover) 
		obj.push(param.hover);
	else
		obj.push(param.base);
	if (param.click) 
		obj.push(param.click);
	else
		obj.push(param.base);
	bt.Create(param.name, rect, obj);
	if (param.link) bt.link = param.link;
	if (param.showText == false)
		bt.showText = false;
	if (param.tip)
		bt.tooltip = param.tip;
	Stage.layers[4].push(bt);
	//Stage.pause = true;
}
// timer - create a canvas form timer (layer 4)
function timer(param) {
	var tm = new ActiveImage();
	tm.type = "animText";
	tm.fps = 1;
	if (param.timeout) tm.timeout = param.timeout;
	if (param.link) tm.link = param.link;
	var rect = {x:param.x, y:param.y, w:param.w, h:param.h};
	tm.Create(param.name, rect, null);
	Stage.layers[4].push(tm);
}
// picture - create a canvas form animated image (layer 4)
function picture(param) {
	var pic = new ActiveImage();
	pic.type = "animImage";
	pic.fps = (param.fps > 1) ? param.fps : 1;
	var rect = {x:param.x, y:param.y, w:0, h:0};
	var obj = new Array();
	for (var i in param.frames) 
		obj.push(param.frames[i]);
	pic.Create(param.name, rect, obj);
	pic.showText = false;
	Stage.layers[4].push(pic);
}
// form - container for canvas form elements such as buttons (layer 4)
function cform(param) {
	if (typeof param == "string") {	// TODO: check array count
		switch (param) {
			case 'close':
				var formid = Stage.formStack.pop();
				var idx = -1;
				var count = 0;
				for (var i in Stage.layers[4]) {
					if (Stage.layers[4][i].group == formid) {
						if (idx == -1) idx = i;
						count++;
					}
				}
				Stage.layers[4].splice(idx, count);
				break;
			case 'hide':
				var formid = Stage.formStack[Stage.formStack.length-1];
				for (var i in Stage.layers[4]) {
					if (Stage.layers[4][i].group == formid) {
						Stage.layers[4][i].visible = false;
						Stage.layers[4][i].inputFocus = false;
						Stage.layers[4][i].redraw = true;
					}
				}
				break;
			case 'show':
				var formid = Stage.formStack[Stage.formStack.length-1];
				for (var i in Stage.layers[4]) {
					if (Stage.layers[4][i].group == formid) {
						Stage.layers[4][i].visible = true;
						//Stage.layers[4][i].inputFocus = true;
						Stage.layers[4][i].redraw = true;
					}
				}
				Stage.pause = true;
				break;
			case 'default':
				// revert back to default style
				Stage.formStyle.splice(0, Stage.formStyle.length);
				var subs = Helper.parseFontString(Config.formStyle);
				if (subs.length >= 4) {
					Stage.formStyle.push(subs.slice(0,3).join(' '));
					Stage.formStyle.push(subs.slice(3).join(' '));
				}
				else
					Stage.formStyle.push(param);
				break;
			default:
				for (var i in Stage.formStack) {
					if (Stage.formStack[i] == param) {
						// put on top of stack
						Stage.formStack.splice(i,1);
						Stage.formStack.push(param)
						// then show it
						for (var i in Stage.layers[4]) {
							if (Stage.layers[4][i].group == param) {
								Stage.layers[4][i].visible = true;
								//Stage.layers[4][i].inputFocus = true;
								Stage.layers[4][i].redraw = true;
							}
						}
						return;
					}
				}
				// else, assume this is a formStyle
				Stage.formStyle.splice(0, Stage.formStyle.length);
				var subs = Helper.parseFontString(param);
				if (subs.length >= 4) {
					Stage.formStyle.push(subs.slice(0,3).join(' '));
					Stage.formStyle.push(subs.slice(3).join(' '));
				}
				else
					Stage.formStyle.push(param);
				break;
		}
	}
	else {
		for (var i in Stage.formStack) {
			if (Stage.formStack[i] == param[0]) {
				// reenable form
				for (var j in Stage.layers[4]) {
					if (Stage.layers[4][j].group == param[0]) {
						Stage.layers[4][j].visible = true;
						//Stage.layers[4][j].inputFocus = true;
						Stage.layers[4][j].redraw = true;
					}
				}
				Stage.pause = param[1];
				return;
			}
		}
		// this is a new form
		Stage.formStack.push(param[0]);
		for (var i=2; i<param.length; i+=2) {
			param[i].call(this, param[i+1]);
			Stage.layers[4][Stage.layers[4].length-1].group = param[0];
		}
		Stage.pause = param[1];
	}
}
// audio - plays a sound
function audio(param) {
	/*
		To conserve memory:
		BGM - only one stored at a time; on new bgm, previous is removed
		BGS - can have multiple bgs playing; use "remove" to clear
		SE - can have multiple se; use "remove" to clear
	*/
	if (!document.createElement('audio').canPlayType) return;
	
	var mimeType = {"wav": "audio/wav",
					"ogg": 'audio/ogg;codecs="vorbis"',
					"mp3": "audio/mpeg"};

	if (param.bgm) {
		if ((Stage.sounds[0].length==0) || (Stage.sounds[0][0].src.search(param.bgm)==-1)) {
			var s = new Sounds();
			if (param.format) {
				s.src = null;
				for (var i in param.format) {
					if (s.audio.canPlayType(mimeType[param.format[i]]) != '') {
						s.src = param.bgm + '.' + param.format[i];
						break;
					}
				}
			}
			while (Stage.sounds[0].length > 0) {
				var old = Stage.sounds[0].shift();
				old.Stop(true);
			}
			s.delay = (param.delay > 0) ? param.delay : 0;
			Stage.sounds[0].push(s);
		}
		else {
			switch (param.action) {
				case "stop":
					Stage.sounds[0][0].Stop(false);
					break;
				case "pause":
					Stage.sounds[0][0].Pause();
					break;
				case "rewind":
					Stage.sounds[0][0].Rewind();
					break;
				case "play":
				default:
					Stage.sounds[0][0].Play(false);
					break;
			}
		}
	}
	if (param.bgs) {
		var index = -1;
		if (Stage.sounds[1].length > 0) {
			for (var i in Stage.sounds[1]) {
				if (Stage.sounds[1][i].src.search(param.bgs) != -1) {
					index = i;
					break;
				}
			}
		}
		if (index != -1) {
			switch (param.action) {
				case "stop":
					Stage.sounds[1][index].Stop(false);
					break;
				case "pause":
					Stage.sounds[1][index].Pause();
					break;
				case "rewind":
					Stage.sounds[1][index].Rewind();
					break;
				case "remove":
					Stage.sounds[1][index].Stop(true);
					Stage.sounds[1].splice(index, 1);
					break;
				case "play":
				default:
					Stage.sounds[1][index].Play(false);
					break;
			}
		}
		else {
			var s = new Sounds();
			if (param.format) {
				s.src = null;
				for (var i in param.format) {
					if (s.audio.canPlayType(mimeType[param.format[i]]) != '') {
						s.src = param.bgs + '.' + param.format[i];
						break;
					}
				}
			}
			s.repeat = -1;
			s.delay = (param.delay > 0) ? param.delay : 0;
			Stage.sounds[1].push(s);
		}
	}
	if (param.se) {
		var index = -1;
		if (Stage.sounds[2].length > 0) {
			for (var i in Stage.sounds[2]) {
				if (Stage.sounds[2][i].src.search(param.se) != -1) {
					index = i;
					break;
				}
			}
		}
		if (index != -1) {
			switch (param.action) {
				case "stop":
					Stage.sounds[2][index].Stop(false);
					break;
				case "pause":
					Stage.sounds[2][index].Pause();
					break;
				case "rewind":
					Stage.sounds[2][index].Rewind();
					break;
				case "remove":
					Stage.sounds[2][index].Stop(true);
					Stage.sounds[2].splice(index, 1);
					break;
				case "play":
				default:
					Stage.sounds[2][index].Play(false);
					break;
			}
		}
		else {
			var s = new Sounds();
			if (param.format) {
				s.src = null;
				for (var i in param.format) {
					if (s.audio.canPlayType(mimeType[param.format[i]]) != '') {
						s.src = param.se + '.' + param.format[i];
						break;
					}
				}
			}
			s.repeat = (param.repeat > 0) ? param.repeat : 0;
			s.delay = (param.delay > 0) ? param.delay : 0;
			Stage.sounds[2].push(s);
		}
	}
}
// video - plays a video (cutscene, etc.)
function video(param) {
	if (!document.createElement('video').canPlayType) return;
	
	var mimeType = {"mp4": 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
					"m4v": 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
					"ogg": 'video/ogg; codecs="theora, vorbis"',
					"ogv": 'video/ogg; codecs="theora, vorbis"',
					"webm": 'video/webm; codecs="vp8, vorbis"'};
				
	var v = new Movie();
	v.src = null;
	for (var i in param.format) {
		if (v.movie.canPlayType(mimeType[param.format[i]]) != '') {
			v.src = param.src + '.' + param.format[i];
			break;
		}
	}	
	Stage.videos.push(v);
	Stage.pause = true;
}
// default form elements
function input(param) {
	var element = document.createElement("input");
	element.name = param.name;
	element.id = param.name;
	if (param.placeholder) element.placeholder = param.placeholder;
	if (param.autofocus) element.autofocus = param.autofocus;
	if (param.bind) {
		element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	return element;
}
function input_label(param, tip) {
	var element = document.createElement("label");
	element.htmlFor = param;
	element.innerHTML = param;
	if (tip) element.title = tip;
		//element.innerHTML += '<span>'+tip+'</span>';
	return element;
}
function textarea(param) {
	var element = document.createElement("textarea");
	element.name = param.name;
	element.id = param.name;
	if (param.placeholder) element.placeholder = param.placeholder;
	if (param.autofocus) element.autofocus = param.autofocus;
	//if (param.rows != null) element.rows = param.rows;
	//if (param.cols != null) element.cols = param.cols;
	if (param.bind) {
		element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	return element;
}
function fieldset(param) {
	var element = document.createElement("fieldset");
	element.id = param;
	return element;
}
function select(param) {
	var element = document.createElement("select");
	element.name = param.name;
	element.id = param.name;
	if (typeof param.options == 'string') {
		var options = Helper.getValue(param.options);
		for (var i=0; i<options.length; i+=2) {
			var opt = document.createElement("option");
			opt.innerText = options[i];
			opt.value = JSON.stringify(options[i+1]);
			element.appendChild(opt);
			if (param.bind) {
				if (opt.value == JSON.stringify(Helper.getValue(param.bind))) 
					element.selectedIndex = i/2;
			}
		}
	}
	else {
		for (var i=0; i<param.options.length; i+=2) {
			var opt = document.createElement("option");
			opt.innerText = param.options[i];
			opt.value = JSON.stringify(param.options[i+1]);
			element.appendChild(opt);
			if (param.bind) {
				if (opt.value == JSON.stringify(Helper.getValue(param.bind)))
					element.selectedIndex = i/2;
			}
		}
	}
	if (param.bind) Stage.formBindings.push([param.name, param.bind]);
	return element;
}
function submit(param) {
	var element = document.createElement("input");
	element.type = "button";
	element.name = param.name;
	element.id = param.name;
	element.value = param.name;
	element.appendChild(document.createTextNode(param.name));
	Helper.addEvent(element, 'click', function(e) {
			if (e.which != 1) return;
			// update bindings here
			for (var idx in Stage.formBindings) {
				var items = document.getElementById(Stage.formBindings[idx][0]);
				//alert(items.type+" "+items.value+" "+items.checked);
				if (items.type == "radio") {
					if (items.checked == true) 
						Helper.setValue(Stage.formBindings[idx][1], JSON.stringify(items.value));
				}
				else if (items.type == "checkbox") {
					Helper.setValue(Stage.formBindings[idx][1], items.checked);
				}
				else if ((items.type == "range") || (items.type == "number")) {
					Helper.setValue(Stage.formBindings[idx][1], items.valueAsNumber);
				}
				else if ((items.type == "text") || (items.type == "textarea")) {
					Helper.setValue(Stage.formBindings[idx][1], JSON.stringify(items.value));
				}
				else {
					Helper.setValue(Stage.formBindings[idx][1], items.value);
				}
			}
			// remove form here
			Stage.activeForm.parent.removeChild(Stage.activeForm.newForm);
			Stage.activeForm = null;
			Stage.pause = false;
        }, false);

	return element;
}
function checkbox(param) {
	var element = document.createElement("input");
	element.type = "checkbox";
	element.name = param.name;
	element.id = param.name;
	if (param.checked)
		element.checked = param.checked;
	else
		element.checked = false;
	if (param.bind) {
		element.checked = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	return element;
}
function radio(param) {
	var element = document.createElement("input");
	element.type = "radio";
	element.name = param.name;
	element.id = param.value;
	element.value = param.value;
	if (param.checked)
		element.checked = param.checked;
	else
		element.checked = false;
	if (param.bind) {
		element.checked = (element.value == Helper.getValue(param.bind));
		Stage.formBindings.push([param.value, param.bind]);
	}
	return element;
}
function spinbox(param) {
	var element = document.createElement("input");
	element.type = "number";
	element.name = param.name;
	element.id = param.name;
	if (param.min != null) element.min = param.min;
	if (param.max != null) element.max = param.max;
	if (param.step != null) element.step = param.step;
	if (param.value != null) element.value = param.value;
	if (param.bind) {
		element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	return element;
}
function slider(param) {
	var element = document.createElement("input");
	element.type = "range";
	element.name = param.name;
	element.id = param.name;
	if (param.min != null) element.min = param.min;
	if (param.max != null) element.max = param.max;
	if (param.step != null) element.step = param.step;
	if (param.value != null) element.value = param.value;
	if (param.bind) {
		element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	return element;
}
// form - create a default HTML form
function form(param) {
	var f = new Form();
	var fset = null;
	f.Create(param[0]);
	for (var i=1; i<param.length; i+=2) {
		// if this element is a fieldset, revert to default fieldset
		if (param[i] == fieldset)
			fset = null;
		
		// append element to active fieldset
		if ((param[i] == input) || 
			(param[i] == select) || 
			(param[i] == spinbox) ||
			(param[i] == slider) ||
			(param[i] == textarea)) {
			f.AddChild(input_label(param[i+1].name, param[i+1].tip), fset);
		}
		f.AddChild(param[i].call(this, param[i+1]), fset);	
		if (param[i] == checkbox) {
			f.AddChild(input_label(param[i+1].name, param[i+1].tip), fset);
		}
		if (param[i] == radio) {
			f.AddChild(input_label(param[i+1].value, param[i+1].tip), fset);
		}
		
		// if this element is a fieldset, attach succeeding elements to it
		if (param[i] == fieldset)
			fset = param[i+1];
	}

	Stage.activeForm = f;
	Stage.pause = true;
}
// checkpoint - loads/saves at a given checkpoint
function checkpoint(param) {
	if (!Helper.supportsLocalStorage()) return;

	if (param == "save") {
		localStorage.clear();
		// Store script entry point
		if (Stage.script.sequence[0] == label) {
			localStorage["sequence"] = Stage.script.sequence[1];
			localStorage["frame"] = Stage.script.frame;
		}
		else {
			localStorage["sequence"] = '';
			localStorage["frame"] = 0;
		}
		// Store jump stack
		localStorage["frameStack"] = JSON.stringify(Stage.script.frameStack);
		// Store layer 0
		localStorage["l0_count"] = Stage.layers[0].length;
		for (var i=0; i<Stage.layers[0].length; i++) {
			localStorage["l0_"+i+"_id"] = Stage.layers[0][i].context.canvas.id;
			if (typeof Stage.layers[0][i].image == 'string')
				localStorage["l0_"+i+"_src"] = Stage.layers[0][i].image;
			else
				localStorage["l0_"+i+"_src"] = Stage.layers[0][i].image.src;
			localStorage["l0_"+i+"_obj_count"] = Stage.layers[0][i].objects.length;
			for (var j=0; j<Stage.layers[0][i].objects.length; j++) {
				localStorage["l0_"+i+"_obj_"+j+"_src"] = Stage.layers[0][i].objects[j].img.src;
				localStorage["l0_"+i+"_obj_"+j+"_x"] = Stage.layers[0][i].objects[j].x;
				localStorage["l0_"+i+"_obj_"+j+"_y"] = Stage.layers[0][i].objects[j].y;
			}
			localStorage["l0_"+i+"_alpha"] = Stage.layers[0][i].alpha;
			localStorage["l0_"+i+"_visible"] = Stage.layers[0][i].visible;
			localStorage["l0_"+i+"_effects"] = Stage.layers[0][i].effects;
			localStorage["l0_"+i+"_time"] = Stage.layers[0][i].transTime;
			if (Stage.layers[0][i].posMode != '')
				localStorage["l0_"+i+"_posMode"] = Stage.layers[0][i].posMode;
			else
				localStorage["l0_"+i+"_posMode"] = "undefined";
			localStorage["l0_"+i+"_orientation"] = Stage.layers[0][i].orientation;
			localStorage["l0_"+i+"_size"] = Stage.layers[0][i].size;
		}
		// Store layer 1
		localStorage["l1_count"] = Stage.layers[1].length;
		for (var i=0; i<Stage.layers[1].length; i++) {
			localStorage["l1_"+i+"_id"] = Stage.layers[1][i].id;
			localStorage["l1_"+i+"_nick"] = Stage.layers[1][i].nick;
			localStorage["l1_"+i+"_color"] = Stage.layers[1][i].color;
			localStorage["l1_"+i+"_spites_count"] = Stage.layers[1][i].sprites.length;
			for (var j=0; j<Stage.layers[1][i].sprites.length; j++) {
				localStorage["l1_"+i+"_sprites_"+j+"_id"] = Stage.layers[1][i].sprites[j].id;
				localStorage["l1_"+i+"_sprites_"+j+"_src"] = Stage.layers[1][i].sprites[j].src.src;			
			}
			if (Stage.layers[1][i].avatar != null)
				localStorage["l1_"+i+"_avatar"] = Stage.layers[1][i].avatar.src;
			else
				localStorage["l1_"+i+"_avatar"] = "undefined";
			localStorage["l1_"+i+"_active"] = Stage.layers[1][i].activeSprite;
			localStorage["l1_"+i+"_alpha"] = Stage.layers[1][i].alpha;
			localStorage["l1_"+i+"_effects"] = Stage.layers[1][i].prevFx;
			localStorage["l1_"+i+"_time"] = Stage.layers[1][i].transTime;
			localStorage["l1_"+i+"_visible"] = Stage.layers[1][i].visible;
			localStorage["l1_"+i+"_pending"] = Stage.layers[1][i].pendingRemoval;
			localStorage["l1_"+i+"_posMode"] = Stage.layers[1][i].posMode;
			//localStorage["l1_"+i+"_fxparam"] = Stage.layers[1][i].fxparam;
			localStorage["l1_"+i+"_orientation"] = Stage.layers[1][i].orientation;
			localStorage["l1_"+i+"_size"] = Stage.layers[1][i].size;
		}
		// Store layer 2
		localStorage["l2_count"] = Stage.layers[2].length;
		for (var i=0; i<Stage.layers[2].length; i++) {
			localStorage["l2_"+i+"_id"] = Stage.layers[2][i].context.canvas.id;
			if (typeof Stage.layers[2][i].image == 'string')
				localStorage["l2_"+i+"_src"] = Stage.layers[2][i].image;
			else
				localStorage["l2_"+i+"_src"] = Stage.layers[2][i].image.src;
			localStorage["l2_"+i+"_alpha"] = Stage.layers[2][i].alpha;
			localStorage["l2_"+i+"_visible"] = Stage.layers[2][i].visible;
			localStorage["l2_"+i+"_effects"] = Stage.layers[2][i].effects;
			localStorage["l2_"+i+"_time"] = Stage.layers[2][i].transTime;
			localStorage["l2_"+i+"_scroll"] = Stage.layers[2][i].scroll;
			localStorage["l2_"+i+"_offset_x"] = Stage.layers[2][i].offset[0];
			localStorage["l2_"+i+"_offset_y"] = Stage.layers[2][i].offset[1];
			if (Stage.layers[2][i].posMode != '')
				localStorage["l2_"+i+"_posMode"] = Stage.layers[2][i].posMode;
			else
				localStorage["l2_"+i+"_posMode"] = "undefined";
			localStorage["l2_"+i+"_orientation"] = Stage.layers[2][i].orientation;
			localStorage["l2_"+i+"_size"] = Stage.layers[2][i].size;
		}
		// Store layer 3
		localStorage["l3_count"] = Stage.layers[3].length;
		for (var i=0; i<Stage.layers[3].length; i++) {
			localStorage["l3_"+i+"_id"] = Stage.layers[3][i].context.canvas.id;
			localStorage["l3_"+i+"_type"] = Stage.layers[3][i].type;
			localStorage["l3_"+i+"_count"] = Stage.layers[3][i].numParticles;
			localStorage["l3_"+i+"_action"] = Stage.layers[3][i].action;
			localStorage["l3_"+i+"_visible"] = Stage.layers[3][i].visible;
			if (Stage.layers[3][i].src != '')
				localStorage["l3_"+i+"_src"] = Stage.layers[3][i].src;
			else
				localStorage["l3_"+i+"_src"] = "undefined";
			if (Stage.layers[3][i].direction != null)
				localStorage["l3_"+i+"_direction"] = Stage.layers[3][i].direction;
			else
				localStorage["l3_"+i+"_direction"] = "undefined";				
			localStorage["l3_"+i+"_radius"] = Stage.layers[3][i].radius;
			localStorage["l3_"+i+"_mask"] = Stage.layers[3][i].mask;
		}
		// Store layer 4
		localStorage["l4_count"] = Stage.layers[4].length;
		for (var i=0; i<Stage.layers[4].length; i++) {
			localStorage["l4_"+i+"_type"] = Stage.layers[4][i].type;
			if (Stage.layers[4][i].type == "box") {
				localStorage["l4_"+i+"_visible"] = Stage.layers[4][i].visible;
				localStorage["l4_"+i+"_text"] = Stage.layers[4][i].text;
				localStorage["l4_"+i+"_pos"] = Stage.layers[4][i].pos;
				localStorage["l4_"+i+"_back"] = Stage.layers[4][i].back;
				if (Stage.layers[4][i].src != '')
					localStorage["l4_"+i+"_src"] = Stage.layers[4][i].src;
				else
					localStorage["l4_"+i+"_src"] = "undefined";
				if (Stage.layers[4][i].psrc != '')
					localStorage["l4_"+i+"_prompt"] = Stage.layers[4][i].psrc;
				else
					localStorage["l4_"+i+"_prompt"] = "undefined";
				localStorage["l4_"+i+"_cont"] = Stage.layers[4][i].cont;
				localStorage["l4_"+i+"_fontFamily"] = Stage.layers[4][i].fontFamily;
				localStorage["l4_"+i+"_fontSize"] = Stage.layers[4][i].fontSize;
				localStorage["l4_"+i+"_lineHeight"] = Stage.layers[4][i].lineHeight;
				localStorage["l4_"+i+"_fontWeight"] = Stage.layers[4][i].fontWeight;
				localStorage["l4_"+i+"_fontColor"] = Stage.layers[4][i].fontColor;
				localStorage["l4_"+i+"_tagFamily"] = Stage.layers[4][i].tagFamily;
				localStorage["l4_"+i+"_tagSize"] = Stage.layers[4][i].tagSize;
				localStorage["l4_"+i+"_tagWeight"] = Stage.layers[4][i].tagWeight;
				localStorage["l4_"+i+"_tagColor"] = Stage.layers[4][i].tagColor;
				localStorage["l4_"+i+"_timeout"] = Stage.layers[4][i].timeout;
				localStorage["l4_"+i+"_textAlign"] = Stage.layers[4][i].textAlign;
				localStorage["l4_"+i+"_offset_x"] = Stage.layers[4][i].textOffset.x;
				localStorage["l4_"+i+"_offset_y"] = Stage.layers[4][i].textOffset.y;
				localStorage["l4_"+i+"_inputFocus"] = Stage.layers[4][i].inputFocus;
				localStorage["l4_"+i+"_alpha"] = Stage.layers[4][i].alpha;
				localStorage["l4_"+i+"_effects"] = Stage.layers[4][i].effects;
				localStorage["l4_"+i+"_jumpTo_count"] = Stage.layers[4][i].jumpTo.length;
				for (var j=0; j<Stage.layers[4][i].jumpTo.length; j++) {
					localStorage["l4_"+i+"jumpTo"+j+"hotspot_x"] = Stage.layers[4][i].jumpTo[j].hotspot[0];
					localStorage["l4_"+i+"jumpTo"+j+"hotspot_y"] = Stage.layers[4][i].jumpTo[j].hotspot[1];
					localStorage["l4_"+i+"jumpTo"+j+"link"] = Stage.layers[4][i].jumpTo[j].link;
				}
			}
			if (Stage.layers[4][i].type == "button") {
				if (Stage.layers[4][i].group != '')
					localStorage["l4_"+i+"_group"] = Stage.layers[4][i].group;
				else
					localStorage["l4_"+i+"_group"] = "undefined";
				localStorage["l4_"+i+"_sprites_count"] = Stage.layers[4][i].sprites.length;
				for (var j=0; j<Stage.layers[4][i].sprites.length; j++) {
					if (typeof Stage.layers[4][i].sprites[j] == 'string')
						localStorage["l4_"+i+"_sprites_"+j] = Stage.layers[4][i].sprites[j];
					else
						localStorage["l4_"+i+"_sprites_"+j] = Stage.layers[4][i].sprites[j].src;
				}
				localStorage["l4_"+i+"_text"] = Stage.layers[4][i].text;
				localStorage["l4_"+i+"_link_0"] = Stage.layers[4][i].link[0].toString().split(/[' '|(|)|{|}]/g, 2)[1];
				localStorage["l4_"+i+"_link_1"] = JSON.stringify(Stage.layers[4][i].link[1]);
				localStorage["l4_"+i+"_visible"] = Stage.layers[4][i].visible;
				localStorage["l4_"+i+"_showText"] = Stage.layers[4][i].showText;
				if (Stage.layers[4][i].tooltip != '')
					localStorage["l4_"+i+"_tooltip"] = Stage.layers[4][i].tooltip;
				else
					localStorage["l4_"+i+"_tooltip"] = "undefined";
				localStorage["l4_"+i+"_rect_x"] = Stage.layers[4][i].rect.x;
				localStorage["l4_"+i+"_rect_y"] = Stage.layers[4][i].rect.y;
				localStorage["l4_"+i+"_rect_w"] = Stage.layers[4][i].rect.w;
				localStorage["l4_"+i+"_rect_h"] = Stage.layers[4][i].rect.h;
			}
			if (Stage.layers[4][i].type == "animText") {
				localStorage["l4_"+i+"_id"] = Stage.layers[4][i].context.canvas.id;
				if (Stage.layers[4][i].group != '')
					localStorage["l4_"+i+"_group"] = Stage.layers[4][i].group;
				else
					localStorage["l4_"+i+"_group"] = "undefined";
				localStorage["l4_"+i+"_text"] = Stage.layers[4][i].text;
				if ((Stage.layers[4][i].link != '') && (Stage.layers[4][i].link.length > 0)) {
					localStorage["l4_"+i+"_link_0"] = Stage.layers[4][i].link[0].toString().split(/[' '|(|)|{|}]/g, 2)[1];
					localStorage["l4_"+i+"_link_1"] = JSON.stringify(Stage.layers[4][i].link[1]);
				}
				else {
					localStorage["l4_"+i+"_link_0"] = "undefined";
					localStorage["l4_"+i+"_link_1"] = "undefined";
				}
				localStorage["l4_"+i+"_visible"] = Stage.layers[4][i].visible;
				localStorage["l4_"+i+"_showText"] = Stage.layers[4][i].showText;
				localStorage["l4_"+i+"_rect_x"] = Stage.layers[4][i].rect.x;
				localStorage["l4_"+i+"_rect_y"] = Stage.layers[4][i].rect.y;
				localStorage["l4_"+i+"_rect_w"] = Stage.layers[4][i].rect.w;
				localStorage["l4_"+i+"_rect_h"] = Stage.layers[4][i].rect.h;
				localStorage["l4_"+i+"_fps"] = Stage.layers[4][i].fps;
				localStorage["l4_"+i+"_countup"] = Stage.layers[4][i].countup;
				localStorage["l4_"+i+"_timeout"] = Stage.layers[4][i].timeout;
			}
			if (Stage.layers[4][i].type == "animImage") {
				localStorage["l4_"+i+"_id"] = Stage.layers[4][i].context.canvas.id;
				if (Stage.layers[4][i].group != '')
					localStorage["l4_"+i+"_group"] = Stage.layers[4][i].group;
				else
					localStorage["l4_"+i+"_group"] = "undefined";
				localStorage["l4_"+i+"_sprites_count"] = Stage.layers[4][i].sprites.length;
				for (var j=0; j<Stage.layers[4][i].sprites.length; j++) {
					if (typeof Stage.layers[4][i].sprites[j] == 'string')
						localStorage["l4_"+i+"_sprites_"+j] = Stage.layers[4][i].sprites[j];
					else
						localStorage["l4_"+i+"_sprites_"+j] = Stage.layers[4][i].sprites[j].src;
				}
				localStorage["l4_"+i+"_visible"] = Stage.layers[4][i].visible;
				localStorage["l4_"+i+"_rect_x"] = Stage.layers[4][i].rect.x;
				localStorage["l4_"+i+"_rect_y"] = Stage.layers[4][i].rect.y;
				localStorage["l4_"+i+"_fps"] = Stage.layers[4][i].fps;
			}
			// TODO: other GUI types
		}
		// Store sounds
		for (var i=0; i<3; i++) {
			localStorage["s"+i+"_count"] = Stage.sounds[i].length;
			for (var j=0; j<Stage.sounds[i].length; j++) {
				localStorage["s"+i+"_"+j+"_src"] = Stage.sounds[i][j].src;
				localStorage["s"+i+"_"+j+"_repeat"] = Stage.sounds[i][j].repeat;
				localStorage["s"+i+"_"+j+"_delay"] = Stage.sounds[i][j].delay;
				localStorage["s"+i+"_"+j+"_isStopping"] = Stage.sounds[i][j].isStopping;
				localStorage["s"+i+"_"+j+"_isPaused"] = Stage.sounds[i][j].isPaused;
			}
		}
		// Store video?? No need. Videos are non-persistent data anyway
		// Store user variables
		localStorage["uv_count"] = Stage.variables.length;
		for (var i=0; i<Stage.variables.length; i++) {
			localStorage["uv"+i+"_name"] = Stage.variables[i].name;
			localStorage["uv"+i+"_value"] = Stage.variables[i].value;
			localStorage["uv"+i+"_type"] = Stage.variables[i].type;
		}
		// Store forms
		localStorage["forms_count"] = Stage.formStack.length;
		for (var i=0; i<Stage.formStack.length; i++) {
			localStorage["formStack_"+i] = Stage.formStack[i];
		}
		localStorage["forms_style_count"] = Stage.formStyle.length;
		for (var i=0; i<Stage.formStyle.length; i++) {
			localStorage["formStyle_"+i] = Stage.formStyle[i];
		}
		// Store config
		localStorage["Config"] = JSON.stringify(Config);
	}
	else if (param == "load") {
		if (localStorage.length <= 0) {
			alert ("No checkpoint data found!\nStarting a new game instead...");
			return;
		}
		// at this point, Stage.Init has been called with empty classes
		// populate layer 0
		Stage.layers[0].splice(0, Stage.layers[0].length);
		for (var i=0; i<parseInt(localStorage["l0_count"]); i++) {
			var bg = new Backdrop();
			var obj = new Array();
			for (var j=0; j<parseInt(localStorage["l0_"+i+"_obj_count"]); j++) {
				var item = {src:'', x:0, y:0};
				item.src = localStorage["l0_"+i+"_obj_"+j+"_src"];
				item.x = parseInt(localStorage["l0_"+i+"_obj_"+j+"_x"]);
				item.y = parseInt(localStorage["l0_"+i+"_obj_"+j+"_y"]);
				obj.push(item);
			}
			bg.Create(localStorage["l0_"+i+"_id"], localStorage["l0_"+i+"_src"], obj);
			bg.effects = localStorage["l0_"+i+"_effects"];
			bg.alpha = parseFloat(localStorage["l0_"+i+"_alpha"]);
			bg.visible = (localStorage["l0_"+i+"_visible"] == "true");
			bg.transTime = parseFloat(localStorage["l0_"+i+"_time"]);
			if (localStorage["l0_"+i+"_posMode"] != "undefined")
				bg.posMode = localStorage["l0_"+i+"_posMode"];
			else
				bg.posMode = '';
			bg.orientation = parseFloat(localStorage["l0_"+i+"_orientation"]);
			bg.rotation = parseFloat(localStorage["l0_"+i+"_orientation"]);
			bg.size = parseFloat(localStorage["l0_"+i+"_size"]);
			bg.target_scale = parseFloat(localStorage["l0_"+i+"_size"]);
			Stage.layers[0].push(bg);
		}
		// populate layer 1
		Stage.layers[1].splice(0, Stage.layers[1].length);
		for (var i=0; i<parseInt(localStorage["l1_count"]); i++) {
			var chr = new Character();
			chr.Create(localStorage["l1_"+i+"_id"]);
			chr.nick = localStorage["l1_"+i+"_nick"];
			chr.color = localStorage["l1_"+i+"_color"];
			for (var j=0; j<parseInt(localStorage["l1_"+i+"_spites_count"]); j++) {
				chr.AddSprite(localStorage["l1_"+i+"_sprites_"+j+"_id"], localStorage["l1_"+i+"_sprites_"+j+"_src"]);
			}
			if (localStorage["l1_"+i+"_avatar"] != "undefined")
				chr.AddAvatar(localStorage["l1_"+i+"_avatar"]);
			else 
				chr.AddAvatar('');
			chr.activeSprite = parseInt(localStorage["l1_"+i+"_active"]);
			chr.alpha = parseFloat(localStorage["l1_"+i+"_alpha"]);
			//chr.effects = localStorage["l1_"+i+"_effects"];
			chr.prevFx = localStorage["l1_"+i+"_effects"];
			chr.transTime = parseFloat(localStorage["l1_"+i+"_time"]);
			chr.visible = (localStorage["l1_"+i+"_visible"] == "true");
			chr.pendingRemoval = (localStorage["l1_"+i+"_pending"] == "true");
			chr.posMode = localStorage["l1_"+i+"_posMode"];
			//chr.fxparam = localStorage["l1_"+i+"_fxparam"];
			chr.orientation = parseFloat(localStorage["l1_"+i+"_orientation"]);
			chr.rotation = parseFloat(localStorage["l1_"+i+"_orientation"]);
			chr.size = parseFloat(localStorage["l1_"+i+"_size"]);
			chr.target_scale = parseFloat(localStorage["l1_"+i+"_size"]);
			Stage.layers[1].push(chr);
		}
		// populate layer 2
		Stage.layers[2].splice(0, Stage.layers[2].length);
		for (var i=0; i<parseInt(localStorage["l2_count"]); i++) {
			var ovl = new Backdrop();
			ovl.Create(localStorage["l2_"+i+"_id"], localStorage["l2_"+i+"_src"], null);
			ovl.effects = localStorage["l2_"+i+"_effects"];
			ovl.alpha = parseFloat(localStorage["l2_"+i+"_alpha"]);
			ovl.visible = (localStorage["l2_"+i+"_visible"] == "true");
			ovl.transTime = parseFloat(localStorage["l2_"+i+"_time"]);
			ovl.scroll = (localStorage["l2_"+i+"_scroll"] == "true");
			ovl.offset = [parseInt(localStorage["l2_"+i+"_offset_x"]), parseInt(localStorage["l2_"+i+"_offset_y"])];
			if (localStorage["l2_"+i+"_posMode"] != "undefined")
				ovl.posMode = localStorage["l2_"+i+"_posMode"];
			else
				ovl.posMode = '';
			ovl.orientation = parseFloat(localStorage["l2_"+i+"_orientation"]);
			ovl.rotation = parseFloat(localStorage["l2_"+i+"_orientation"]);
			ovl.size = parseFloat(localStorage["l2_"+i+"_size"]);
			ovl.target_scale = parseFloat(localStorage["l2_"+i+"_size"]);
			Stage.layers[2].push(ovl);
		}
		// populate layer 3
		Stage.layers[3].splice(0, Stage.layers[3].length);
		for (var i=0; i<parseInt(localStorage["l3_count"]); i++) {
			var atm = new Atmosphere();
			atm.Create(localStorage["l3_"+i+"_id"]);
			if ((localStorage["l3_"+i+"_type"] == "rain") || 
				(localStorage["l3_"+i+"_type"] == "beam")) {
				atm.Init(localStorage["l3_"+i+"_type"], parseInt(localStorage["l3_"+i+"_count"]));
				atm.mask = localStorage["l3_"+i+"_mask"];
				atm.radius = parseInt(localStorage["l3_"+i+"_radius"]);
			}
			else if (localStorage["l3_"+i+"_type"] == "cloud") {
				atm.src = (localStorage["l3_"+i+"_src"] != "undefined") ? localStorage["l3_"+i+"_src"] : '';
				atm.Init(localStorage["l3_"+i+"_type"], (localStorage["l3_"+i+"_direction"] != "undefined") ?
						parseInt(localStorage["l3_"+i+"_direction"]) : null);
			}
			//atm.Init(localStorage["l3_"+i+"_type"], parseInt(localStorage["l3_"+i+"_count"]));
			atm.action = localStorage["l3_"+i+"_action"];
			atm.visible = (localStorage["l3_"+i+"_visible"] == "true");
			Stage.layers[3].push(atm);
		}
		// populate layer 4
		Stage.layers[4].splice(0, Stage.layers[4].length);
		for (var i=0; i<parseInt(localStorage["l4_count"]); i++) {
			if (localStorage["l4_"+i+"_type"] == 'box') {
				var sb = new ScriptBox();
				sb.Create(Stage.canvas.width, Stage.canvas.height);
				sb.visible = (localStorage["l4_"+i+"_visible"] == "true");
				sb.text = localStorage["l4_"+i+"_text"];
				sb.pos = localStorage["l4_"+i+"_pos"];
				sb.back = localStorage["l4_"+i+"_back"];
				if (localStorage["l4_"+i+"_src"] != "undefined")
					sb.src = localStorage["l4_"+i+"_src"];
				else
					sb.src = '';
				if (localStorage["l4_"+i+"_prompt"] != "undefined") {
					sb.psrc = localStorage["l4_"+i+"_prompt"];
					sb.prompt.src = sb.psrc;
				}
				else 
					sb.psrc = '';
				sb.cont = (localStorage["l4_"+i+"_cont"] == "true");
				sb.fontFamily = localStorage["l4_"+i+"_fontFamily"];
				sb.fontSize = localStorage["l4_"+i+"_fontSize"];
				sb.lineHeight = localStorage["l4_"+i+"_lineHeight"];
				sb.fontWeight = localStorage["l4_"+i+"_fontWeight"];
				sb.fontColor = localStorage["l4_"+i+"_fontColor"];
				sb.tagFamily = localStorage["l4_"+i+"_tagFamily"];
				sb.tagSize = localStorage["l4_"+i+"_tagSize"];
				sb.tagWeight = localStorage["l4_"+i+"_tagWeight"];
				sb.tagColor = localStorage["l4_"+i+"_tagColor"];
				sb.timeout = parseFloat(localStorage["l4_"+i+"_timeout"]);
				sb.textAlign = localStorage["l4_"+i+"_textAlign"];
				sb.textOffset.x = parseInt(localStorage["l4_"+i+"_offset_x"]);
				sb.textOffset.y = parseInt(localStorage["l4_"+i+"_offset_y"]);
				sb.inputFocus = (localStorage["l4_"+i+"_inputFocus"] == "true");
				sb.alpha = parseFloat(localStorage["l4_"+i+"_alpha"]);
				sb.effects = localStorage["l4_"+i+"_effects"];
				for (var j=0; j<parseInt(localStorage["l4_"+i+"_jumpTo_count"]); j++) {
					var menuItem = {hotspot:[], link:''};
					menuItem.link = localStorage["l4_"+i+"jumpTo"+j+"link"];
					menuItem.hotspot = [parseInt(localStorage["l4_"+i+"jumpTo"+j+"hotspot_x"]),
											parseInt(localStorage["l4_"+i+"jumpTo"+j+"hotspot_y"])];
					sb.jumpTo.push(menuItem);
				}			
				Stage.layers[4].push(sb);
			}
			if (localStorage["l4_"+i+"_type"] == 'button') {
				var bt = new ActiveImage();
				var rect = {x:0, y:0, w:0, h:0};
				rect.x = parseInt(localStorage["l4_"+i+"_rect_x"]);
				rect.y = parseInt(localStorage["l4_"+i+"_rect_y"]);
				rect.w = parseInt(localStorage["l4_"+i+"_rect_w"]);
				rect.h = parseInt(localStorage["l4_"+i+"_rect_h"]);
				var obj = new Array();
				for (var j=0; j<parseInt(localStorage["l4_"+i+"_sprites_count"]); j++) {
					obj.push(localStorage["l4_"+i+"_sprites_"+j]);
				}
				bt.Create(localStorage["l4_"+i+"_text"], rect, obj);
						  
				bt.visible = (localStorage["l4_"+i+"_visible"] == "true");
				//bt.inputFocus = bt.visible;
				bt.showText = (localStorage["l4_"+i+"_showText"] == "true");
				if (localStorage["l4_"+i+"_group"] != "undefined")
					bt.group = localStorage["l4_"+i+"_group"];
				else
					bt.group = '';
				if (localStorage["l4_"+i+"_tooltip"] != "undefined")
					bt.tooltip = localStorage["l4_"+i+"_tooltip"];
				else
					bt.tooltip = '';
				var link = new Array();
				link.push(eval(localStorage["l4_"+i+"_link_0"]));
				link.push(JSON.parse(localStorage["l4_"+i+"_link_1"]));
				bt.link = link;
				Stage.layers[4].push(bt);
			}
			if (localStorage["l4_"+i+"_type"] == 'animText') {
				var at = new ActiveImage();
				var rect = {x:0, y:0, w:0, h:0};
				rect.x = parseInt(localStorage["l4_"+i+"_rect_x"]);
				rect.y = parseInt(localStorage["l4_"+i+"_rect_y"]);
				rect.w = parseInt(localStorage["l4_"+i+"_rect_w"]);
				rect.h = parseInt(localStorage["l4_"+i+"_rect_h"]);
				at.timeout = parseInt(localStorage["l4_"+i+"_timeout"]);
				at.type = localStorage["l4_"+i+"_type"];
				at.Create(localStorage["l4_"+i+"_id"], rect, null);

				at.text = localStorage["l4_"+i+"_text"];
				at.fps = parseInt(localStorage["l4_"+i+"_fps"]);
				at.countup = (localStorage["l4_"+i+"_countup"] == "true");
				at.visible = (localStorage["l4_"+i+"_visible"] == "true");
				at.showText = (localStorage["l4_"+i+"_showText"] == "true");
				if (localStorage["l4_"+i+"_group"] != "undefined")
					at.group = localStorage["l4_"+i+"_group"];
				else
					at.group = '';
				if ((localStorage["l4_"+i+"_link_0"] != "undefined") && 
					(localStorage["l4_"+i+"_link_1"] != "undefined")) {
					var link = new Array();
					link.push(eval(localStorage["l4_"+i+"_link_0"]));
					link.push(JSON.parse(localStorage["l4_"+i+"_link_1"]));
					at.link = link;
				}
				Stage.layers[4].push(at);
			}
			if (localStorage["l4_"+i+"_type"] == 'animImage') {
				var ai = new ActiveImage();
				var rect = {x:0, y:0, w:0, h:0};
				rect.x = parseInt(localStorage["l4_"+i+"_rect_x"]);
				rect.y = parseInt(localStorage["l4_"+i+"_rect_y"]);
				ai.type = localStorage["l4_"+i+"_type"];
				var obj = new Array();
				for (var j=0; j<parseInt(localStorage["l4_"+i+"_sprites_count"]); j++) {
					obj.push(localStorage["l4_"+i+"_sprites_"+j]);
				}
				ai.Create(localStorage["l4_"+i+"_id"], rect, obj);

				ai.fps = parseInt(localStorage["l4_"+i+"_fps"]);
				ai.visible = (localStorage["l4_"+i+"_visible"] == "true");
				if (localStorage["l4_"+i+"_group"] != "undefined")
					ai.group = localStorage["l4_"+i+"_group"];
				else
					ai.group = '';
				Stage.layers[4].push(at);
			}
			// TODO: other gui
		}
		// Populate sounds
		for (var i=0; i<3; i++) {
			Stage.sounds[i].splice(0, Stage.sounds[i].length);
			for (var j=0; j<parseInt(localStorage["s"+i+"_count"]); j++) {
				var s = new Sounds();
				s.src = localStorage["s"+i+"_"+j+"_src"];
				s.repeat = parseInt(localStorage["s"+i+"_"+j+"_repeat"]);
				s.delay = parseFloat(localStorage["s"+i+"_"+j+"_delay"]);
				s.isStopping = (localStorage["s"+i+"_"+j+"_isStopping"] == "true");
				s.isPaused = (localStorage["s"+i+"_"+j+"_isPaused"] == "true");
				Stage.sounds[i].push(s);
			}
		}
		// populate user variables
		Stage.variables.splice(0, Stage.variables.length);
		for (var i=0; i<parseInt(localStorage["uv_count"]); i++) {
			var uv = new UserVars();
			uv.name = localStorage["uv"+i+"_name"];
			uv.type = localStorage["uv"+i+"_type"];
			if (uv.type == "number")
				uv.value = parseFloat(localStorage["uv"+i+"_value"]);
			else if (uv.type == "boolean")
				uv.value = (localStorage["uv"+i+"_value"] == "true");
			else
				uv.value = localStorage["uv"+i+"_value"];
			Stage.variables.push(uv);
		}
		// populate form stack and style
		Stage.formStack.splice(0, Stage.formStack.length);
		for (var i=0; i<parseInt(localStorage["forms_count"]); i++) {
			Stage.formStack.push(localStorage["formStack_"+i]);
		}
		Stage.formStyle.splice(0, Stage.formStyle.length);
		for (var i=0; i<parseInt(localStorage["forms_style_count"]); i++) {
			Stage.formStyle.push(localStorage["formStyle_"+i]);
		}
		// populate Config
		Config = JSON.parse(localStorage["Config"]);
		// populate frameStack
		Stage.script.frameStack = JSON.parse(localStorage["frameStack"])
		// then jump to checkpoint location
		//alert (localStorage["sequence"] +" "+localStorage["frame"]);
		if (localStorage["sequence"] != '')
			Stage.script.sequence = eval(localStorage["sequence"]);
		Stage.script.frame = parseInt(localStorage["frame"]);
	}
}

// Stage elements
// User variables
function UserVars() {
	var uv = {
		name: 0,
		value: 0,
		type: 0,
		
		Set: function(n, v) {
			this.name = n;
			this.value = v;
			this.type = typeof v;
		},
		
		Value: function() {
			return this.value;
		},
		
		Name: function() {
			return this.name;
		}
	}
	return uv;
}
// Audio elements
function Sounds() {
	var	initd = false;
	var snd = {
		src: 0,
		audio: new Audio(),
		repeat: -1,
		delay: 0,
		isStopping: false,
		isPaused: false,
		
		Play: function(init) {
			if (init && initd) return;
			if ((this.audio != null) &&
				(this.src != null)) {
				if (init) {
					this.audio.src = this.src;
					// loop is buggy or not implemented in firefox, do a manual loop
					/*
					if (this.repeat < 0)
						this.audio.loop = true;
					else {
						Helper.addEvent(this.audio, 'ended', (function(self) {
							return function() {
								if (self.repeat > 0) {
									self.Play(false);
									self.repeat--;
								}
							}
				        })(this), false);					
					}
					*/
					Helper.addEvent(this.audio, 'ended', (function(self) {
						return function() {
							if (self.repeat > 0) {
								self.Play(false);
								self.repeat--;
							}
							else if (self.repeat < 0) {
								self.Play(false);
							}
							else {	// self.repeat == 0
								self.isPaused = true;
							}
						}
					})(this), false);
					this.audio.volume = (Config.volumeAudio != null) ? Config.volumeAudio : 1;
					if (!this.isPaused) {
						if (this.delay > 0)
							setTimeout(function() {
								if (!snd.isPaused && !snd.isStopping)
									snd.audio.play();
							}, this.delay * 1000);
						else
							this.audio.play();
					}
					initd = true;
				}
				else {
					this.audio.volume = (Config.volumeAudio != null) ? Config.volumeAudio : 1;
					this.isPaused = false;
					if (this.delay > 0)
						setTimeout(function() {
							if (!snd.isPaused && !snd.isStopping)
								snd.audio.play();
						}, this.delay * 1000);
					else
						this.audio.play();
				}
			}
		},
		
		Stop: function(immediate) {
			if ((this.audio != null) && 
				(initd)) {
				this.isStopping = true;
				if ((immediate) || (this.audio.volume <= 0)) {
					this.audio.pause();
					this.audio.currentTime = 0;
					this.isStopping = false;
					this.isPaused = true;
				}
				else {
					this.audio.volume = Math.max(0, this.audio.volume-Math.max(0.01, this.audio.volume/4));
				}
			}
		},
		
		Pause: function() {
			if ((this.audio != null) &&
				(initd)) {
				this.audio.pause();
				this.isPaused = true;
			}
		},
		
		Seek: function(pos) {
			if ((this.audio != null) && 
				(initd)) {
				this.audio.currentTime = pos;
			}
		},
		
		Rewind: function() {
			if ((this.audio != null) &&
				(initd)) {
				this.audio.currentTime = 0;
			}
		}
	}
	return snd;
}
// Video element
function Movie() {
	var	initd = false;
	var vid = {
		src: 0,
		movie: document.createElement('video'),
		isStopping: false,
		pos: {x:0, y:0},
		
		Play: function() {
			if (initd)	return;
			
			if ((this.movie != null) && 
				(this.src != null)) {
				
				Helper.addEvent(this.movie, 'ended', (function(self) {
					return function() {
						self.isStopping = true;
					}
				})(this), false);			

				this.movie.src = this.src;
				if (Config.movieSize) {
					this.movie.width = Config.movieSize * Stage.canvas.width;
					this.movie.height = Config.movieSize * Stage.canvas.height;
					this.pos.x += (1.0-Config.movieSize)/2 * Stage.canvas.width;// - window.pageXOffset;
					this.pos.y += (1.0-Config.movieSize)/2 * Stage.canvas.height;// - window.pageYOffset;
				}
				initd = true;
				this.movie.autoplay = true;
				this.movie.volume = (Config.volumeVideo != null) ? Config.volumeVideo : 1;
			}
		},
		
		Stop: function(init) {
			if ((this.movie != null) &&
				(initd)) {
				this.movie.pause();
				Stage.pause = false;
			}
		}
	}
	return vid;
}
// Default form element
function Form() {
	var frm = {
		newForm: document.createElement("form"),
		newFieldset: document.createElement("fieldset"),
		id: 0,
		parent: 0,
		
		Create: function(id) {
			this.newForm.id = id;
			var x = Stage.canvas.offsetLeft;// - window.pageXOffset;
			var y = Stage.canvas.offsetTop; // - window.pageYOffset;
			this.newForm.setAttribute('style', 'position:absolute; left:'+x+'px; top:'+y+'px;');
			
			var newHeading = document.createElement("h1");
			newHeading.innerHTML = id;
			this.newForm.appendChild(newHeading);
			var newHr = document.createElement("hr");
			this.newForm.appendChild(newHr);
			
			this.newFieldset.id = "_fieldset_";
			this.newForm.appendChild(this.newFieldset);

			this.parent = Stage.canvas.parentElement;
			this.parent.appendChild(this.newForm);
			Stage.formBindings.splice(0, Stage.formBindings.length);
		},
		
		AddChild: function(element, fieldsetname) {
			if (fieldsetname != null)
				document.getElementById(fieldsetname).appendChild(element);
			else
				this.newFieldset.appendChild(element);
		}
	}
	return frm;
}
// Background/Overlay image
function Backdrop() {
	var	isready = false,
		loaded = 0;
	var bg = {	
		context: 0,
		image: 0,
		effects: 'none',
		fxparam: '',
		alpha: 0,
		target_alpha: 1,
		rotation: 0,
		target_rotation: 0,
		orientation: 0,
		scale: 1,
		target_scale: 1,
		size: 1,
		transTime: 1,	//#secs transition time
		drawn: false,
		redraw: true,
		visible: true,
		update: false,
		objects: new Array(),
		scroll: false,
		origin: {x:0, y:0},		// backdrop's origin is center
		pos: {x:0, y:0},
		offset:[0,0],
		backdropDim: {w:0, h:0},
		posMode: '',
		
		Create: function(id, file, obj) {
			var canvas = document.createElement('canvas');
			canvas.id = escape(id);
			this.context =  canvas.getContext('2d');

			if (obj) {
				loaded = obj.length + 1;	// total number of images to load
				if (obj.length>0) {
					for (var i in obj) {
						var item = {img:new Image(), x:obj[i].x, y:obj[i].y};
						item.img.onload = function() {
							bg.IsLoaded();
						}
						item.img.src = obj[i].src;
						this.objects.push(item);
					}
				}
			}
			else
				loaded = 1;
			if (Helper.checkIfImage(file)) {
				this.image = new Image();
				this.image.onload = function() {
					// use larger canvas to support sprite rotation
					bg.backdropDim.w = bg.image.width;
					bg.backdropDim.h = bg.image.height;
					var dim = Math.ceil(Math.sqrt(bg.backdropDim.w*bg.backdropDim.w + bg.backdropDim.h*bg.backdropDim.h));
					bg.context.canvas.setAttribute('width', dim);
					bg.context.canvas.setAttribute('height', dim);
					bg.origin.x = dim/2;
					bg.origin.y = dim/2;
					bg.IsLoaded();
				}
				this.image.src = file;
			}
			else {
				// assume valid HTML color
				this.image = file;
				this.context.canvas.setAttribute('width', 1.1*Stage.canvas.width);
				this.context.canvas.setAttribute('height', 1.1*Stage.canvas.height);
				this.origin.x = this.context.canvas.width/2;
				this.origin.y = this.context.canvas.height/2;
				isready = true;
			}
			
			// configure transition
			if (Config.transTime != null) {
				this.transTime = (Config.transTime > 0) ? Config.transTime : 0.01;
			}
			
			this.update = false;
			this.Reset(true);
			return this.context.canvas.id;
		},
		
		IsLoaded: function() {
			if (--loaded <= 0)
				isready = true;
		},
		
		Reset: function(init) {
			if ((init) || (!this.visible)) {
				this.pos.x = Stage.canvas.width/2;
				this.pos.y = Stage.canvas.height/2;
			}
			this.visible = true;
			this.redraw = true;
		},
		
		Update: function(elapsed) {
			if (isready) {
				Helper.processEffects(this, elapsed);
			}
			return this.update;
		},
		
		Draw: function() {
			if (!isready) return false;
			if (!this.redraw) return false;
			
			if (this.visible) {
				this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);		
				this.context.globalAlpha = Math.max(0, Math.min(1, this.alpha));		
				if (this.rotation != 0) {
					this.context.translate(this.context.canvas.width/2, this.context.canvas.height/2);
					this.context.rotate(this.rotation * Math.PI/180);
					this.context.translate(-this.context.canvas.width/2, -this.context.canvas.height/2);
					this.rotation = 0.0;
				}
				if ((this.image.constructor == HTMLImageElement) || (this.image.constructor == Image)) {
					this.context.drawImage(this.image, 
										((this.context.canvas.width - this.backdropDim.w)/2)>>0,
										((this.context.canvas.height - this.backdropDim.h)/2)>>0);
				}
				else {
					this.context.fillStyle = this.image;
					this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);		
				}

				if (this.objects.length > 0) {
					for (var i in this.objects)
						this.context.drawImage(this.objects[i].img, 
											(this.objects[i].x + (this.context.canvas.width - this.backdropDim.w)/2)>>0,
											(this.objects[i].y + (this.context.canvas.height - this.backdropDim.h)/2)>>0);
				}
			}

			this.redraw = false;
			if (this.drawn) this.update = true;
			return true;
		},	
	}
	return bg;
}
// Selectable/clickable image; use for buttons, imagemaps, etc.
function ActiveImage() {
	var	isready = false,
		redraw = true,
		loaded = 0,
		update = false,
		prev_state = '',
		aTimer = 0,
		aTimerOn = false;
	var act = {
		type: 'button',
		group: '',
		context: 0,
		sprites: new Array(),
		inputFocus: false,
		text: '',
		link: '',
		origin: {x:0, y:0},
		rect: {x:0, y:0, w:0, h:0},
		visible: true,
		showText: true,
		
		state: '',
		tooltip: '',
		
		fps: 0,
		timeout: 0,
		countup: 0,
		
		Create: function(id, rect, obj) {
			var canvas = document.createElement('canvas');
			canvas.id = escape(id);
			this.context = canvas.getContext('2d');
			if (this.type == 'animText') {
				// TODO: for now only timer is supported
				this.text = Helper.convertTime(this.timeout);
				// create a user variable with id
				var idx = Helper.findVar(escape(id));
				if (idx != -1) {
					Stage.variables[idx].Set(escape(id), this.timeout);
				}
				else {
					var uv = new UserVars();
					uv.Set(escape(id), this.timeout);
					Stage.variables.push(uv);
				}
				this.countup = !(this.timeout > 0);
			}
			else
				this.text = id;
			this.rect = rect;
			this.origin.x = this.rect.x;
			this.origin.y = this.rect.y;
			
			try {
				if (obj.length>0) {
					loaded = obj.length;
					for (var i in obj) {
						if (Helper.checkIfImage(obj[i])) {
							var item = new Image();
							item.onload = function() {
								act.IsLoaded();
							}
							item.src = obj[i];
							this.sprites.push(item);
							this.rect.w = 0;
							this.rect.h = 0;
						}
						else {
							this.sprites.push(obj[i])
							this.IsLoaded();
						}
					}
				}
			} catch (e) {
				var item = Config.activeTheme.formElementBack;
				this.sprites.push(item);
				this.context.canvas.setAttribute('width',this.rect.w);
				this.context.canvas.setAttribute('height',this.rect.h);
				isready = true;
			}
		},
		IsLoaded: function() {
			if (--loaded <= 0) {
				isready = true;
				// all sprites are assumed same size, set canvas size here
				var idx = 0;
				for (var i in this.sprites) {
					if ((this.sprites[i].constructor == HTMLImageElement) || (this.sprites[i].constructor == Image)) {
						idx = i;
						break;
					}
				}
				if (this.rect.w == 0) {
					this.context.canvas.setAttribute('width',this.sprites[idx].width);
					this.rect.w = this.sprites[0].width;
				}
				else 
					this.context.canvas.setAttribute('width',this.rect.w);
				if (this.rect.h == 0) {
					this.context.canvas.setAttribute('height',this.sprites[idx].height);
					this.rect.h = this.sprites[0].height;
				}			
				else 
					this.context.canvas.setAttribute('height',this.rect.h);
			}
		},
		Update: function(elapsed) {
			if (isready) {
				if (!this.visible) {
					this.inputFocus = false;
					//if (this.aTimerOn)
					//	clearTimeout(this.aTimer);
				}
				else if (this.type == 'button') {
					if (prev_state != this.state) {
						prev_state = this.state;
						redraw = true;	
						if ((this.state == 'hover') || (this.state == 'clicked')) {
							this.inputFocus = true;
							if (this.tooltip != '') Stage.Transition('show_tooltip');
						}
						else
							this.inputFocus = false;
					}
					if (Stage.mouseClick && this.inputFocus) {
						if (this.link != '') {
							this.link[0].call(this, this.link[1]);
							Stage.pause = false;
						}
						redraw = true;
					}
				}
				else if (this.type == 'animText') {
					// TODO: for now only timer is supported
					if (!aTimerOn) {
						aTimer = setTimeout(function() { 
							//alert("set atimeron " + this.fps);
							if (act.countup)
								Helper.setValue(act.context.canvas.id, Helper.getValue(act.context.canvas.id)+1);
							else
								Helper.setValue(act.context.canvas.id, Helper.getValue(act.context.canvas.id)-1);
							act.text = Helper.convertTime(Helper.getValue(act.context.canvas.id));
							redraw = true;
							if (!act.countup) {
								if (Helper.getValue(act.context.canvas.id) > 0) {
									if (act.visible) aTimerOn = false;
								}
								else {
									if (act.link != '') {
										act.link[0].call(act, act.link[1]);
										Stage.pause = false;
									}
								}
							}
							else {
								if (act.visible) aTimerOn = false;
							}
						}, 1000/this.fps);
						aTimerOn = true;
					}
				}
				else if (this.type == 'animImage') {
					if ((!aTimerOn) && (this.sprites.length > 1)) {
						aTimer = setTimeout(function() {
							act.countup++;
							act.countup %= act.sprites.length;
							redraw = true;
							if (act.visible) aTimerOn = false;
						}, 1000/this.fps);
						aTimerOn = true;
					}
				}
			}
			return update;
		},
		Draw: function() {
			if (!isready) return false;
			if (!redraw) return false;

			if (this.visible) {
				this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
				if (this.type == 'button') {
					if ((this.sprites.length>1) && (this.state=='hover')) {
						if ((this.sprites[1].constructor == HTMLImageElement) || (this.sprites[1].constructor == Image))
							this.context.drawImage(this.sprites[1],0,0);
						else {
							this.context.fillStyle = this.sprites[1];
							this.context.fillRect(0,0,this.context.canvas.width,this.context.canvas.height);
						}
					}
					else if ((this.sprites.length>=3) && (this.state=='clicked')) {
						if ((this.sprites[2].constructor == HTMLImageElement) || (this.sprites[2].constructor == Image))
							this.context.drawImage(this.sprites[2],0,0);
						else {
							this.context.fillStyle = this.sprites[2];
							this.context.fillRect(0,0,this.context.canvas.width,this.context.canvas.height);
						}
					}
					else {
						if ((this.sprites[0].constructor == HTMLImageElement) || (this.sprites[0].constructor == Image))
							this.context.drawImage(this.sprites[0],0,0);
						else {
							this.context.fillStyle = this.sprites[0];
							this.context.fillRect(0,0,this.context.canvas.width,this.context.canvas.height);
						}
					}
				}
				else if (this.type == 'animText') {
					if ((this.sprites[0].constructor == HTMLImageElement) || (this.sprites[0].constructor == Image))
						this.context.drawImage(this.sprites[0],0,0);
					else {
						this.context.fillStyle = this.sprites[0];
						this.context.fillRect(0,0,this.context.canvas.width,this.context.canvas.height);
					}
				}
				else if (this.type == 'animImage') {
					if ((this.sprites[this.countup].constructor == HTMLImageElement) || (this.sprites[this.countup].constructor == Image))
						this.context.drawImage(this.sprites[this.countup],0,0);
					else {
						this.context.fillStyle = this.sprites[0];
						this.context.fillRect(0,0,this.context.canvas.width,this.context.canvas.height);
					}
				}
				if ((this.showText) && (this.text != '')) {
					this.context.textBaseline = 'middle';
					this.context.textAlign = 'center';
					if (Stage.formStyle.length > 0)
						this.context.font = Stage.formStyle[0];
					if (Stage.formStyle.length > 1)
						this.context.fillStyle = Stage.formStyle[1];
					this.context.fillText(this.text, this.rect.w/2,this.rect.h/2);
				}			
				if (this.link != '') {
					// create a detectable path
					this.context.beginPath();
					this.context.rect(this.rect.x,this.rect.y,this.rect.w,this.rect.h);
					this.context.closePath();
				}
			}
			
			redraw = false;
			update = true;
			return true;
		},
	}
	return act;
}
// Script box for dialogs
function ScriptBox() {
	var	image = 0,
		vpwidth = 0,
		vpheight = 0,
		redraw = true,
		update = false,
		fxupdate = false,	
		menuHover = -1,
		curLineCount = 0;
	var box = {
		type: 'box',				// identifies type of gui
		group: '',
		pos: 'bottom',		
		back: 'dim',
		src: 0,
		context: 0,
		canvasText: new CanvasText,
		visible: false,
		dimStyle: new Array(),
		origin: {x:0, y:0},			// gui origin is topleft
		
		isready: true,				// flow control
		changed: true,
		cont: false,
		jumpTo: new Array(),
		inputFocus: false,
		timeout: 0,
		
		text: '',					// text display
		prompt: new Image(),
		avatar: null,
		psrc: '',
		alpha: 1,
		effects: 'none',
		scrollOffsetY: 0,
		
		fontFamily: 'Verdana',		// font properties
		fontColor: 'white',
		fontSize: '14px',
		fontWeight: 'normal',
		lineHeight: '18',
		textOffset: {x:10, y:20},
		textAlign: 'start',
		tagFamily: 'Verdana',
		tagColor: '#c8ffc8',
		tagSize: '14px',
		tagWeight: 'bold',
		
		Create: function(w, h) {
			this.src = '';
			vpwidth = w;	// viewport dimensions
			vpheight = h;
			this.origin.x = vpwidth * (1-Config.boxWidth)/2; 	//1/8;
			this.origin.y = vpheight * (1-Config.boxHeight);	//3/4;
			
			// create a default script box: dim at bottom
			var canvas = document.createElement('canvas');
			//this.canvas.id = 'sb_canvas';	// fixed id for script box
			this.context = canvas.getContext('2d');
			this.context.canvas.setAttribute('width', vpwidth * Config.boxWidth);
			this.context.canvas.setAttribute('height', vpheight * Config.boxHeight);
			
			//Helper.configUpdate("activeTheme");

			// create prompt images
			//this.isready = false;
			this.prompt.onload = function() {
					box.isready = true;
			}
			this.prompt.src = this.psrc;			
		},
		
		Update: function(elapsed) {
			if (this.changed || fxupdate) {
				if (this.changed) {
					switch (this.pos) {
						case 'bottom':
							this.origin.x = vpwidth * (1-Config.boxWidth)/2;
							this.origin.y = vpheight * (1-Config.boxHeight);
							this.context.canvas.setAttribute('width', vpwidth * Config.boxWidth);
							this.context.canvas.setAttribute('height', vpheight * Config.boxHeight);
							break;
						case 'center':
							this.origin.x = vpwidth * (1-Config.boxWidth)/2;
							this.origin.y = vpheight * (1-Config.boxHeight)/2;
							this.context.canvas.setAttribute('width', vpwidth * Config.boxWidth);
							this.context.canvas.setAttribute('height', vpheight * Config.boxHeight);
							break;
						case 'top':
							this.origin.x = vpwidth * (1-Config.boxWidth)/2;
							this.origin.y = 0;
							this.context.canvas.setAttribute('width', vpwidth * Config.boxWidth);
							this.context.canvas.setAttribute('height', vpheight * Config.boxHeight);
							break;
						case 'full':
							this.origin.x = vpwidth * (1-Config.boxWidth)/2;
							this.origin.y = vpheight * (1-Config.boxFullHeight)/2;
							this.context.canvas.setAttribute('width', vpwidth * Config.boxWidth);
							this.context.canvas.setAttribute('height', vpheight * Config.boxFullHeight)
							break;
					}
					switch (this.back) {
						case 'image':
							image = new Image();
							this.isready = false;
							image.onload = function() {
								box.isready = true;
							}
							image.src = this.src;
							update = false;
							break;
						case 'none':
						case 'dim':
						default:
							break;
					}
					
					this.canvasText.config({
				        canvas: this.context.canvas,
				        context: this.context,
				        fontFamily: this.fontFamily,
				        fontSize: this.fontSize,
				        fontWeight: this.fontWeight,
				        fontColor: this.fontColor,
				        lineHeight: this.lineHeight
				    });
					this.canvasText.updateCanvas(this.context.canvas);
				}
				switch (this.effects) {
					case 'fade':
						if (this.alpha >= 1) {
							this.effects = 'none';
						}
						else {
							this.alpha += elapsed/(Config.transTime * 1000);
							fxupdate = true;
						}
						update = false;
						break;
					case 'scroll':
						if (this.scrollOffsetY <= -(curLineCount+1) * this.lineHeight) {
							this.effects = 'none';
							//this.scrollOffsetY = 0;
							this.timeout = 0.1;	// setup timer once scroll is finished
						}
						else {
							this.scrollOffsetY -= Config.boxScrollSpeed * elapsed/(Config.transTime * 25);
							fxupdate = true;
							this.timeout = 0;	// disable timer if enabled
						}
						update = false;
						break;
					case 'none':
					default:
						fxupdate = false;
						break;
				}
				
				this.changed = false;			
				redraw = true;
			}
			if (this.CheckHoverOnHotspot()) {
				redraw = true;
			}
			if (Stage.mouseClick && this.inputFocus && (menuHover != -1)) {
				Stage.script.SetFrame(this.jumpTo[menuHover].link);
				this.inputFocus = false;
				menuHover = -1;
				this.jumpTo.splice(0,this.jumpTo.length);
				this.visible = false;
				redraw = true;
			}
			return update;
		},
		
		Draw: function() {
			if (!this.isready) return false;
			if (!redraw) return false;
			
			//alert('ScriptBox.Draw()');
			if (this.visible == true) {
				this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);	
				//this.canvas.width = this.canvas.width;
				if (this.back == 'dim') {
					//alert("image dim");
					this.context.globalAlpha = 0.5;
					if (this.dimStyle.length > 1) {
						var grd=this.context.createLinearGradient(0,0,0,this.context.canvas.height);
						grd.addColorStop(0,this.dimStyle[1]);
						grd.addColorStop(1/this.context.canvas.height,this.dimStyle[0]);
						grd.addColorStop(1,this.dimStyle[1]);
						this.context.fillStyle=grd;
					} 
					else {
						this.context.fillStyle = this.dimStyle[0];
					}
					this.context.fillRect(0,0,this.context.canvas.width,this.context.canvas.height);
				}
				if (this.back == 'image') {
					//alert("image back");
					this.context.globalAlpha = 1;		
					this.context.drawImage(image, 0, 0);
				}

				if (this.text != '') {
					// draw the text
					this.context.globalAlpha = 1;
					// draw the avatar if any
					var avatarOffsetX = 0;
					if (Config.actorShowAvatar == true) {
						if (this.avatar != null) {
							avatarOffsetX = this.avatar.width;
							this.context.drawImage(this.avatar, 
												   (this.textOffset.x/2)>>0, 
												   ((this.context.canvas.height - this.avatar.height)/2)>>0);
						}
					}
					var ret = this.canvasText.drawText({
						text:this.text,
						x: this.textOffset.x + avatarOffsetX,
						y: this.textOffset.y, // + this.scrollOffsetY,
						align: this.textAlign,
						alpha: this.alpha,
						boxWidth:this.context.canvas.width-2*this.textOffset.x - avatarOffsetX,
						scroll: [(this.effects == 'scroll'), this.scrollOffsetY],
					});
					// draw the prompt icon
					if (typeof ret == "object") {
						//vncanvas doesn't use cache or return image
						curLineCount = ret.linecount;
						if (ret.hotspot.length == 0) {
							if ((this.effects == 'none') && (this.psrc != ''))
								this.context.drawImage(this.prompt, 
													   ret.endpt[0]>>0, 
													   (ret.endpt[1] - this.prompt.height)>>0);
						}
						else {
							for (var i=0; i<ret.hotspot.length; i++) {
								this.jumpTo[i].hotspot = ret.hotspot[i];
							}
						}
					}
					// draw hover
					if ((this.jumpTo.length > 0) && (menuHover != -1)) {
						this.context.save();
						this.context.globalAlpha = 0.25;						
						this.context.fillStyle = Config.activeTheme.boxMenuHilite;
						this.context.fillRect(5,this.jumpTo[menuHover].hotspot[1] - this.lineHeight + 4,
												this.context.canvas.width - 10,this.lineHeight);
						this.context.restore();
					}
				}
				
				// Pauses script box
				Stage.pause = true;
				if (!Stage.utimerOn && (this.timeout > 0)) {
					Stage.utimer = setTimeout(function() { 
						Stage.pause = false; 
						Stage.utimerOn = false;
						box.timeout = 0;
					}, this.timeout * 1000);
					Stage.utimerOn = true;
				}
			}
			else {
				Stage.pause = false;
			}
			if (!this.changed) update = true;
			redraw = false;
			return true;
		},
		
		CheckHoverOnHotspot: function() {
			if (Stage.mouseMove == false) return false;
			if (this.jumpTo.length == 0) return false;
			if (this.jumpTo[0].hotspot.length < 2) return false;
			if (Stage.coord.x < this.origin.x) return false;
			if (Stage.coord.x > this.origin.x + vpwidth * Config.boxWidth) return false;
			
			for (var i in this.jumpTo) {
				if (Stage.coord.y < this.origin.y + this.jumpTo[i].hotspot[1] - this.lineHeight) continue;
				if (Stage.coord.y > this.origin.y + this.jumpTo[i].hotspot[1]) continue;
				menuHover = i;
				return true;
			}
			return false;
		},
	}
	return box;
}
// Script element
function Script() {
	var scr = {
		sequence: 0,		// story board, composed of object-value pairs
		frame: 0,			// sequence counter
		frameStack: new Array(),
		
		Init: function(name) {
			this.sequence = name;
			this.frame = 0;
		},
		Update: function() {
			if (this.sequence.length > this.frame) {
				if (typeof(this.sequence[this.frame]) == "function") {
					this.sequence[this.frame].call(this, this.sequence[this.frame+1]);
				}
				this.frame += 2;
			}
			else if (this.sequence.length > 0) {
				/*alert("End of script!");*/
				Stage.update = false;
				Stage.pause = true;
			}
		},
		SetFrame: function(locator) {
			var idx = locator.indexOf('#',0);
			if (idx != -1) {
				this.sequence = eval(locator.substr(0,idx));
			}
			newlabel = locator.substr(idx+1, locator.length-idx-1 );
			for (var i=0; i<this.sequence.length; i+=2){
				if ((this.sequence[i] == label) && (this.sequence[i+1] == newlabel)) {
					this.frame = i;
					return true;
				}
			}
			return false;
		},
		PushFrame: function() {
			var seq_name = '';
			if (this.sequence[0] == label)
				seq_name = this.sequence[1];
			// TODO: limit stack to 8 
			while (this.frameStack.length >= 8)
				this.frameStack.shift();
			this.frameStack.push([seq_name, this.frame-2]);
		},
		PopFrame: function() {
			if (this.frameStack.length > 0) {
				var ret_frame = this.frameStack.pop();
				this.sequence = eval(ret_frame[0]);
				this.frame = ret_frame[1];
			}
		}
	}
	return scr;
}
// Actors
function Character() {
	var	isready = false,
		spriteDim = {w:0, h:0},
		activeSpriteRemoval = false;
	var chr = {
		id: '',
		nick: '',
		color: 0,
		sprites: new Array(),
		prevSprite: -1,
		activeSprite: 0,
		alpha: 0,
		drawn: false,
		update: false,
		redraw: true,
		target_alpha: 0,
		rotation: 0,
		target_rotation: 0,
		orientation: 0,
		scale: 1,
		target_scale: 1,
		size: 1,
		transTime: 1,
		avatar: null,
		
		context: 0,
		origin: {x:0, y:0},		// actor origin is bottom center
		pos: {x:0, y:0},
		offset: [0, 0],			// dummy
		posMode: 'auto',
		
		effects: 'none',
		prevFx: 'none',
		fxparam: '',
		visible: true,
		pendingRemoval: false,
		
		Create: function(id) {
			this.id = id;
			var canvas = document.createElement('canvas');
			canvas.id = escape(id);
			this.context = canvas.getContext('2d');

			// configure transition
			if (Config.transTime != null) {
				this.transTime = (Config.transTime > 0) ? Config.transTime : 0.01;
			}
			isready = true;
			this.update = false;
			this.Reset(true);
			return this.context.canvas.id;
		},
		
		AddSprite: function(tag, file) {
			var idx = -1;
			if (this.sprites.length > 1) {
				for (var i in this.sprites) {
					if (this.sprites[i].id == tag) {
						if (this.sprites[i].src.src.search(file) != -1) {
							// this is same sprite, just do nothing
							isready = true;
							this.update = false;
							this.activeSprite = i;
							return;
						}
						else {
							// this is same tag but different sprite
							// no reason why you should do this, but here it is anyway
							idx = i;
							break;
						}
					}
				}
			}
			isready = false;
			if (idx == -1) {
				var image = new Image();
				var newSprite = {id:tag, src:image};
				this.sprites.push(newSprite);
			} 
			else {
				var tmpSprite = this.sprites[i];
				this.sprites.splice(i, 1)
				this.sprites.push(tmpSprite);
			}
			
			this.sprites[this.sprites.length-1].src.onload = function() {
				// use larger canvas to support sprite rotation
				spriteDim.w = chr.sprites[chr.sprites.length-1].src.width;
				spriteDim.h = chr.sprites[chr.sprites.length-1].src.height;
				//chr.canvas.setAttribute('width', chr.spriteDim.w);
				//chr.canvas.setAttribute('height', chr.spriteDim.h);
				//chr.origin.x = chr.spriteDim.w/2;
				//chr.origin.y = chr.spriteDim.h;
				var dim = Math.ceil(Math.sqrt(spriteDim.w*spriteDim.w + spriteDim.h*spriteDim.h));
				chr.context.canvas.setAttribute('width', dim);
				chr.context.canvas.setAttribute('height', dim);
				chr.origin.x = dim/2;
				chr.origin.y = dim/2 + spriteDim.h/2;
				isready = true;
			}
			this.sprites[this.sprites.length-1].src.src = file;
			this.activeSprite = this.sprites.length-1;
			this.update = false;
		},
		
		RemoveSprite: function(tag) {
			if (this.sprites.length > 1) {
				for (var i in this.sprites) {
					if (this.sprites[i].id == tag) {
						// if i > activeSprite, just remove
						// if i < activeSprite, remove then set activeSprite+1
						// if i == activeSprite, wait until hidden
						if (i > this.activeSprite)
							this.sprites.splice(i, 1);
						else if (i < this.activeSprite) {
							this.sprites.splice(i, 1);
							this.activeSprite = Math.max(this.activeSprite-1, 0);						
						}
						else {
							activeSpriteRemoval = true;
						}
						break;
					}
				}
			}
		},
		
		AddAvatar: function(file) {
			if (file != '') {
				isready = false;
				this.avatar = new Image();
				this.avatar.onload = function() {
					isready = true;
				}
				this.avatar.src = file;
				this.update = false;
			}
			else {
				this.avatar = null;
			}
		},
		
		Reset: function (init) {
			if ((init) || (!this.visible)) {
				this.pos.x = Stage.canvas.width/2;
				this.pos.y = Stage.canvas.height*Config.actorYPosition;
				//this.posMode = 'auto';
			}
			this.visible = true;
			this.redraw = true;
		},
		
		Update: function(elapsed) {
			if (isready) {
				Helper.processEffects(this, elapsed);
			}
			return this.update;
		},
		
		Draw: function() {
			if (!isready) return false;
			if (!this.redraw) return false;
			if (this.activeSprite > this.sprites.length-1) return false;
			
			if (this.visible) {
				this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);		
				if (this.prevSprite >= 0) {
					this.context.globalAlpha = Math.max(0, Math.min(1, this.target_alpha-this.alpha));
					//this.context.drawImage(this.sprites[this.prevSprite].src, 0, 0);
					this.context.drawImage(this.sprites[this.prevSprite].src, 								   
										((this.context.canvas.width - spriteDim.w)/2)>>0,
										((this.context.canvas.height - spriteDim.h)/2)>>0);
					if (this.target_alpha - this.alpha <= 0) this.prevSprite = -1;
				}
				this.context.globalAlpha = Math.max(0, Math.min(1, this.alpha));
				//this.context.drawImage(this.sprites[this.activeSprite].src, 0, 0);
				if (this.rotation != 0) {
					this.context.translate(this.context.canvas.width/2, this.context.canvas.height/2);
					this.context.rotate(this.rotation * Math.PI/180);
					this.context.translate(-this.context.canvas.width/2, -this.context.canvas.height/2);
					this.rotation = 0.0;
				}
				this.context.drawImage(this.sprites[this.activeSprite].src,
									   ((this.context.canvas.width - spriteDim.w)/2)>>0,
									   ((this.context.canvas.height - spriteDim.h)/2)>>0);
				if (activeSpriteRemoval && (this.alpha <= 0)) {
					this.sprites.splice(this.activeSprite, 1);
					this.activeSprite = Math.max(this.activeSprite-1, 0);
					activeSpriteRemoval = false;
				}
			}
					
			this.redraw = false;
			if (this.drawn) this.update = true;
			return true;
		}
	}
	return chr;
}
// Particles for atmosphere effects
function Particle() {
	var	x = 0,
		y = 0,
		xvel = 0,
		yvel = 0,
		viewh = 0,
		vieww = 0,
		dir = 0;
	var part = {
		Create: function(canvas, angle) {
			vieww = canvas.width;
			viewh = canvas.height;
			dir = (90-angle)*Math.PI/180;
			this.Reset();
		},		
		Reset: function() {
			x = Math.random() * 2.0 * vieww - 0.5 * vieww;
			//this.y = Math.random() * this.viewh;
			y = Math.random() * (-viewh);	// somewhere above the canvas
			yvel = Math.random() * 40 + 10;
			//xvel = yvel * Math.tan(Math.PI/12);
			xvel = yvel * Math.tan(dir);
		},
		Update: function(elapsed, reset) {		
			x += 2*xvel;
			y += 2*yvel;
			//this.yvel += 1;		// accelerate
			if ((x > 1.5*vieww) || (y > viewh + 50)) {
				if (reset) 
					this.Reset();
				else 
					return false;
			}
			return true;
		},
		Draw: function(context, type) {
			if (type == 'rain') {
				context.beginPath();
				context.moveTo(x, y);
				context.lineTo(x - xvel, y - yvel);
				context.closePath();
				context.stroke();
			} 
			else if (type == 'snow') {
				var grd = context.createRadialGradient(x, y, yvel/16,
													   x, y, yvel/8);
				grd.addColorStop(0, 'white');
				grd.addColorStop(1, 'rgba(255,255,255,0)');
				context.fillStyle = grd;
				context.fillRect(x-yvel/8,y-yvel/8,yvel/4,yvel/4);
			}
		},
	}
	return part;
}
// Atmosphere special effects
function Atmosphere() {
	var isready = false,
		redraw = true,
		update = false,
		alpha = 0.5,
		pos = {x:0, y:0},
		particles = new Array(),
		image = null;
	var atm = {
		context: 0,
		type: '',
		visible: true,
		action: 'start',
		numParticles: 0,
		src: '',
		direction: null,
		radius: 0,
		mask: 'black',
		
		Create: function(id, type) {
			var canvas = document.createElement('canvas');
			canvas.id = escape(id);
			this.context = canvas.getContext('2d');
			this.context.canvas.setAttribute('width', Stage.canvas.width);
			this.context.canvas.setAttribute('height', Stage.canvas.height);
		
			isready = true;
			update = false;		
			return this.context.canvas.id;
		},
		
		Init: function(type, size, dir) {
			this.type = type;
			if ((this.type == 'rain') || (this.type == 'snow')){
				this.numParticles = size;
				for (var i=0; i<this.numParticles; i++) {
					particles[i] = new Particle();
					particles[i].Create(this.context.canvas,
										(dir!=null)?dir%360:90);
				}
				alpha = 0.5;
				this.visible = true;
			}
			if (this.type == 'cloud') {
				isready = false;
				image = new Image();
				image.onload = function() {
					isready = true;
					atm.visible = true;
				}
				image.src = this.src;
				alpha = 0;
				if (dir != null)
					this.direction = dir % 360;
			}
			if (this.type == 'beam') {
				this.radius = size;
				alpha = 0;
				this.visible = true;
			}
		},

		Update: function(elapsed) {
			if (isready) {
				if ((this.type == 'rain') || (this.type == 'snow')) {
					var running_draw = false;
					for (var i=0; i<this.numParticles; i++) {
						var ret = particles[i].Update(elapsed, (this.action=='start')?true:false);
						if (ret) running_draw = true;
					}
					redraw = running_draw;
					if (!redraw && (this.numParticles>0)) {
						// free some memory by clearing particles, we'll add later if needed again
						particles.splice(0, this.numParticles);
						this.numParticles = 0;
						this.visible = false;
					}
					else if (!redraw && (this.numParticles<=0)) {
						update = true;
					}
				}
				if (this.type == 'cloud') {
					if (this.action == 'stop') {
						if (alpha > 0) {
							alpha -= elapsed/(Config.transTime * 1000)
							redraw = true;
						}
						else {
							image = null;
							this.visible = false;
						}
					}
					else {
						if (alpha < 1) {
							alpha += elapsed/(Config.transTime * 1000);
							redraw = true;
						}
						// scroll it here
						if (this.direction != null) {
							var xdir = Math.cos(this.direction * Math.PI/180);
							var ydir = Math.sin(this.direction * Math.PI/180);
							pos.x += xdir * elapsed / (Config.transTime * 50);
							pos.y += ydir * elapsed / (Config.transTime * 50);
							if (pos.x < -image.width) pos.x = 0;
							if (pos.x > 0) pos.x = -image.width;
							if (pos.y < -image.height) pos.y = 0;
							if (pos.y > 0) pos.y = -image.height;
							redraw = true;
						}
						else {
							pos.x = 0;
							pos.y = 0;
						}
					}
				}
				if (this.type == 'beam') {
					if (this.action == 'stop') {
						if (alpha > 0) {
							alpha -= elapsed/(Config.transTime * 1000)
							redraw = true;
						}
						else {
							this.visible = false;
						}
					}
					else {
						if (alpha < 1) {
							alpha += elapsed/(Config.transTime * 1000);
						}
						redraw = true;
					}
				}
			}
			return update;
		},
		
		Draw: function() {
			if (!isready) return false;
			if (!redraw) return false;

			if (this.visible) {
				this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);		
				this.context.globalAlpha = Math.max(0, Math.min(1, alpha));
				if ((this.type == 'rain') || (this.type == 'snow')) {
					this.context.lineWidth = "1";
					this.context.strokeStyle = "rgb(255, 255, 255)";
					for (var i=0; i<this.numParticles; i++) {
						particles[i].Draw(this.context, this.type);
					}
				}
				if (this.type == 'cloud') {
					// tile it here
					var x = pos.x;
					var y = pos.y;
					while (x<this.context.canvas.width) {
						while (y<this.context.canvas.height) {
							this.context.drawImage(image, x, y);
							y+= image.height;
						}
						y = pos.y;
						x += image.width;
					}
				}
				if (this.type == 'beam') {
					//this.context.fillStyle = 'rgba(0,0,0,1)';
					this.context.fillStyle = this.mask;
					this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);		
					this.context.save();
					this.context.globalCompositeOperation = "destination-out";
					var grd = this.context.createRadialGradient(Stage.coord.x, Stage.coord.y, 0,
																Stage.coord.x, Stage.coord.y, this.radius);
					grd.addColorStop(0, 'rgba(0,0,0,1)');
					grd.addColorStop(0.6, 'rgba(0,0,0,0.8)');
					grd.addColorStop(1, 'rgba(0,0,0,0)');
					this.context.fillStyle = grd;
					this.context.beginPath();
					this.context.arc(Stage.coord.x, Stage.coord.y, this.radius, 0, 2*Math.PI);
					this.context.closePath();
					this.context.fill();
					this.context.restore();
				}
			}
					
			redraw = false;
			update = true;
			return true;
		}
	}
	return atm;
}
// Main Stage
var Stage = {
	canvasid: 0,
	canvas: 0,
	context: 0,
	timer: 0,
	redraw: 0,
	update: 0,
	pause: 0,
	script: 0,
	
	/* user inputs */
	coord: {x:0, y:0},
	click: {x:0, y:0},
	utimer: 0,
	utimerOn: false,
	inputFocus: true,
	
	/* event handling */
	mouseMove: false,
	mouseClick: false,
	mouseUp: false,
	mouseDown: false,
	mouseOut: false,
	touchStart: false,
	touchEnd: false,
	
	/*	FPS count */
	fps: 0,
	curtime: 0,
	prevtime: 0,
	framecount: 0,
	
	/* camera movement */
	// use coord as cameraPos
	targetPos: {x:0, y:0},
	camVelocity: {x:0, y:0},
	prevPos: {x:0, y:0},
	camTime: 0,
	
	/* temporary static data */
	transTime: 0,

	/* 	Normally shouldn't need more than 5 layers,
		the higher the layer, the higher Z order
			- background = 0: backdrop layer
			- foreground = 1: actors in foreground (optionally more than one layer)
			- closeup	 = 2: actors in closeup
			- atmosphere = 3: atmospheric effects, e.g. lightning flash, dim/brighten, smoke, rain, etc.
			- interface  = 4: script box, buttons, ads
	*/
	layers: new Array(5),
	
	/*	User variables that the script can set/get
		useful for checking conditions, etc.
		this is an array of UserVars
	*/
	variables: new Array(),
	
	/*	Sounds to play, 3 types of sound
			- bgm = 0: background music
			- bgs = 1: background sound
			- se  = 2: sound effects
	*/
	sounds: new Array(3),
	
	/* 	Videos to play, currently only one video at a time
			- for intros, cutscenes, etc.
	*/
	videos: new Array(),
	
	/* 	Forms can be used for user required input/configuration
			- top menu (for new game, continue or options)
			- options menu
	*/
	formStack: new Array(),
	formStyle: new Array(),
	formBindings: new Array(),
	activeForm: null,
	
	Init: function(canvasId, width, height) {
		// DEBUG: for FPS monitoring
		this.fps = 0;
		this.prevtime = new Date().getTime();
		this.curtime = this.prevtime;
		this.framecount = 0;
	
		this.canvasid = canvasId;
		this.canvas = document.getElementById(canvasId);
		this.context = this.canvas.getContext('2d');
		this.canvas.setAttribute('width', width);
		this.canvas.setAttribute('height', height);
		this.coord.x = width/2;
		this.coord.y = height/2;
		
		// for camera integrator
		this.targetPos = this.coord;
		this.prevPos = this.coord;

		// add event listeners here for user inputs
		Helper.addEvent(this.canvas, 'mousemove', function(e) {
			Stage.mouseOut = false;
			Stage.mouseUp = false;
			Stage.mouseDown = false;
			Stage.mouseMove = true;
			Stage.HandleEvents(e);
        }, false);
		Helper.addEvent(this.canvas, 'mousedown', function(e) {
			if (e.which != 1) return;
			Stage.mouseDown = true;
			Stage.HandleEvents(e);
        }, false);
		//Helper.addEvent(this.canvas, 'click', function(e) {
		Helper.addEvent(this.canvas, 'mouseup', function(e) {
			if (e.which != 1) return;
			Stage.mouseUp = true;
			Stage.mouseDown = false;
			Stage.HandleEvents(e);
        }, false);
		Helper.addEvent(this.canvas, 'mouseover', function(e) {
			Stage.mouseOut = false;
			Stage.HandleEvents(e);
        }, false);
		Helper.addEvent(this.canvas, 'mouseout', function(e) {
			Stage.mouseOut = true;
			Stage.HandleEvents(e);
        }, false);
		Helper.addEvent(this.canvas, 'touchstart', function(e) {
			e.preventDefault();
			Stage.mouseOut = false;
			Stage.touchStart = true;
			Stage.HandleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'touchmove', function(e) {
			e.preventDefault();
			Stage.mouseOut = false;
			Stage.mouseMove = true;
			Stage.HandleEvents(e);
		}, false);
		Helper.addEvent(this.canvas, 'touchend', function(e) {
			e.preventDefault();
			Stage.mouseOut = false;
			Stage.touchEnd = true;
			Stage.HandleEvents(e);
		}, false);
		// addEventListener to body for 'touchcancel' ?
		Helper.addEvent(document.body, 'touchcancel', function(e) {
			Stage.mouseOut = true;
			Stage.touchStart = false;
			Stage.touchEnd = false;
		}, false);
		
		// create the stage layers
		this.layers[0] = new Array(); 	//background
		this.layers[1] = new Array();	//foreground
		this.layers[2] = new Array();	//closeup
		this.layers[3] = new Array();	//atmosphere
		this.layers[4] = new Array();	//gui
		
		// auto create script box as first element in layers[4]
		var sb = new ScriptBox();
		sb.Create(width, height);
		this.layers[4].push(sb);
		Helper.configUpdate("activeTheme");
		
		// create the sounds playlist
		this.sounds[0] = new Array();
		this.sounds[1] = new Array();
		this.sounds[2] = new Array();
		
		// create the script
		this.script = new Script();
		
		// setup default forms theme
		if (Config.activeTheme.formFontStyle) {
			var subs = Helper.parseFontString(Config.activeTheme.formFontStyle);
			this.formStyle.splice(0, this.formStyle.length);
			if (subs.length >= 4) {
				this.formStyle.push(subs.slice(0,3).join(' '));
				this.formStyle.push(subs.slice(3).join(' '));
			}
			else
				this.formStyle.push(param);
		}

		// setup timer tick
		this.update = true;		// use this.update = false to wait when loading resources
		this.redraw = true;		// use this.redraw = false when redraw not necessary
		this.pause = false;		// use this.pause = true to wait with timer or user input
		this.Tick(1000/60);			// for 60fps
	},
	
	Update: function(elapsed) {
		// Note: set this.redraw to true if update needs a redraw
		this.inputFocus = (this.activeForm == null);
		if (this.layers[4].length > 0) {
			for (var i in this.layers[4]) {
				if (this.layers[4][i].inputFocus) 
					this.inputFocus = false;
			}
		}

		// handle user inputs
		this.camTime += elapsed;
		if (this.camTime > 67) {
			this.coord = this.GetCameraPosition(elapsed, this.inputFocus);
			this.camTime -= 67;		// about 15fps
		}
		if (this.mouseMove || this.CheckCamera()) {
			this.redraw = true;
		}
		
		if (this.mouseClick) {
			if (this.inputFocus)
				this.pause = false;	
			if (this.utimerOn) {
				this.utimerOn = false;
				clearTimeout(this.utimer);
				// TODO: cancel all  that uses this timer
				this.layers[4][0].timeout = 0;
			}
		}

		// update the script
		if (this.update && !this.pause) {
			this.script.Update()
		}

		// play sounds if any
		for (var idx in this.sounds) {
			if (this.sounds[idx].length > 0) {
				for (var entry in this.sounds[idx]) {
					if (this.sounds[idx][entry].isStopping)
						this.sounds[idx][entry].Stop(false);
					else
						this.sounds[idx][entry].Play(true);
				}
			}
		}
		
		// play videos if any
		for (var idx in this.videos) {
			if ((this.videos[idx].isStopping) ||
				(this.mouseClick)){
				this.videos[idx].Stop();
				this.videos.pop();
			}
			else
				this.videos[idx].Play();
		}
		
		var running_update = true;
		for (var idx in this.layers) {
			if (this.layers[idx].length > 0) {
				for (var entry in this.layers[idx]) {
					if (!this.layers[idx][entry].Update(elapsed)) {
						running_update = false;
					}
				}
			}
		}
		this.update = running_update;
		if ((this.update) && (this.transTime > 0))
			this.transTime = Math.max(this.transTime-elapsed/1000, 0);
		
		// reset clicked, assumed processing done
		this.mouseClick = false;
		this.mouseMove = false;
	},
	
	Draw: function() {
		// TODO: clear entire stage first; manage for improved FPS
		if (this.redraw && ((this.layers[0].length > 0) || 
							(this.layers[1].length > 0) ||
							(this.layers[2].length > 0) ||
							(this.layers[3].length > 0) ||
							(this.layers[4].length > 1)	))
			this.context.clearRect(0,0,this.canvas.width,this.canvas.height);

		var running_draw = false;			
		// draw background here
		if (this.layers[0].length > 0) {
			for (var i in this.layers[0]) {
				if (this.layers[0][i].Draw()) running_draw = true;
				if (this.redraw) {
					if (Helper.drawElements(this.layers[0][i], 0, [1/2, 1/2])) 
						running_draw = true;
				}
			}
		}
		
		// draw foreground here
		if (this.layers[1].length > 0) {
			// get number of visible & auto actors
			var count = 1;
			for (var i in this.layers[1]) {
				if ((this.layers[1][i].visible) && (this.layers[1][i].posMode == 'auto')) count++;
			}
			// compute auto-positioning
			var spritepos = new Array();
			for (var i=1; i<count; i++) {
				if (i%2 == 0) {	// even
					spritepos.push((count-i/2)/count);
				}
				else {	// odd
					spritepos.push((((i/2)>>0)+1)/count);
				}
			}
			// display actors
			for (var i in this.layers[1]) {
				if (this.layers[1][i].Draw()) running_draw = true;
				if (this.redraw) {
					if (this.layers[1][i].visible) {
						if (Helper.drawElements(this.layers[1][i], 1, 
							[(this.layers[1][i].posMode == 'auto') ? spritepos.shift() : 1/2, Config.actorYPosition]))
							running_draw = true;
					}
					else if (this.layers[1][i].pendingRemoval) {
						this.layers[1].splice(i, 1);
					}
				}
			}
		}
		
		// draw overlay/closeup here
		if (this.layers[2].length > 0) {
			for (var i in this.layers[2]) {
				if (this.layers[2][i].Draw()) running_draw = true;
				if (this.redraw && this.layers[2][i].visible) {
					if (this.layers[2][i].scroll) {
						this.context.save();
						this.context.scale(this.layers[2][i].target_scale, this.layers[2][i].target_scale);
						this.context.translate((-this.layers[2][i].target_scale*(this.layers[2][i].context.canvas.width-this.layers[2][i].backdropDim.w)/2 
												-(this.layers[2][i].target_scale*this.layers[2][i].backdropDim.w-this.canvas.width)*(this.coord.x/this.canvas.width))>>0,
											   (-this.layers[2][i].target_scale*(this.layers[2][i].context.canvas.height-this.layers[2][i].backdropDim.h)/2
											    -(this.layers[2][i].target_scale*this.layers[2][i].backdropDim.h-this.canvas.height)*(this.coord.y/this.canvas.height))>>0);
						this.context.drawImage(this.layers[2][i].context.canvas, 0, 0,
												this.layers[2][i].context.canvas.width,
												this.layers[2][i].context.canvas.height);
						this.context.restore();
					}
					else {
						if (Helper.drawElements(this.layers[2][i], 2, [1/2, 1/2])) 
							running_draw = true;
					}
				}
			}
		}
		
		// draw atmosphere effects here
		if (this.layers[3].length > 0) {
			for (var i in this.layers[3]) {
				if (this.layers[3][i].Draw()) running_draw = true;
				if (this.redraw && this.layers[3][i].visible) {
					this.context.drawImage(this.layers[3][i].context.canvas, 0, 0);
				}
			}
		}
		
		// draw gui here
		if (this.layers[4].length > 0) {
			for (var i in this.layers[4]) {
				if (this.layers[4][i].Draw()) running_draw = true;
				if (this.redraw && this.layers[4][i].visible) {
					this.context.drawImage(this.layers[4][i].context.canvas, 
										   this.layers[4][i].origin.x>>0, 
										   this.layers[4][i].origin.y>>0);
				}
			}
			// draw tooltips if any
			for (var i in this.layers[4]) {
				if (this.redraw && this.layers[4][i].visible) {
					if ((this.layers[4][i].state == 'hover') && (this.layers[4][i].tooltip)){
						if (this.transTime <= 0)
							Helper.showTooltip(this.layers[4][i].tooltip);
					}
				}
			}
		}

		// draw videos here
		if (this.videos.length > 0) {
			for (var idx in this.videos) {
				this.context.drawImage(this.videos[idx].movie,
									   this.videos[idx].pos.x,
									   this.videos[idx].pos.y,
									   this.videos[idx].movie.width, 
									   this.videos[idx].movie.height);
			}
		}

		// update redraw variable
		this.redraw = running_draw;
	},
	
	HandleEvents: function(evt) {
		if (this.mouseOut) return;
		// all mouse and touch moves
		this.targetPos = (this.touchStart) ? this.GetTouchPosition(this.canvas, evt) :
											 this.GetMousePosition(this.canvas, evt);
					 
		// mouse click / touch end
		if (this.mouseUp || this.touchEnd) {
			this.click = this.coord;	// used only for debug
			this.mouseClick = true;
			this.mouseUp = false;
			this.touchEnd = false;
			this.touchStart = false;
		}
		else if (this.mouseDown || this.touchStart) {
			for (var i in Stage.layers[4]) {
				if (Stage.layers[4][i].type == "button") {
					if (Stage.layers[4][i].context.isPointInPath(this.targetPos.x, this.targetPos.y)) {
						Stage.layers[4][i].state = 'clicked';
					}
					else
						Stage.layers[4][i].state = '';
				}
			}
		}
		else if (this.mouseMove) {
			for (var i in Stage.layers[4]) {
				if (Stage.layers[4][i].type == "button") {
					if (Stage.layers[4][i].context.isPointInPath(this.targetPos.x, this.targetPos.y)) {
						Stage.layers[4][i].state = 'hover';
					}
					else
						Stage.layers[4][i].state = '';
				}
			}
		}
	},
	
	AddDepth: function(layer, dist) {
		if (!Config.actorPerspective) return 0;
		//if (!this.inputFocus) return 0;
		switch(layer) {
			case 0:		// this is background layer
				return 0.1 * dist;
			case 1:		// this is foreground layer
				return 0.2 * dist;
			case 2:		// this is overlay layer
			default:
				break;
		}
		return 0;
	},
	
	GetMousePosition: function(obj, event) {
		var pos = {x:0, y:0};
		//pos.x = event.clientX - obj.offsetLeft + window.pageXOffset;
		//pos.y = event.clientY - obj.offsetTop + window.pageYOffset;
		pos.x = event.pageX - obj.offsetLeft;
		pos.y = event.pageY - obj.offsetTop;
		pos.x = Math.max(0, Math.min(obj.width, pos.x));
		pos.y = Math.max(0, Math.min(obj.height, pos.y));
		return pos;
	},
	
	GetTouchPosition: function(obj, event) {
		var pos = {x:0, y:0};
		/*if ((event.touches != null) && (event.touches.length == 1)) {
			pos.x = event.touches[0].clientX - obj.offsetLeft + window.pageXOffset;
			pos.y = event.touches[0].clientY - obj.offsetTop + window.pageYOffset;
			pos.x = Math.max(0, Math.min(this.canvas.width, pos.x));
			pos.y = Math.max(0, Math.min(this.canvas.height, pos.y));
			return pos;
        }*/
		pos.x = event.targetTouches[0].pageX - obj.offsetLeft;
		pos.y = event.targetTouches[0].pageY - obj.offsetTop;
		pos.x = Math.max(0, Math.min(obj.width, pos.x));
		pos.y = Math.max(0, Math.min(obj.height, pos.y));
		return pos;
	},
	
	GetCameraPosition: function(elapsed, spring) {
		if (spring) {
			if ((Math.abs(this.coord.x-this.targetPos.x)<0.1) && (Math.abs(this.coord.y-this.targetPos.y)<0.1))
			{
				//this.camVelocity.x = 0;
				//this.camVelocity.y = 0;
				this.prevPos = this.targetPos;
				return this.targetPos;
			}
			// TODO: integrator issues in Opera, for now just do an easing position
			var camPos = {x:0, y:0};		
			camPos.x = (this.targetPos.x + this.coord.x)/2;
			camPos.y = (this.targetPos.y + this.coord.y)/2;
			this.prevPos = this.coord;
			
			/** //Euler integration
			var camPos = {x:0, y:0};		
			var forceX = -18 * (this.coord.x - this.targetPos.x) - 10 * this.camVelocity.x;
			var forceY = -18 * (this.coord.y - this.targetPos.y) - 10 * this.camVelocity.y;
			this.camVelocity.x += forceX * elapsed/1000;
			this.camVelocity.y += forceY * elapsed/1000;
			camPos.x = this.coord.x + this.camVelocity.x * elapsed/1000;
			camPos.y = this.coord.y + this.camVelocity.y * elapsed/1000;
			**/
			/** //Verlet integration
			var drag = 0.35;
			var camPos = {x:0, y:0};		
			var forceX = -5 * (this.coord.x - this.targetPos.x);
			var forceY = -5 * (this.coord.y - this.targetPos.y);
			camPos.x = (2 - drag) * this.coord.x -
					   (1 - drag) * this.prevPos.x +
					   (forceX) * (elapsed/1000) * (elapsed/1000);
			camPos.y = (2 - drag) * this.coord.y -
					   (1 - drag) * this.prevPos.y +
					   (forceY) * (elapsed/1000) * (elapsed/1000);
			this.prevPos = this.coord;
			**/
			return camPos;
		}	
		else {
			this.prevPos = this.targetPos;
			return this.targetPos;	
		}
	},
	
	CheckCamera: function() {
		if (Math.abs(this.camVelocity.x) > 0.1) return true;
		if (Math.abs(this.camVelocity.y) > 0.1) return true;
		if (Math.abs(this.coord.x-this.targetPos.x) > 0.1) return true;
		if (Math.abs(this.coord.x-this.targetPos.x) > 0.1) return true;
		return false;
	},
	
	Transition: function(type) {
		if ((type == 'show_actor') || 
			(type == 'show_overlay') ||
			(type == 'show_backdrop') || 
			(type == 'show_tooltip'))
			this.transTime = (Config.transTime != null) ? Config.transTime : 0.01;
	},
	
	Tick: function(interval) {	
		var now = new Date().getTime();
		var elapsed = now - this.curtime;	// time since last update
		this.curtime = now;
		this.framecount++;
		if (this.curtime - this.prevtime >= 1000) {
			this.prevtime = this.curtime;
			this.fps = this.framecount;
			this.framecount = 0;
		}
		
		if (window.jQuery) {
			// DEBUG:
			//$('#debug').html(this.timer);
			//$('#debug').html(elapsed);
			//$('#debug').html(Stage.coord.x +', '+ Stage.coord.y);
			//$('#debug').html(Stage.targetPos.x +', '+ Stage.targetPos.y);
			//$('#debug').html(eval(Stage.coord.x - Stage.targetPos.x) +', '+ eval(Stage.coord.y-Stage.targetPos.y));
			//$('#debug').html(Stage.click.x +', '+ Stage.click.y);
			//$('#debug').html(this.script.frame/2 + ' ' + this.update);
			$('#debug').html('FPS: '+ this.fps + ' Frame: ' + this.script.frame/2);
			//$('#debug').html(Stage.camVelocity.x +', '+Stage.camVelocity.y);
		}


		// update the stage
		this.Update(elapsed);
		
		// draw the stage
		this.Draw();

		/* 	Optional:
			For the update and draw methods, setup a timer with random timeout.
			This causes the update and draw to start/operate independently, like
				setTimeout(Stage.Update, 5*Math.random());
				setTimeout(Stage.Draw, 5*Math.random());
			TODO: check for possible implementation ???
		*/
		
		/* 	Optional: ???
			TODO: implement a message dispatcher for Update or Draw methods,
					calling the methods as needed instead of a successive call
		*/
			
		// setup next timer tick
		// usually, ticks should use setInterval, but if update() and draw() takes
		// a long time, the next tick might come before the functions have finished.
		// hence, instead of using flags to check for busy, just make sure the
		// functions have completed before scheduling the next pass
		//this.timer = setTimeout(function() { Stage.Tick(interval); }, interval);
		requestAnimFrame(function(){
			Stage.Tick(interval);
		});
	}
};

// ensure config is not null
var Config = {};
// finally, the script and config is loaded
for (var j in TOC) {
	Helper.includeJs(TOC[j]);
}