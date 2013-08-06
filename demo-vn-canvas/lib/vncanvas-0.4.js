///////////////////////////////////////////////////////////////////////////////
//  Visual Novel JAVASCRIPT Engine for HTML5 CANVAS by [lo'ner]              //
//  Author: oclabbao@yahoo.com, oclabbao@gmail.com                           //
//  Based on:                                                                //
//      Construct2 - HTML5 game creator (www.scirra.com)                     //
//      js-vine.js by J. David Eisenberg                                     //
//      enchant.js by Ubiquitous Entertainment Inc.                          //
//      Ren'Py Python VN engine (www.renpy.org)                              //
//  Requires:                                                                //
//      CanvasText by Pere Monfort Pàmies (www.pmphp.net, www.canvastext.com)//
//          - modded to support \n, hover and scroll in text                 //
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
	Copyright © 2013 by OCLabbao a.k.a [lo'ner]

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
Version 0.4 Chelsea
02.22.13 - support for "actor" shortcut
02.19.13 - "actor" support for animated avatars
		 - Bugfix: fix 'true' or 'false' string in dialog
02.17.13 - Bugfix: fix size and position of multiple sprites
02.10.13 - "actor" support for animated sprites
02.07.13 - "scene" support for animated objects
12.29.12 - "menu" supports user variable set
12.24.12 - Support _range attribute for actor stats
		 - Support '$' prepend on jump labels, to skip push on frame stack
12.01.12 - Prep for RPG MOD Pack
Version 0.3 Brenda
10.12.12 - Bugfix: touch devices reset fix (courtesy of Turker Yasa)
05.15.12 - Added 'random' generator for user variables
		 - Added a parameter to 'macro' calls
		 - Added multiple conditions for 'jump'
05.04.12 - Added auto-revealing map to 'tile' navigation
		 - Bugfix: local storage variable persist flag fix
04.23.12 - Optimized 'skip' text storage
		 - Bugfix: sprite reuse using tags
		 - Support multiple avatars reuse thru tags
		 - Added screen action 'fall'
04.22.12 - Added actor 'stats' plugin
04.17.12 - Added 'skip read text' function for quick replay
		 - Added toggle mode for 'button'
04.14.12 - Added lookAhead option to preload next resources while idle
		 - Converted 'timer' cform element to a generic text display element
		 - Bugfix: added actor 'voice' to auto preload
		 - Bugfix: added Config-defined format in auto preload
		 - Bugfix: repeat 'animation' fix
04.10.12 - Added 'map' and 'tile' navigation
04.06.12 - Added custom 'animation' set
		 - Added tryit editor for developers
		 - Bugfix on movement effects (broken due to 'nowait')
Version 0.2 Althea
03.06.12 - Added 'z_order' for actor
		 - Setting a variable to null deletes it
		 - Support persistent user variable
		 - Support multiple named 'checkpoints'
03.04.12 - Added screen actions 'shake', 'snap'
03.01.12 - Added speech 'balloon' in actor
		 - Added arrays in user variables
02.28.12 - Added 'voice' dub in-sync with dialog
		 - Added 'nowait' argument to effects
02.27.12 - Expand user variables for more active use
		 - Several bugfixes
02.24.12 - Recode 'cform' (to be plugin-ready)
		 - Bugfix on user variable checkpoint save
02.21.12 - Improved memory handling (avoid leaks ?)
		 - Modify Vector2d class
02.13.12 - Recode 'atmosphere' (to be plugin-ready)
02.12.12 - Recode effects (to be plugin-ready)
02.10.12 - Recode 'box', script, stage and 'button'
		 - Added 'preload'
		 - Selectable 'video-on-canvas' or 'video-element'
02.09.12 - Added vector2d class (in anticipation of some future features)
		 - Optimized 'particles' for performance
		 - Recode 'scene', 'overlay'
		 - Recode 'actor'
02.06.12 - Recode 'user variables'
		 - Recode 'audio', 'video'
		 - Recode 'form'
		 - Bug fix for iOS user inputs
02.05.12 - Recode for "cleaner" encapsulation thru functional inheritance
		 - Recode 'atmosphere'
Version 0.1 Preview
02.02.12 - Added atmosphere 'snow', 'rain' direction
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

///////////////////////////////////////////////////////////////////////////////
// Generic/helper methods
///////////////////////////////////////////////////////////////////////////////
var Helper = {
	// Function for adding an event listener
	_registry: null,
	initialise: function() {
		if (this._registry == null) {
			this._registry = [];
			Helper.addEvent(window, 'unload', this.cleanUp);
		}
	},
	cleanUp: function() {
		for (var i = 0; i < Helper._registry.length; i++) {
			with (Helper._registry[i]) {
				if (obj.removeEventListener)
					obj.removeEventListener(evType, fn, useCapture);
				else if (obj.detachEvent)
					obj.detachEvent("on" + evType, fn);
			}
		}
		Helper._registry = null;
	},
	addEvent: function (obj, evType, fn, useCapture) {
		this.initialise();
		if (typeof obj == 'string')
			obj = document.getElementById(obj);
		if ((obj == null) || (fn == null))
			return false;
		if (obj.addEventListener) {
			obj.addEventListener(evType, fn, useCapture);
			this._registry.push({obj: obj, evType: evType, fn: fn, useCapture: useCapture});
			return true;
		}
		if (obj.attachEvent) {
			var r = obj.attachEvent("on" + evType, fn);
			if (r) this._registry.push({obj: obj, evType: evType, fn: fn, useCapture: false});
			return r;
		}
		return false;
	},
	// Function for including external javascript files
	includeJs: function (jsFilePath) {
		var js = document.createElement("script");
		js.type = "text/javascript";
		js.src = jsFilePath;
		//document.getElementsByTagName('head')[0].appendChild(js);
		document.body.appendChild(js);
		js = null;
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
		if (Stage.variables[id] != null)
			return Stage.variables[id].Value();
		return null;
	},
	// Helper function to obtain value from stage or config variables or actor stats
	getValue: function (id) {
		var ret = Helper.findStat(id);
		if (ret != null) return ret;
		ret = Helper.findVar(id);
		if (ret != null) return ret;
		return (Config[id]);
	},
	// Helper function to set value to stage or config variables
	setValue: function (id, value) {
		var ret = Helper.findStat(id);
		if (ret != null) {
			var arr_str = id.split('_');
			for (var j in Stage.layers[1]) {
				if (Stage.layers[1][j].id == arr_str[0]) {
					Stage.layers[1][j].stats[arr_str[1]] = value;
					if (Config.modRPG) {
						if (RPG.Stats[arr_str[1]]['_update']) {
							RPG.Stats[arr_str[1]]['_update'](Stage.layers[1][j], Stage.layers[1][j].stats);
						}
					}
					else {
						if (Stats[arr_str[1]]['_update']) {
							Stats[arr_str[1]]['_update'](Stage.layers[1][j], Stage.layers[1][j].stats);
						}
					}
					// TODO: update inherited stats
					break;
				}
			}
		}
		else {
			ret = Helper.findVar(id);
			if (ret != null)
				Stage.variables[id].Set(value, false);
			else {
				Config[id] = value;
				// a configuration variable has changed, reflect it back
				Helper.configUpdate(id);
				Stage.redraw = true;
			}
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
						Stage.layers[4][0].lineHeight = parseInt(subs[1]) + 4;
					}			
					if (subs.length > 2) Stage.layers[4][0].fontFamily = subs[2].replace(/['|"]/g,'');
					if (subs.length > 3) Stage.layers[4][0].fontColor = subs[3];
				}
				if (Config.activeTheme.boxTagStyle) {
					var subs = Helper.parseFontString(Config.activeTheme.boxTagStyle);
					
					if (subs.length > 0) Stage.layers[4][0].tagWeight = subs[0];
					if (subs.length > 1) Stage.layers[4][0].tagSize = subs[1];
					if (subs.length > 2) Stage.layers[4][0].tagFamily = subs[2].replace(/['|"]/g,'');
					if (subs.length > 3) Stage.layers[4][0].tagColor = subs[3];
				}
				if (Config.activeTheme.boxDimStyle) {
					var subs = Config.activeTheme.boxDimStyle.split(' ');
					Stage.layers[4][0].dimStyle.splice(0,Stage.layers[4][0].dimStyle.length);
					for (var idx in subs)
						Stage.layers[4][0].dimStyle.push(subs[idx]);
				}
				if (Config.activeTheme.boxImageStyle)
					Stage.layers[4][0].src = Config.activeTheme.boxImageStyle;
				else
					Stage.layers[4][0].src = null;
				// balloon styling
				Stage.layers[4][0].balloonStyle.splice(0,Stage.layers[4][0].balloonStyle.length);
				if (Config.activeTheme.balloonStrokeStyle)
					Stage.layers[4][0].balloonStyle.push(Config.activeTheme.balloonStrokeStyle);
				else
					Stage.layers[4][0].balloonStyle.push('transparent');
				if (Config.activeTheme.balloonFillStyle) {
					var subs = Config.activeTheme.balloonFillStyle.split(' ');
					for (var idx in subs)
						Stage.layers[4][0].balloonStyle.push(subs[idx]);
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
				if (typeof Config.volumeAudio == 'string') {
					var volume = parseFloat(Config.volumeAudio);
					if (isNaN(volume)) volume = 1.0;
					Config.volumeAudio = volume;
				}
				for (var idx in Stage.sounds) {
					for (var entry in Stage.sounds[idx]) {
						if ((!Stage.sounds[idx][entry].isPaused) && (!Stage.sounds[idx][entry].isStopping))
							Stage.sounds[idx][entry].audio.volume = Config.volumeAudio;
					}
				}
				break;
			case "volumeVideo":
				if (typeof Config.volumeVideo == 'string') {
					var volume = parseFloat(Config.volumeVideo);
					if (isNaN(volume)) volume = 1.0;
					Config.volumeVideo = volume;
				}
				for (var idx in Stage.videos) {
					if (!Stage.videos[idx].isStopping) {
						this.videos[idx].movie.volume = Config.volumeVideo;
					}
				}
				break;
		}
	},
	// Helper function to parse string arguments
	parseArg: function (arg) {
		// check if arg is a user variable
		var ret = Helper.findVar(arg);
		if (ret != null) return ret;
		// check if arg is a number
		ret = parseFloat(arg)
		if (!isNaN(ret)) return ret;
		// check if boolean
		ret = arg.replace(/^\s+|\s+$/g, "").toLowerCase();
		if (ret === 'true') return true;
		if (ret === 'false') return false;
		// just return as is
		return arg;
	},
	// Helper function to parse font string
	parseFontString: function (s) {
		var splitText = s.split(' ');
		// combine as needed
		var subs = new Array();
		var combine = false;
		var tempText = '';
		for (var i in splitText) {
			if (splitText[i].search(/['|"]/g)!=-1) {
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
		src = Helper.parseArg(src);
		return (/jpg|jpeg|bmp|png|gif|svg/i.test(src));
	},
	// Helper function to check for audio file
	checkIfAudio: function(src) {
		src = Helper.parseArg(src);
		return (/mp3|m4a|ogg|oga|wav|webma/i.test(src));
	},
	// Helper function to check for video file
	checkIfVideo: function(src) {
		src = Helper.parseArg(src);
		return (/mp4|m4v|ogg|ogv|webm|webmv/i.test(src));
	},
	// Helper function to process audio
	processAudio: function (obj, src, param) {
		var mimeType = {"wav": 'audio/wav',
						"ogg": 'audio/ogg;codecs="vorbis"',
						"oga": 'audio/ogg;codecs="vorbis"',
						"mp3": 'audio/mpeg',
						"m4a": 'audio/mp4;codecs="mp4a.40.2"',
						"webma": 'audio/webm; codecs="vorbis"',};			
		var index = -1;
		src = Helper.parseArg(src);
		for (var i in obj) {
			if (obj[i].src.search(src) != -1) {
				index = i;
				break;
			}
		}
		if (index != -1) {
			switch (param.action) {
				case "stop":
					obj[index].Stop(false);
					break;
				case "pause":
					obj[index].Pause();
					break;
				case "rewind":
					obj[index].Rewind();
					break;
				case "remove":
					if (param.bgs || param.se) {
						obj[index].Stop(true);
						obj[index].audio = null;
						obj.splice(index, 1);
					}
					break;
				case "play":
				default:
					obj[index].Play(false);
					break;
			}
		}
		else {
			var s = new Sounds();
			s.src = null;
			var soundformat = (param.format) ? param.format : Config.audioFormat;
			for (var i in soundformat) {
				if (s.audio.canPlayType(mimeType[soundformat[i]]) != '') {
					s.src = src + '.' + soundformat[i];
					break;
				}
			}
			if (s.src != null) {
				if ((param.bgm) || (param.voice)){
					while (obj.length > 0) {
						var old = obj.shift();
						old.Stop(true);
						old.audio = null;
					}
				}
				if ((param.se) || (param.voice))
					s.repeat = (param.repeat > 0) ? param.repeat : 0;
				else
					s.repeat = -1;
				s.delay = (param.delay > 0) ? param.delay : 0;
				obj.push(s);
			}
			s = null;
		}
	},
	// Helper function to process actor
	processActor: function (chr, param) {
		if (param.sprite) {
			if (typeof param.sprite == 'string') {
				for (var i in chr.sprites) {
					if (chr.sprites[i].id == param.sprite) {
						if (chr.visible) {
							chr.prevSprite = chr.activeSprite;
							chr.alpha = 0;
						}
						chr.activeSprite = i;
						// update sprite dimensions here
						chr.spriteDim = new Vector2d(chr.sprites[i].src.width / chr.sprites[i].frames, 
													 chr.sprites[i].src.height);
						var dim = Math.ceil(chr.spriteDim.length());
						chr.context.canvas.setAttribute('width', dim);
						chr.context.canvas.setAttribute('height', dim);
						chr.origin = new Vector2d(dim/2, dim/2 + chr.spriteDim.vy/2);
						// update sprite alignment here
						if (chr.sprites[i].align == 'roof')
							chr.offset.vy = -Stage.canvas.height*(2*Config.actorYPosition-1) + chr.sprites[i].src.height;
						else if (chr.sprites[i].align == 'top')
							chr.offset.vy = -Stage.canvas.height*(Config.actorYPosition) + chr.sprites[i].src.height;
						else if (chr.sprites[i].align == 'center')
							chr.offset.vy = -Stage.canvas.height*(Config.actorYPosition-0.5) + chr.sprites[i].src.height*0.5;
						else if (chr.sprites[chr.activeSprite].align == 'bottom')
							chr.offset.vy = -Stage.canvas.height*(Config.actorYPosition-1);
						else
							chr.offset.vy = 0;
						// set timer to false to trigger animation
						if (chr.sprites[i].fps > 0) {
							chr.sprites[i].curRep = 0;
							chr.sprites[i].spTimerOn = false;
						}
						break;
					}
				}
			}
			else {
				if (chr.visible && (chr.activeSprite > -1)) {
					chr.prevSprite = chr.activeSprite;
					chr.alpha = 0;
				}
				//chr.AddSprite(param.sprite[0], param.sprite[1], param.sprite[2]);
				chr.AddSprite(param.sprite);
			}
		}
		//if (param.avatar) chr.AddAvatar(param.avatar);
		if (param.avatar != null) {
			if (typeof param.avatar == 'string') {
				if (param.avatar && !Helper.checkIfImage(param.avatar)) {
					for (var i in chr.avatars) {
						if (chr.avatars[i].id == param.avatar) {
							chr.avatars[i].curRep = 0;	// reset repetition to retrigger
							chr.avatars[i].avTimerOn = false;
							chr.AddAvatar(chr.avatars[i].src);
							break;
						}
					}
				}
				else {
					// for compatibility only
					chr.AddAvatar(param.avatar);
				}
			}
			else {
				var found = false;
				for (var i in chr.avatars) {
					if (chr.avatars[i].id == param.avatar[0]) {
						chr.avatars[i].src = param.avatar[1];
						chr.avatars[i].frames = (param.avatar[2] != null) ? param.avatar[2] : 1;
						chr.avatars[i].fps = (param.avatar[3] != null) ? param.avatar[3] : 0;
						chr.avatars[i].reps = (param.avatar[4] != null) ? param.avatar[4] : -1;
						chr.avatars[i].curRep = 0;	// reset repetition to retrigger
						chr.avatars[i].avTimerOn = false;
						found = true;
						break;
					}
				}
				if (!found) {
					chr.avatars.push({id:param.avatar[0], src:param.avatar[1],
									  frames:(param.avatar[2] != null) ? param.avatar[2] : 1,
									  fps:(param.avatar[3] != null) ? param.avatar[3] : 0,
									  reps:(param.avatar[4] != null) ? param.avatar[4] : -1,
									  avTimer:0, avTimerOn:false, curFrame:0, curRep:0});
				}
				chr.AddAvatar(param.avatar[1]);
			}
		}
		if (param.position) {
			var subs = param.position.split(' ');
			for (var i in subs) {
				if (subs[i].search(/(left|right|center|auto)/g) != -1) {
					chr.posMode = subs[i];
					if (subs[i] == 'left') {
						chr.pos.vx = (Stage.canvas.width/4)>>0;
						chr.target_pos.vx = chr.pos.vx;
					}
					if (subs[i] == 'right') {
						chr.pos.vx = (Stage.canvas.width*3/4)>>0;
						chr.target_pos.vx = chr.pos.vx;
					}
					if (subs[i] == 'center') {
						chr.pos.vx = (Stage.canvas.width/2)>>0;
						chr.target_pos.vx = chr.pos.vx;
					}
				}
			}
		}
		var suffix;
		if ((param.show == false) ||
			(param.remove == 'actor') ||
			(chr.sprites[chr.activeSprite].id == param.remove))
			suffix = '_out';
		else
			suffix = '_in';
		if (param.effect) {
			var effect = param.effect;
			if (Stage.animations[param.effect] != null) {
				effect = Stage.animations[param.effect][1];
				chr.transTime = (Stage.animations[param.effect][0] > 0) ? Stage.animations[param.effect][0] : 0.1;
				if (Stage.animations[param.effect].length > 2)
					Helper.queueAnimation('actor', param, Stage.animations[param.effect].slice(2));
			}
			chr.wait = true;
			if (param.effect.indexOf('nowait')!=-1) {
				chr.wait = false;
				effect = param.effect.replace('nowait','');
			}
			var fxarr = effect.split(' ');
			chr.effects = fxarr[0] + suffix;
			chr.prevFx = fxarr[0];
			if (fxarr.length > 1) chr.fxparam = fxarr.slice(1);
			if (TransEffects[fxarr[0]]['_init'])
				TransEffects[fxarr[0]]['_init'](chr, chr.fxparam);
		}
		else {
			chr.wait = true;
			chr.effects = chr.prevFx + suffix;
		}
		if (param.remove) {
			if (param.remove == 'actor')
				chr.pendingRemoval = true;
			else
				chr.RemoveSprite(param.remove);
		}
		if (param.time != null) 
			chr.transTime = (param.time>0) ? param.time : 0.1;
		if ((param.say) || (param.balloon)) {
			var cont = Helper.checkCurrentSpeaker(chr.nick, param.append);
			if (!param.balloon)
				Stage.layers[4][0].text = Helper.addTagToDialog(chr.nick, chr.color, param.say, cont);
			else
				Stage.layers[4][0].text = Helper.addTagToDialog(null, null, param.balloon, false);
			Stage.layers[4][0].avatar = (chr.avatar != null) ? chr.avatar : null;
			if (Stage.layers[4][0].avatar != null) {
				for (var i in chr.avatars) {
					if (Stage.layers[4][0].avatar.src.search(chr.avatars[i].src) != -1) {
						Stage.layers[4][0].avatarStruct = chr.avatars[i];
						break;
					}
				}
			}
			else
				Stage.layers[4][0].avatarStruct = null;
			
			Stage.layers[4][0].alpha = 1;
			Stage.layers[4][0].effects = "none";
			Stage.layers[4][0].scrollOffsetY = 0;
			Stage.layers[4][0].visible = true;
			Stage.layers[4][0].changed = true;
			Stage.layers[4][0].balloon = (param.balloon) ? param.id : null;
			
			if (param.voice)
				Helper.processAudio (Stage.sounds[3], param.voice, {voice:param.voice});
		}
	},
	// Helper function to process backdrop
	processBackdrop: function (obj, type, param) {
		var nextid = 0;
		if (obj.length > 0) {
			// background/overlay layer has more than one element
			// to conserve memory, maintain only the previous and the incoming backdrop
			while (obj.length > 1) {
				var object = obj.shift();
				object.image = null;
				object = null;
			}
			if (!param.src && (param.show != false)) {
				// show the previous overlay
				if (param.effect) {
					var effect = param.effect;
					if (Stage.animations[param.effect] != null) {
						effect = Stage.animations[param.effect][1];
						obj[0].transTime = (Stage.animations[param.effect][0] > 0) ? Stage.animations[param.effect][0] : 0.1;
						if (Stage.animations[param.effect].length > 2)
							Helper.queueAnimation(type, param, Stage.animations[param.effect].slice(2));
					}
					obj[0].wait = true;
					if (effect.indexOf('nowait')!=-1) {
						obj[0].wait = false;
						effect = effect.replace('nowait','');
					}
					var fxarr = effect.split(' ');
					obj[0].effects = fxarr[0] + '_in';
					if (fxarr.length>1) obj[0].fxparam = fxarr.slice(1);
					if (TransEffects[fxarr[0]]['_init'])
						TransEffects[fxarr[0]]['_init'](obj[0], obj[0].fxparam);
				}
				else {
					obj[0].effects = '_in';
					obj[0].wait = true;
				}
				if (param.time != null) 
					obj[0].transTime = (param.time>0) ? param.time : 0.1;
				obj[0].drawn = false;
				obj[0].update = false;
				return;
			}
			// do a reverse effect on the previous backdrop
			obj[0].effects = '_out';
			if (param.effect) {
				var effect = param.effect;
				if (Stage.animations[param.effect] != null) {
					// just use first animation in the set
					effect = Stage.animations[param.effect][1];
					obj[0].transTime = (Stage.animations[param.effect][0] > 0) ? Stage.animations[param.effect][0] : 0.1;
					//if (Stage.animations[param.effect].length > 2)
					//	Helper.queueAnimation(type, param, Stage.animations[param.effect].slice(2));
				}
				obj[0].wait = true;
				if (effect.indexOf('nowait')!=-1) {
					obj[0].wait = false;
					effect = effect.replace('nowait','');
				}
				var fxarr = effect.split(' ');
				obj[0].effects = fxarr[0] + '_out';
				if (fxarr.length>1) obj[0].fxparam = fxarr.slice(1);
				if (TransEffects[fxarr[0]]['_init'])
					TransEffects[fxarr[0]]['_init'](obj[0], obj[0].fxparam);
			}
			if (param.time != null) 
				obj[0].transTime = (param.time>0) ? param.time : 0.1;
			obj[0].drawn = false;
			obj[0].update = false;
			nextid = parseInt(obj[0].context.canvas.id.substr(2))+1;
			if ((!param.src) && (param.show == false)) {
				return;
			}
		}
		// add the new backdrop
		var bd = new Backdrop();
		bd.type = type;
		var objects = new Array();
		if (param.objects) {
			// assumes multiples of 3
			//for (var i=0; i<param.objects.length; i+=3) {
			var param_count = 0;
			while (param_count < param.objects.length) {
				var item = {src:'', x:0, y:0, frames:1, fps:0};	//fps=0 is static image
				item.src = param.objects[param_count];
				item.x = param.objects[param_count+1];
				item.y = param.objects[param_count+2];
				param_count += 3;
				// adds entry for sprite frame animation if it exists, ignores it if it doesn't
				if (param_count < param.objects.length) {
					if (typeof param.objects[param_count] == 'number') {
						item.frames = param.objects[param_count];
						item.fps = param.objects[param_count+1];
						param_count += 2;
					}
				}
				objects.push(item);
			}
		}
		bd.Create('bd' + nextid, param.src, (objects.length > 0) ? objects : null);
		if (param.effect) {
			var fxset = param.effect;
			if (Stage.animations[param.effect] != null) {
				fxset = Stage.animations[param.effect][1];
				bd.transTime = (Stage.animations[param.effect][0] > 0) ? Stage.animations[param.effect][0] : 0.1;
				if (Stage.animations[param.effect].length > 2)
					Helper.queueAnimation(type, param, Stage.animations[param.effect].slice(2));
			}
			if (fxset.indexOf('nowait')!=-1) {
				bd.wait = false;
				fxset = fxset.replace('nowait','');
			}
			var fxarr = fxset.split(' ');
			bd.effects = fxarr[0] + '_in';
			if (fxarr.length > 1) 
				bd.fxparam = fxarr.slice(1);
			else {
				if (type == 'scene')
					bd.fxparam = (Stage.layers[0].length > 0);
				else
					bd.fxparam = (Stage.layers[2].length > 0);
			}
			if (TransEffects[fxarr[0]]['_init'])
				TransEffects[fxarr[0]]['_init'](bd, bd.fxparam);
		}
		else 
			bd.effects = '_in';
		if (param.time != null) 
			bd.transTime = (param.time>0) ? param.time : 0.1;
		if (param.offset) {
			if (typeof (param.offset) == "string")
				bd.scroll = (param.offset == 'scroll') ? true : false;
			else {
				bd.scroll = false;
				bd.offset = new Vector2d(param.offset[0],param.offset[1]);
			}
		}
		else {
			bd.scroll = false;
			bd.offset = new Vector2d(0,0);
		}
		obj.push(bd);
		bd = null;
	},
	// Helper function to process effects
	processEffects: function (obj, elapsed) {
		if (obj.effects.indexOf('done')!=-1) {
			obj.drawn = true;
			return;
		}
		var fxarr = obj.effects.split('_');
		if (fxarr[0] == '') fxarr[0] = 'none';
		if (fxarr.length == 1) fxarr.push('in');
		
		obj.target_alpha = 1.0;
		TransEffects[fxarr[0]]['_'+fxarr[1]](obj, elapsed);
	},
	// Helper function to draw visual elements
	drawElements: function(obj, order) {
		if (!obj.visible) return false;

		Stage.context.save();
		Stage.context.translate(obj.pos.vx - obj.scale * obj.origin.vx + obj.offset.vx,
								obj.pos.vy - obj.scale * obj.origin.vy + obj.offset.vy);
		Stage.context.scale(obj.scale, obj.scale);
		Stage.context.drawImage(obj.context.canvas,
								Stage.AddDepth(order/10, Stage.canvas.width/2 - Stage.coord.vx) + 
								Stage.shake * Stage.transTime * Math.sin(Stage.transTime*10*Math.PI),
								Stage.AddDepth(order/10, Stage.canvas.height/2 - Stage.coord.vy)/2 +
								Stage.fall * Stage.transTime * Math.sin(Stage.transTime*10*Math.PI),
								obj.context.canvas.width,
								obj.context.canvas.height);	
		Stage.context.restore();
		return (Stage.transTime>0);
	},
	// Helper to interpolate object position
	interpolatePosition: function(obj) {
		if (Stage.transTime <= 0) {
			obj.pos.copy(obj.target_pos);
			obj.startpos = null;
		}
		else {
			if ((obj.startpos == undefined) || (obj.startpos == null))
				obj.startpos = new Vector2d(obj.pos.vx, obj.pos.vy);
			obj.pos.lerp(obj.target_pos, obj.startpos, Stage.transTime/obj.transTime);
		}
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
	// Helper function to add name tag, if any, to dialog
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
			var match = text.match(/#([^#|\s]+)#/g);
			for (var i in match)
				text = text.replace(match[i],Helper.parseArg(match[i].replace(/#/g,'')));
			dialog += Helper.parseArg(text).toString().replace(/\n/g,"<br/>");
		}		
		return Helper.filterBadWords(dialog);
	},
	// Helper function to show tooltip on forms
	showTooltip: function(tip) {
		Stage.context.save();
		Stage.context.fillStyle = Config.activeTheme.formTipColor;
		Stage.context.shadowColor = 'black';
		Stage.context.shadowBlur = 2;

		var subs = Helper.parseFontString(Config.activeTheme.formTipStyle);
		Stage.context.font = subs.slice(0,3).join(' ');
		var w = Stage.context.measureText(tip).width;
		var h = parseInt(subs[1]);
		var x = Math.min(Stage.coord.vx, Stage.canvas.width - w - 5);
		var y = Math.min(Stage.coord.vy, Stage.canvas.height - 2*h - 5);
		Stage.context.fillRect(x-5, y-5+h, w+10, h+10);
		//Stage.context.strokeRect(x-5, y-5+h, w+10, h+10);
		
		Stage.context.shadowBlur = 0;
		Stage.context.fillStyle = subs.slice(3).join(' ');
		Stage.context.textBaseline = 'top';
		Stage.context.fillText(tip, x, y + h);
		Stage.context.restore();
	},
	// Helper function to filter words, if enabled
	filterBadWords: function (str) {
		if (Config.gameMatureFilter) {
			var pattern = "/(^|\\n?|\\s*)("+Config.gameBadWords.join('|')+")($|\\n?|\\s*)/img";
			return str.replace(eval(pattern), Config.gameAltWord);
		}
		else
			return str;
	},
	// Helper function to display readable time
	convertTime: function (val) {
		var sec = val % 60;
		var min = (val - sec) / 60;
		min %= 60;
		var hr = (val - sec - 60*min) / 3600;
		if (hr > 0)
			return (hr.toString() + ':' + ((min<10)?'0':'') + min.toString() + ':' + ((sec<10)?'0':'') + sec.toString());
		else
			return (min.toString() + ':' + ((sec<10)?'0':'') + sec.toString());
	},
	// Helper function to create balloon dialogs
	createBalloon: function (ctx, x, y, w, h, r, ptr) {
		if (w < 2 * r) r = w / 2;
		if (h < 2 * r) r = h / 2;
		ctx.beginPath();
		ctx.moveTo(r, y);
		ctx.moveTo(x+r, y);
		ctx.lineTo(x+w/4-y/2,y);
		if (ptr) ctx.lineTo(x+w/4,0);
		ctx.lineTo(x+w/4+y/2,y);
		ctx.lineTo(x+w*3/4-y/2,y);
		if (!ptr) ctx.lineTo(x+w*3/4,0);
		ctx.lineTo(x+w*3/4+y/2,y);

		ctx.lineTo(w-r, y);
		ctx.quadraticCurveTo(w, y, w, y+r);
		ctx.lineTo(w, h-r);
		ctx.quadraticCurveTo(w, h, w-r, h);
		ctx.lineTo(x+r, h);
		ctx.quadraticCurveTo(x, h, x, h-r);
		ctx.lineTo(x, y+r);
		ctx.quadraticCurveTo(x, y, x+r, y);
		// Opera doesn't render arcTo correctly, so used quadratic instead
		/*ctx.arcTo(w, y, w, h, r);
		ctx.arcTo(w, h, x, h, r);
		ctx.arcTo(x, h, x, y, r);
		ctx.arcTo(x, y, w, y, r); */
		ctx.closePath();
	},
	// Helper function to create pointer for automap
	createPointer: function (ctx, x, y, w, h, rot) {
		ctx.beginPath();
		if (rot == 0) {
			ctx.moveTo(x+0.5*w,y+0.1*h);
			ctx.lineTo(x+0.9*w,y+0.9*h);
			ctx.lineTo(x+0.5*w,y+0.75*h);
			ctx.lineTo(x+0.1*w,y+0.9*h);
		}
		if (rot == 1) {
			ctx.moveTo(x+0.9*w,y+0.5*h);
			ctx.lineTo(x+0.1*w,y+0.9*h);
			ctx.lineTo(x+0.25*w,y+0.5*h);
			ctx.lineTo(x+0.1*w,y+0.1*h);
		}
		if (rot == 2) {
			ctx.moveTo(x+0.5*w,y+0.9*h);
			ctx.lineTo(x+0.1*w,y+0.1*h);
			ctx.lineTo(x+0.5*w,y+0.25*h);
			ctx.lineTo(x+0.9*w,y+0.1*h);
		}
		if (rot == 3) {
			ctx.moveTo(x+0.1*w,y+0.5*h);
			ctx.lineTo(x+0.9*w,y+0.1*h);
			ctx.lineTo(x+0.75*w,y+0.5*h);
			ctx.lineTo(x+0.9*w,y+0.9*h);
		}
		ctx.closePath();
	},
	// Helper function to queue animation set in script lines
	queueAnimation: function (type, param, aset) {
		var newLines = new Array();
		for (var i=0; i<aset.length; i+=2) {
			if (type == 'scene') newLines.push(scene);
			if (type == 'overlay') newLines.push(overlay);
			if (type == 'actor') newLines.push(actor);
			var newParam = {};
			for (prop in param) {
				if (param.hasOwnProperty(prop)) {
					if (prop.search(/(src|sprite|avatar|nick|color|say|balloon|append|remove|voice)/g) == -1)
						newParam[prop] = param[prop];
				}
			}
			newParam.time = aset[i];
			newParam.effect = aset[i+1];
			newLines.push(newParam);
		}
		Stage.script.Insert(newLines);
	},
	// Helper function to check map adjacency
	checkMapAccess: function(mapname, locationid) {
		if (this.findVar("_nav_loc") != null) {
			var ret = this.findVar(mapname+'#'+Stage.variables["_nav_loc"].Value());
			if ( ret != null) {
				for (var i in ret)
					if (ret[i] == locationid) return true;
				return false;
			}
		}
		return true;
	},
	// Helper function to preload resources
	preloadResources: function(seq, param) {
		if ((seq == scene) || (seq == overlay)) {
			if ((param.src) && (Helper.checkIfImage(param.src))) {
				var newImage = new Image();
				newImage.src = param.src;
				newImage = null;
			}						
			if (param.objects) {
				for (var j=0; j<param.objects.length; ) {
					var newImage = new Image();
					newImage.src = param.objects[j];
					newImage = null;
					j += 3;
					if (param.objects[j] && (typeof param.objects[j] == 'number'))
						j += 2;
				}
			}
		}
		if (seq == actor) {
			if (param.sprite) {
				if (typeof param.sprite != 'string') {
					var newImage = new Image();
					newImage.src = param.sprite[1];
					newImage = null;
				}
			}
			if (param.avatar) {
				if (typeof param.avatar == 'string') {
					if (Helper.checkIfImage(param.avatar)) {
						var newImage = new Image();
						newImage.src = param.avatar;
						newImage = null;
					}
				}
				else {
					var newImage = new Image();
					newImage.src = param.avatar[1];
					newImage = null;
				}
			}
			if (param.voice) {
				for (var j=0; j<Config.audioFormat.length; j++) {
					var newAudio = new Audio();
					newAudio.preload = 'auto';
					newAudio.autoplay = false;
					newAudio.src = param.voice + '.' + Config.audioFormat[j];
					newAudio = null;
				}
			}
		}
		if (seq == audio) {
			var soundfile, soundformat;
			if (param.bgm) soundfile = param.bgm;
			if (param.bgs) soundfile = param.bgs;
			if (param.se) soundfile = param.se;
			if (param.format) soundformat = param.format;
			else soundformat = Config.audioFormat;
			for (var j=0; j<soundformat.length; j++) {
				var newAudio = new Audio();
				newAudio.preload = 'auto';
				newAudio.autoplay = false;
				newAudio.src = soundfile + '.' + soundformat[j];
				newAudio = null;
			}
		}
		if (seq == video) {
			var videofile, videoformat;
			if (param.src) videofile = param.src;
			if (param.format) videoformat = param.format;
			else videoformat = Config.movieFormat;
			for (var j=0; j<videoformat.length; j++) {
				var newVideo = document.createElement('video');
				newVideo.preload = 'auto';
				newVideo.autoplay = false;
				newVideo.src = videofile + '.' + videoformat[j];
				newVideo = null;
			}
		}
	},
	// Helper function to skip previously read text for quick replay
	skipReadText: function() {
		if (this.findVar("_skip_text") != true) return false;
		if (!Stage.inputFocus) return false;
		if (!this.supportsLocalStorage()) return false;
		if ((Stage.script.sequence[0] != label) || (localStorage["_persist_skip_"+Stage.script.sequence[1]] == null))
			return false;
		var tmp = JSON.parse(localStorage["_persist_skip_"+Stage.script.sequence[1]]);
		for (var i=0; i<tmp.length; i+=2) {
			if ((Stage.script.frame >= tmp[i]) && (Stage.script.frame <= tmp[i+1]))
				return true;
		}
		return false;
	},
	// Helper function to build default stats for a character
	buildStats: function(id) {
		if (Config.modRPG) {
			return RPG.methods.buildStats(id);
		}
		else if (Stats){
			var newStats = {};
			for (prop in Stats) {
				if (Stats.hasOwnProperty(prop)) {
					newStats[prop] = Stats[prop]._value[0];
					if (Stats[prop]._inherit) {
						newStats[Stats[prop]._inherit[Stats[prop]._value[0]].type] = {};
						for (attr in Stats[prop]._inherit[Stats[prop]._value[0]]) {
							if (attr == "type") continue;
							newStats[Stats[prop]._inherit[Stats[prop]._value[0]].type][attr] =
								Stats[prop]._inherit[Stats[prop]._value[0]][attr]._value[0];
						}
					}
				}
			}
			return newStats;
		}
		return null;
	},
	// Helper function to look for actor stat
	findStat: function (id) {
		if (Stage.layers[1].length > 0) {
			var arr_str = id.split('_');
			if ((arr_str.length > 1) && (arr_str[0].length > 0)){
				for (var i in Stage.layers[1]) {
					if (Stage.layers[1][i].id == arr_str[0])
						return Stage.layers[1][i].stats[arr_str[1]];
				}
			}
		}
		return null;
	},
	// Helper function to check if valid actor from id
	checkIfActor: function (id) {
		for (var i in Stage.layers[1]) {
			if (Stage.layers[1][i].id == id)
				return true;
		}
		return false;
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
	if (!Config.movieOnCanvas) {
		for (var idx in Stage.videos) {
			var x = Stage.canvas.offsetLeft + (1-Config.movieSize)/2 * Stage.canvas.width;
			var y = Stage.canvas.offsetTop + (1-Config.movieSize)/2 * Stage.canvas.height;
			Stage.videos[idx].movie.setAttribute('style', 'position:absolute; left:'+x+'px; top:'+y+'px');
		}
	}
	for (var i=0; i<document.forms.length; i++) {
		var x = Stage.canvas.offsetLeft;
		var y = Stage.canvas.offsetTop;
		document.forms[i].setAttribute('style', 'position:absolute; left:'+x+'px; top:'+y+'px;');
	}
});

///////////////////////////////////////////////////////////////////////////////
// Rect class
///////////////////////////////////////////////////////////////////////////////
function Rect(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}
///////////////////////////////////////////////////////////////////////////////
// 2D vector class
///////////////////////////////////////////////////////////////////////////////
function Vector2d(x, y) {
	this.vx = x;
	this.vy = y;
}
Vector2d.prototype.copy = function (vec2) {
	this.vx = vec2.vx;
	this.vy = vec2.vy;
};
Vector2d.prototype.scale = function (scale) {
	this.vx *= scale;
	this.vy *= scale;
};
Vector2d.prototype.add = function (vec2) {
	this.vx += vec2.vx;
	this.vy += vec2.vy;
};
Vector2d.prototype.sub = function (vec2) {
	this.vx -= vec2.vx;
	this.vy -= vec2.vy;
};
Vector2d.prototype.equal = function (vec2) {
	return ((this.vx == vec2.vx) && (this.vy == vec2.vy));
};
Vector2d.prototype.length = function () {
	return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
};
Vector2d.prototype.lengthSquared = function () {
	return this.vx * this.vx + vec.vy * vec.vy;
},
Vector2d.prototype.normalize = function () {
	var len = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
	if (len) {
		this.vx /= len;
		this.vy /= len;
	}
	return len;
};
Vector2d.prototype.rotate = function (angle) {
	var vx = this.vx,
		vy = this.vy,
		cosVal = Math.cos(angle),
		sinVal = Math.sin(angle);
		this.vx = vx * cosVal - vy * sinVal;
		this.vy = vx * sinVal + vy * cosVal;
};
Vector2d.prototype.lerp = function (vec1, vec2, amt) {
	this.vx = (1-amt) * vec1.vx + (amt) * vec2.vx;
	this.vy = (1-amt) * vec1.vy + (amt) * vec2.vy;
};
///////////////////////////////////////////////////////////////////////////////
// Transition Effects plug-ins
///////////////////////////////////////////////////////////////////////////////
var TransEffects = {
	// effect completed
	done: {
		_in: function(obj, elapsed) {
			obj.drawn = true;
		}
	},
	// default/no effect
	none: {
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			obj.effects = 'done';
			obj.drawn = true;
		},
		_out: function(obj, elapsed) {
			obj.alpha = 0.0;
			obj.effects = 'done';
			obj.drawn = true;
			obj.redraw = true;
			obj.visible = false;
		}
	},
	// fade effect
	fade: {
		_init: function(obj, param) {
			if ((obj.effects.indexOf('_in')!=-1) && (param==true))
				obj.alpha = -1;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			if (obj.alpha >= obj.target_alpha) {
				obj.effects = 'done';
				obj.drawn = true;
			}
			else {
				obj.alpha += elapsed/(obj.transTime * 1000);
			}
			if (!obj.wait) obj.drawn = true;
		},
		_out: function(obj, elapsed) {
			if (obj.alpha <= 0.0) {
				obj.effects = 'done';
				obj.drawn = true;
				obj.visible = false;
			}
			else {
				obj.alpha -= elapsed/(obj.transTime * 1000);
			}
			obj.redraw = true;
			if (!obj.wait) obj.drawn = true;
		}
	},
	// ghost effect
	ghost: {
		_init: function(obj, param) {
			obj.target_alpha = 0.5;
		},
		_in: function(obj, elapsed) {
			TransEffects.fade._in(obj, elapsed);
		},
		_out: function(obj, elapsed) {
			TransEffects.fade._out(obj, elapsed);
		}
	},
	// dissolve effect
	dissolve: {
		_in: function(obj, elapsed) {
			TransEffects.fade._in(obj, elapsed);
		},
		_out: function(obj, elapsed) {
			TransEffects.fade._out(obj, elapsed);
		}
	},
	// scale effect
	scale: {
		_init: function(obj, param) {
			obj.size = Helper.parseArg(param[0]);//parseFloat(param[0]);
			obj.fxparam = obj.size;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			if (Math.abs(1-obj.scale/obj.fxparam) <= 0.01) {
				obj.effects = 'done';
				obj.drawn = true;
			}
			else
				obj.scale *= Math.exp(Math.log(obj.fxparam/obj.scale)*elapsed/(obj.transTime * 1000));
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene')
				TransEffects.none._in(obj, elapsed);
			else
				TransEffects.none._out(obj, elapsed);
		}
	},
	// rotate effect
	rotate: {
		_init: function(obj, param) {
			obj.fxparam = Helper.parseArg(param[0]);//parseFloat(param[0]);
			obj.orientation += obj.fxparam;
			obj.orientation %= 360;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			if (Math.abs(obj.accum_rotation - obj.fxparam) <= 0.1) {
				obj.effects = 'done';
				obj.rotation = 0;
				obj.accum_rotation = 0;
				obj.drawn = true;
			}
			else {
				obj.rotation = (obj.fxparam - obj.accum_rotation)* elapsed/(obj.transTime * 1000);
				obj.accum_rotation += obj.rotation;
			}		
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene')
				TransEffects.none._in(obj, elapsed);
			else
				TransEffects.none._out(obj, elapsed);
		}		
	},
	// translate effect
	translate: {
		_init: function(obj, param) {
			if (param && (param.length>1)) {
				obj.target_pos.vx += Helper.parseArg(param[0]);//parseFloat(param[0]);
				obj.target_pos.vy += Helper.parseArg(param[1]);//parseFloat(param[1]);
			}
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene')
				TransEffects.none._in(obj, elapsed);
			else
				TransEffects.none._out(obj, elapsed);
		},	
	},
	// movement effects
	left: {
		_init: function(obj, param) {
			if (obj.effects.indexOf('_in')!=-1)
				obj.pos.vx = -obj.context.canvas.width;
			else
				obj.target_pos.vx = -obj.context.canvas.width;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene') {
				TransEffects.none._in(obj, elapsed);
			}
			else {
				obj.redraw = true;
				if (!obj.wait) obj.drawn = true;
				Helper.interpolatePosition(obj);
				if (Stage.transTime <=0) {
					obj.effects = 'done';
					obj.drawn = true;
				}
			}
		}
	},
	right: {
		_init: function(obj, param) {
			if (obj.effects.indexOf('_in')!=-1)
				obj.pos.vx = Stage.canvas.width + obj.context.canvas.width;
			else
				obj.target_pos.vx = Stage.canvas.width + obj.context.canvas.width;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene') {
				TransEffects.none._in(obj, elapsed);
			}
			else {
				obj.redraw = true;
				if (!obj.wait) obj.drawn = true;
				Helper.interpolatePosition(obj);
				if (Stage.transTime <=0) {
					obj.effects = 'done';
					obj.drawn = true;
				}
			}
		}
	},
	bottom: {
		_init: function(obj, param) {
			if (obj.effects.indexOf('_in')!=-1)
				obj.pos.vy = Stage.canvas.height + obj.context.canvas.height;
			else
				obj.target_pos.vy = Stage.canvas.height + obj.context.canvas.height;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene') {
				TransEffects.none._in(obj, elapsed);
			}
			else {
				obj.redraw = true;
				if (!obj.wait) obj.drawn = true;
				Helper.interpolatePosition(obj);
				if (Stage.transTime <=0) {
					obj.effects = 'done';
					obj.drawn = true;
				}
			}
		}
	},
	top: {
		_init: function(obj, param) {
			if (obj.effects.indexOf('_in')!=-1)
				obj.pos.vy = -obj.context.canvas.height;
			else
				obj.target_pos.vy = -obj.context.canvas.height;
		},
		_in: function(obj, elapsed) {
			obj.Reset(false);
			obj.alpha = 1.0;
			if (!obj.wait) obj.drawn = true;
			Helper.interpolatePosition(obj);
			if (Stage.transTime <=0) {
				obj.effects = 'done';
				obj.drawn = true;
			}
		},
		_out: function(obj, elapsed) {
			if (obj.type == 'scene') {
				TransEffects.none._in(obj, elapsed);
			}
			else {
				obj.redraw = true;
				if (!obj.wait) obj.drawn = true;
				Helper.interpolatePosition(obj);
				if (Stage.transTime <=0) {
					obj.effects = 'done';
					obj.drawn = true;
				}
			}
		}
	}
};

///////////////////////////////////////////////////////////////////////////////
// Script method callback/handlers
///////////////////////////////////////////////////////////////////////////////
// label - marks a position in the script
function label(param) { }
// message - display a message box
function message(param) { alert(param); }
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
	if (Config.gameAllowMacro) {
		if (typeof param == 'string')
			eval(param)();
		else {
			for (prop in param) {
				if (param.hasOwnProperty(prop)) {
					eval(prop)(param[prop]);
				}
			}
		}
	}
}
// screen - do some screen actions
function screen(param) {
	for (prop in param) {
		if (param.hasOwnProperty(prop)) {
			if (prop == 'shake') {
				Stage.shake = param.shake;
				Stage.Transition(param.duration ? param.duration: Config.transTime);
			}
			if (prop == 'fall') {
				Stage.fall = param.fall;
				Stage.Transition(param.duration ? param.duration: Config.transTime);
			}
			if (prop == 'snap') {
				var img = Stage.canvas.toDataURL("image/"+param.snap);
				window.open(img,'_blank','width='+Stage.canvas.width+',height='+Stage.canvas.height);
			}
		}
	}
	Stage.redraw = true;
}
// set - sets a user variable
function set(param) {
	var arr_param = new Array();
	for (prop in param) {
		if (param.hasOwnProperty(prop)) {
			arr_param.push(prop);
			arr_param.push(JSON.stringify(param[prop]));
		}
	}
	for (var i=0; i<arr_param.length; i+=2) {
		var persist = false;
		if (arr_param[i].indexOf('$') == 0) {
			arr_param[i] = arr_param[i].replace(/^\$/g,'');
			persist = true;
		}
		arr_param[i+1] = eval(arr_param[i+1]);
		var value = Helper.findStat(arr_param[i]);
		if (value != null) {
			/* set actor stat */
			var arr_str = arr_param[i].split('_');
			var stats_obj;
			if (Config.modRPG) stats_obj = RPG.Stats[arr_str[1]];
			else stats_obj = Stats[arr_str[1]];

			var stat = value;
			var stat_type;
			if (stats_obj._value) stat_type = typeof stats_obj._value[0];
			if (stats_obj._range) stat_type = typeof stats_obj._range[0];
			if (stat_type == 'number') {
				if (typeof arr_param[i+1] == 'number')
					stat = arr_param[i+1];
				else if (typeof arr_param[i+1] == 'string') {
					if (arr_param[i+1].search(/[+|\-|*|%|\/]/g) != -1)
						stat = eval(stat + arr_param[i+1]);
					else if (arr_param[i+1] == 'random') {
						if (stats_obj._value) {
							var delta = stats_obj._value[1] - stats_obj._value[0] + 1;
							stat = Math.floor(Math.random()*delta) + stats_obj._value[0];
						}
						if (stats_obj._range) {
							var delta = stats_obj._range[1] - stats_obj._range[0] + 1;
							stat = Math.floor(Math.random()*delta) + stats_obj._range[0];
						}
					}
				}
				if (stats_obj._value)
					stat = Math.max(stats_obj._value[0], Math.min(stats_obj._value[1], stat));
				if (stats_obj._range)
					stat = Math.max(stats_obj._range[0], Math.min(stats_obj._range[1], stat));
			}
			else if (stat_type == 'boolean') {
				if (typeof arr_param[i+1] == 'number')
					stat = (arr_param[i+1]==0) ? stats_obj._value[0] : stats_obj._value[1];
				else if (typeof arr_param[i+1] == 'string') {
					if (arr_param[i+1].search(/!/g) != -1)
						stat = !stat;
				}
				else if (typeof arr_param[i+1] == 'boolean')
					stat = arr_param[i+1];
			}
			else if (stat_type == 'string') {
				if (typeof arr_param[i+1] == 'number') {
					if ((arr_param[i+1] >= 0) && (arr_param[i+1] < stats_obj._value.length))
						stat = stats_obj._value[arr_param[i+1]];
				}
				else if (typeof arr_param[i+1] == 'string') {
					for (var j in stats_obj._value) {
						if (arr_param[i+1] == stats_obj._value[j]) {
							stat = arr_param[i+1];
							break;
						}
					}
				}
			}
			else {	// object type, just assign it
				stat = arr_param[i+1];
			}
			Helper.setValue(arr_param[i], stat);
			//for (var j in Stage.layers[1]) {
			//	if (Stage.layers[1][j].id == arr_str[0]) {
			//		Stage.layers[1][j].stats[arr_str[1]] = stat;
			//		break;
			//	}
			//}
		}
		else {
			/* set user variable */
			value = Helper.findVar(arr_param[i]);
			if (value != null) {
				if (arr_param[i+1] == null) {
					if (Stage.variables[arr_param[i]].Persist() && Helper.supportsLocalStorage())
						localStorage.removeItem("_persist_uv_"+arr_param[i]);
					delete(Stage.variables[arr_param[i]]);
					return;
				}
				if (Stage.variables[arr_param[i]].Type() == 'object') {
					// assumes array, just push new value
					Stage.variables[arr_param[i]].Value().push(arr_param[i+1]);
					Stage.variables[arr_param[i]].persist = persist;
				}
				else {
					if (typeof arr_param[i+1] == 'string') {
						// if value is a reference to other variables
						var ref = Helper.findVar(arr_param[i+1]);
						if (ref != null)
							Stage.variables[arr_param[i]].Set(ref, persist);
						else {
							// is it an expression with supported operator
							if (arr_param[i+1].search(/[+|\-|*|%|\/]/g) != -1)
								Stage.variables[arr_param[i]].Set(eval(Stage.variables[arr_param[i]].Value() + arr_param[i+1]), persist);
							else if (arr_param[i+1].search(/!/g) != -1)
								Stage.variables[arr_param[i]].Set(!Stage.variables[arr_param[i]].Value());
							// is it a random number
							else if (arr_param[i+1].search(/random/g) != -1) {
								var arr_random = arr_param[i+1].split(' ');
								if (arr_random.length > 1)
									Stage.variables[arr_param[i]].Set(Math.floor(Math.random()*(eval(arr_random[2])-eval(arr_random[1])+1)) + eval(arr_random[1]));
								else
									Stage.variables[arr_param[i]].Set(Math.random(), persist);
							}								
							// or a simple string to set
							else
								Stage.variables[arr_param[i]].Set(arr_param[i+1], persist);
						}
					}
					else {
						Stage.variables[arr_param[i]].Set(arr_param[i+1], persist);
					}
				}
			}
			else {
				var uv = new UserVars();
				if (typeof arr_param[i+1] == 'string') {
					if (arr_param[i+1].search(/random/g) != -1) {
						var arr_random = arr_param[i+1].split(' ');
						if (arr_random.length > 1)
							uv.Set(Math.floor(Math.random()*(eval(arr_random[2])-eval(arr_random[1])+1)) + eval(arr_random[1]));
						else
							uv.Set(Math.random(), persist);
					}
					else {
						var ref = Helper.findVar(arr_param[i+1]);
						uv.Set((ref != null) ? ref : arr_param[i+1], persist);
					}
				}
				else
					uv.Set(arr_param[i+1], persist);
				Stage.variables[arr_param[i]] = uv;
				uv = null;
			}	
			if (Stage.variables[arr_param[i]].Persist() && Helper.supportsLocalStorage())
				localStorage["_persist_uv_"+arr_param[i]] = JSON.stringify(Stage.variables[arr_param[i]].Value());
		}
	}
}
// get - gets value of a user variable
function get(param) {
	return Helper.findVar(param.name);
}
// animation - define an animation set
function animation(param) {
	Stage.animations[param[0]] = param.slice(1);
}
// jump - continues execution at given label
function jump(param) {
	if (typeof param == 'string') {
		if (param == 'return') {
			Stage.script.PopFrame();
			Stage.pause = true;
		}
		else if (param.indexOf("http") != -1) {
			var newwin = window.open(param, '_blank');
			window.setTimeout('newwin.focus();', 250);
		}
		else if (param == 'pop') {
			Stage.script.frameStack.pop();
			Stage.pause = false;
			return;
		}
		else {
			if (param.indexOf('$') != 0)
				Stage.script.PushFrame();
			Stage.script.SetFrame(param.replace('$',''));
		}
	}
	else {
		if (param.label.indexOf('$') != 0)
			Stage.script.PushFrame();
		var arr_param = new Array();
		for (prop in param) {
			if (param.hasOwnProperty(prop)) {
				arr_param.push(prop);
				arr_param.push(JSON.stringify(param[prop]));
			}
		}
		
		var compare = false;
		for (var i=0; i<arr_param.length; i+=2) {
			//arr_param[i] = eval(arr_param[i]);
			if (arr_param[i] == 'label') continue;
			arr_param[i+1] = eval(arr_param[i+1]);

			compare = false;
			var val = Helper.getValue(arr_param[i]);
			if (val != null) {
				if (typeof val == 'number') {
					if (val >= arr_param[i+1])
						compare = true;
				}
				else if (typeof val == 'string') {
					if (val === arr_param[i+1])
						compare = true;
				}
				else {
					if (val == arr_param[i+1])
						compare = true;
				}
			}
			if (compare == false) break;
		}
		if (compare == true)
			Stage.script.SetFrame(param.label.replace('$',''));
	}
	Stage.layers[4][0].jumpTo.splice(0,Stage.layers[4][0].jumpTo.length);
}
// tile - navigate scenes using tiles
function tile(param) {
	// create navigation user variables if non-existent
	if (Helper.findVar("_nav_loc") == null) {
		var uv = new UserVars();
		uv.Set("", false);
		Stage.variables["_nav_loc"] = uv;
	}
	if (Helper.findVar("_nav_dir") == null) {
		var uv = new UserVars();
		uv.Set(0, false);	//0:N, 1:E, 2:S, 3:W
		Stage.variables["_nav_dir"] = uv;
	}
	if (Helper.findVar("_nav_move") == null) {
		var uv = new UserVars();
		uv.Set("", false);	//stay or "", forward, left, back, right
		Stage.variables["_nav_move"] = uv;
	}
	
	Stage.variables["_nav_loc"].Set(param.id, false);
	if (Stage.variables["_nav_move"].Value() == "forward") {
		jump(param.link[Stage.variables["_nav_dir"].Value()]);
	}
	else if (Stage.variables["_nav_move"].Value() == "back") {
		jump(param.link[(Stage.variables["_nav_dir"].Value()+2)%4]);
	}
	else if (Stage.variables["_nav_move"].Value() == "left") {
		if (Stage.variables["_nav_dir"].Value() == 0)
			Stage.variables["_nav_dir"].Set(3, false);
		else
			Stage.variables["_nav_dir"].Set(Stage.variables["_nav_dir"].Value()-1, false);
		var sparam = {};
		sparam.src = param.wall[Stage.variables["_nav_dir"].Value()];
		sparam.effect = "dissolve";
		scene(sparam);
	}
	else if (Stage.variables["_nav_move"].Value() == "right") {
		Stage.variables["_nav_dir"].Set((Stage.variables["_nav_dir"].Value()+1)%4, false);
		var sparam = {};
		sparam.src = param.wall[Stage.variables["_nav_dir"].Value()];
		sparam.effect = "dissolve";
		scene(sparam);
	}
	else {
		var sparam = {};
		sparam.src = param.wall[Stage.variables["_nav_dir"].Value()];
		sparam.effect = "dissolve";
		scene(sparam);
	}
	Stage.variables["_nav_move"].Set("",false);
	
	if (param.map && (Helper.findVar("_nav_automap") != null)) {
		var val = Stage.variables["_nav_automap"].Value();
		val[param.map[0]][param.map[1]] = 1;
		Stage.variables["_nav_automap"].Set(val, false);
		
		if (Helper.findVar("_nav_pos") == null) {
			var uv = new UserVars();
			uv.Set(0, false);
			Stage.variables["_nav_pos"] = uv;
		}
		Stage.variables["_nav_pos"].Set(param.map, false);
		
		// force an automap redraw
		for (var i in Stage.layers[3]) {
			if (Stage.layers[3][i].type == 'minimap') {
				Stage.layers[3][i].redraw = true;
				break;
			}
		}
	}
}
// automap - display an auto-revealing map, to be used with tiles
function automap(param) {
	// automap uses atmo, tile uses scene
	if (typeof param == 'string') {
		var sparam = {};
		if (param == 'hide') sparam.minimap = 'stop';
		if (param == 'show') sparam.minimap = 'start';
		atmosphere(sparam);		
	}
	else {
		if (param.src) {
			if (Helper.findVar("_nav_automap") == null) {
				var uv = new UserVars();
				uv.Set(0, false);
				Stage.variables["_nav_automap"] = uv;
			}

			var val = new Array(param.size[0]);
			for (var i=0; i<val.length; i++) {
				val[i] = new Array(param.size[1]);
				for (var j=0; j<val[i].length; j++)
					val[i][j] = 0;
			}
			Stage.variables["_nav_automap"].Set(val, false);
			var sparam = {};
			sparam.minimap = param.src;
			sparam.offset = (param.offset) ? param.offset : new Array(0,0);
			sparam.size = param.size;
			atmosphere(sparam);
		}
	}
}
// map - define map adjacency
function map(param) {
	if (Helper.findVar("_nav_loc") == null) {
		var uv = new UserVars();
		uv.Set("", false);
		Stage.variables["_nav_loc"] = uv;
	}
	for (prop in param) {
		if (param.hasOwnProperty(prop) && (prop != 'id')) {
			var uv = new UserVars();
			param[prop].push(prop);
			uv.Set(param[prop], false);
			Stage.variables[param.id+'#'+prop] = uv;
		}
	}
}
// preload - manually preload resources
function preload(param) {
	// TODO: here's a crude preload support
	if (Config.gameAllowPreload) {
		setTimeout(function() {
			if ((typeof param == 'string') && (param == 'auto')){
				var seq = Stage.script.sequence;
				for (var i=Stage.script.frame; i<seq.length; i+=2) {
					Helper.preloadResources(seq[i], seq[i+1]);
				}
				seq = null;
				return;
			}
			var preloadObj = new Array(param.length);
			for (var i=0; i<param.length; i++) {
				if (Helper.checkIfImage(param[i])) {
					preloadObj[i] = new Image();
					preloadObj[i].src = param[i];
				}
				if (Helper.checkIfAudio(param[i])) {
					preloadObj[i] = new Audio();
					preloadObj[i].preload = 'auto';
					preloadObj[i].autoplay = false;
					preloadObj[i].src = param[i];
				}
				if (Helper.checkIfVideo(param[i])) {
					preloadObj[i] = document.createElement('video');
					preloadObj[i].preload = 'auto';
					preloadObj[i].autoplay = false;
					preloadObj[i].src = param[i];
				}
				preloadObj[i] = null;
			}
			preloadObj = null;
		}, 250);
	}
}
// scene - displays a background (layer 0)
function scene(param) {
	Helper.processBackdrop(Stage.layers[0], 'scene', param);
	Stage.Transition(param.time);
}
// actor - create and display character (layer 1)
function actor(param) {
	if (Stage.layers[1].length > 0) {
		// look for same id
		for (var i=0; i<Stage.layers[1].length; i++) {
			if (Stage.layers[1][i].id == param.id) {
				// update an existing actor
				Helper.processActor(Stage.layers[1][i], param);
				// check if a reorder is needed
				if (param.z_order) Stage.layers[1][i].z_order = param.z_order
				// done updating, do not trickle down
				Stage.layers[1][i].drawn = false;
				Stage.layers[1][i].update = false;
				if ((Stage.layers[1][i].visible && (Stage.layers[1][i].effects.indexOf('out')!=-1)) ||
					(!Stage.layers[1][i].visible && (Stage.layers[1][i].effects.indexOf('in')!=-1)) ||
					((param.position) && (param.position.search(/(left|right|center|auto)/g) != -1)))
					Stage.Transition(Stage.layers[1][i].transTime);	
				if (param.z_order && (Stage.layers[1][i].z_order != param.z_order)) {
					Stage.layers[1][i].z_order = param.z_order
					Stage.layers[1].sort(function(a,b){return a.z_order-b.z_order});
				}
				return;
			}
		}
	}
	// this is a new actor
	var chr = new Character(param.id, param.z_order ? param.z_order : 0);
	chr.nick = (param.nick) ? Helper.parseArg(param.nick) : param.id;
	chr.color = (param.color) ? param.color : Stage.layers[4][0].tagColor;
	Helper.processActor(chr, param);
	Stage.layers[1].push(chr);	
	Stage.layers[1].sort(function(a,b){return a.z_order-b.z_order});
	Stage.Transition(chr.transTime);
	chr = null;
}
// overlay - displays an overlay image (layer 2)
function overlay(param) {
	//Stage.Transition(param.time);
	Helper.processBackdrop(Stage.layers[2], 'overlay', param);
	Stage.Transition(Stage.layers[2][Stage.layers[2].length-1].transTime);
}
// atmosphere - create atmosphere effects (layer 3)
function atmosphere(param) {
	var arr_param = new Array();
	for (prop in param) {
		if (param.hasOwnProperty(prop)) {
			arr_param.push(prop);
			arr_param.push(JSON.stringify(param[prop]));
		}
	}
	
	// for plugins compatibility, first parameter must identify type of atmo effect
	var type = arr_param[0]; //eval(arr_param[0]);
	arr_param[1] = eval(arr_param[1]);
	var action = 'start';
	if (arr_param[1].toString().search(/(start|stop)/g) != -1)
		action = arr_param[1];
		
	for (var i=0; i<Stage.layers[3].length; i++) {
		if (Stage.layers[3][i].type == type) {
			Stage.layers[3][i].action = (action) ? action : 'start';
			if (Stage.layers[3][i].action == 'start')
				Stage.layers[3][i].Init(type, param);
			return;
		}
	}
	var nextid = (Stage.layers[3].length > 0) ? 
				parseInt(Stage.layers[3][Stage.layers[3].length-1].context.canvas.id.substr(3))+1 : 0;
	var atm = new Atmosphere('atm'+nextid);
	//atm.Create('atm'+nextid);
	atm.Init(type, param);	
	Stage.layers[3].push(atm);
	atm = null;
}
// box - configures script box (layer 4)
function box(param) {
	if (param.show == true)
		Stage.layers[4][0].visible = true;
	else {
		Stage.layers[4][0].visible = false;
		Stage.layers[4][0].text = '';
		Stage.layers[4][0].balloon = null;
	}
	if (param.pos) Stage.layers[4][0].pos = param.pos;
	if (param.back) {
		Stage.layers[4][0].back = param.back;
		Stage.layers[4][0].src = Config.activeTheme.boxImageStyle;
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
	Stage.layers[4][0].balloon = null;
	if (typeof param == "string") {
		Stage.layers[4][0].text = Helper.addTagToDialog(null, null, param, Stage.layers[4][0].cont);		
	}
	else {
		if (param.font) { 
			var subs = Helper.parseFontString(param.font);
			
			if (subs.length > 0) Stage.layers[4][0].fontWeight = subs[0];
			if (subs.length > 1) {
				Stage.layers[4][0].fontSize = subs[1];
				Stage.layers[4][0].lineHeight = parseInt(subs[1]) + 4;			
			}			
			if (subs.length > 2) Stage.layers[4][0].fontFamily = subs[2];
			if (subs.length > 3) Stage.layers[4][0].fontColor = subs[3];
		}
		if (param.align)
			Stage.layers[4][0].textAlign = param.align;
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
					Stage.layers[4][0].avatar = (Stage.layers[1][i].avatar != null) ? Stage.layers[1][i].avatar : null;
					if (Stage.layers[4][0].avatar != null) {
						for (var j in Stage.layers[1][i].avatars) {
							if (Stage.layers[4][0].avatar.src.search(Stage.layers[1][i].avatars[j].src) != -1) {
								Stage.layers[4][0].avatarStruct = Stage.layers[1][i].avatars[j];
								break;
							}
						}
					}
					else
						Stage.layers[4][0].avatarStruct = null;
					break;
				}
			}
		}
		var same_window = Helper.checkCurrentSpeaker((param.speaker) ? param.speaker : '', param.append);
		Stage.layers[4][0].text = Helper.addTagToDialog(nick, color, 
														(param.value) ? param.value : null, same_window);		
		if (param.duration > 0) Stage.layers[4][0].timeout = param.duration;
		if (param.offset) {
			Stage.layers[4][0].textOffset.vx = param.offset[0];
			Stage.layers[4][0].textOffset.vy = param.offset[1];
		}
		if (param.value && param.voice)
			Helper.processAudio (Stage.sounds[3], param.voice, {voice:param.voice});
	}
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
	}
	Stage.layers[4][0].avatar = null;
	Stage.layers[4][0].visible = true;
	Stage.layers[4][0].changed = true;
	Stage.layers[4][0].inputFocus = true;
	Stage.layers[4][0].balloon = null;
}
// button - create a canvas button (layer 4), independent of cform
function button(param) {
	// check existing button w/ same id ?
	var bt = new ActiveImage();
	bt.saveparam = param;
	if (/toggle/i.test(param.name))
		CformElements['toggle']['_init'](bt, param);
	else
		CformElements['button']['_init'](bt, param);
	Stage.layers[4].push(bt);
	bt = null;
}
// timer - create a canvas form timer (layer 4)
// removed as of v.0.3.1, added stub for compatibility
function timer(param) {
	marquee(param);
}
// picture - create a canvas form animated image (layer 4)
function picture(param) {
	var pic = new ActiveImage();
	pic.saveparam = param;
	CformElements['picture']['_init'](pic, param);
	Stage.layers[4].push(pic);
	pic = null;
}
// marquee - create a canvas form animated text (layer 4)
function marquee(param) {
	var mq = new ActiveImage();
	mq.saveparam = param;
	if (/timer/i.test(param.name))
		CformElements['timer']['_init'](mq, param);
	else
		CformElements['marquee']['_init'](mq, param);
	Stage.layers[4].push(mq);
	mq = null;
}
// cfelement - create a custom cform element
function cfelement(param) {
	var element = new ActiveImage();
	element.type = param.type;
	element.saveparam = param;
	CformElements[param.type]['_init'](element, param);
	Stage.layers[4].push(element);
	element = null;
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
						for (var j in Stage.layers[4][i].sprites) {
							if ((Stage.layers[4][i].sprites[j].constructor == HTMLImageElement) || 
								(Stage.layers[4][i].sprites[j].constructor == Image))
								Stage.layers[4][i].sprites[j] = null;
						}
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
						if (Stage.layers[4][i].aTimerOn) {
							Stage.layers[4][i].aTimerOn = false;
							clearTimeout(Stage.layers[4][i].aTimer);
						}
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
			param[i](param[i+1]);
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
	
	if (param.bgm)
		Helper.processAudio (Stage.sounds[0], param.bgm, param);
	if (param.bgs)
		Helper.processAudio (Stage.sounds[1], param.bgs, param);
	if (param.se)
		Helper.processAudio (Stage.sounds[2], param.se, param);
}
// video - plays a video (cutscene, etc.)
function video(param) {
	if (!document.createElement('video').canPlayType) return;
	
	var mimeType = {"mp4": 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
					"m4v": 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
					"ogg": 'video/ogg; codecs="theora, vorbis"',
					"ogv": 'video/ogg; codecs="theora, vorbis"',
					"webm": 'video/webm; codecs="vp8, vorbis"',
					"webmv": 'video/webm; codecs="vp8, vorbis"'};
	var v = new Movie();
	v.src = null;
	var videoformat = (param.format) ? param.format : Config.movieFormat;
	for (var i in videoformat) {
		if (v.movie.canPlayType(mimeType[videoformat[i]]) != '') {
			v.src = Helper.parseArg(param.src) + '.' + videoformat[i];
			break;
		}
	}	
	Stage.videos.push(v);
	Stage.pause = true;
	v = null;
}
// default form elements (sibling layer)
function input(param) {
	var element = document.createElement("input");
	element.name = param.name;
	element.id = param.name;
	if (param.placeholder) element.placeholder = param.placeholder;
	if (param.autofocus) element.autofocus = param.autofocus;
	if (param.bind) {
		if (Helper.getValue(param.bind) != '')
			element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}
function input_label(param, tip) {
	var element = document.createElement("label");
	element.htmlFor = param;
	element.innerHTML = param;
	if (tip) element.title = tip;
	try { return element; }
	finally { element = null; }
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
		if (Helper.getValue(param.bind) != '')
			element.value = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}
function fieldset(param) {
	var element = document.createElement("fieldset");
	element.id = param;
	try { return element; }
	finally { element = null; }
}
function select(param) {
	var element = document.createElement("select");
	element.name = param.name;
	element.id = param.name;
	
	var opts = (typeof param.options == 'string') ? Helper.getValue(param.options) : param.options;
	for (var i=0; i<opts.length; i+=2) {
		var opt = document.createElement("option");
		opt.innerHTML = opts[i];
		opt.value = JSON.stringify(opts[i+1]);
		element.appendChild(opt);
		if (param.bind) {
			if (opt.value == JSON.stringify(Helper.getValue(param.bind)))
				element.selectedIndex = i/2;
		}
	}	
	if (param.bind) Stage.formBindings.push([param.name, param.bind]);
	try { return element; }
	finally { element = null; }
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
				if (items.type == "radio") {
					if (items.checked == true) 
						//Helper.setValue(Stage.formBindings[idx][1], JSON.stringify(items.value));
						Helper.setValue(Stage.formBindings[idx][1], items.value.toString());
				}
				else if (items.type == "checkbox") {
					Helper.setValue(Stage.formBindings[idx][1], items.checked);
				}
				else if ((items.type == "range") || (items.type == "number")) {
					Helper.setValue(Stage.formBindings[idx][1], items.valueAsNumber);
				}
				else if ((items.type == "text") || (items.type == "textarea")) {
					//Helper.setValue(Stage.formBindings[idx][1], JSON.stringify(items.value));
					Helper.setValue(Stage.formBindings[idx][1], items.value.toString());
				}
				else if (items.type == "select-one") {
					Helper.setValue(Stage.formBindings[idx][1], JSON.parse(items.value));
				}
				else {
					Helper.setValue(Stage.formBindings[idx][1], items.value);
				}
				items = null;
			}
			// remove form here
			Stage.activeForm.parent.removeChild(Stage.activeForm.newForm);
			Stage.activeForm = null;
			Stage.pause = false;
		}, false);
	try { return element; }
	finally { element = null; }
}
function checkbox(param) {
	var element = document.createElement("input");
	element.type = "checkbox";
	element.name = param.name;
	element.id = param.name;
	element.checked = (param.checked) ? param.checked : false;
	if (param.bind) {
		element.checked = Helper.getValue(param.bind);
		Stage.formBindings.push([param.name, param.bind]);
	}
	try { return element; }
	finally { element = null; }
}
function radio(param) {
	var element = document.createElement("input");
	element.type = "radio";
	element.name = param.name;
	element.id = param.value;
	element.value = param.value;
	element.checked = (param.checked) ? param.checked : false;
	if (param.bind) {
		element.checked = (element.value == Helper.getValue(param.bind));
		Stage.formBindings.push([param.value, param.bind]);
	}
	try { return element; }
	finally { element = null; }
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
	try { return element; }
	finally { element = null; }
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
	try { return element; }
	finally { element = null; }
}
// form - create a default HTML form
function form(param) {
	var f = new Form(param[0]);
	var fset = null;
	//f.Create(param[0]);
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
		f.AddChild(param[i](param[i+1]), fset);	
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
	f = null;
}
// checkpoint - loads/saves at a given checkpoint
function checkpoint(param) {
	if (!Helper.supportsLocalStorage()) return;
	
	var cmd = param;
	var chkpt = ''; 
	if (Config.gameNamedCheckpts) {
		if (typeof param == 'string') {
			cmd = param;
			chkpt = '_auto_';
		}
		else {
			for (prop in param) {
				if (param.hasOwnProperty(prop)) {
					cmd = prop;
					chkpt = param[prop];
				}
			}
		}
	}
	if (cmd == "save") {
		if (!Config.gameNamedCheckpts) {
			//localStorage.clear(); 
			var pattern = "/_persist_/g";
			for (prop in localStorage) {
				if (!prop.match(eval(pattern))) {
					localStorage.removeItem(prop);
				}
			}
		}
		else {
			if (chkpt != '') {
				var pattern = "/^"+chkpt+"/g";
				for (prop in localStorage) {
					if (prop.match(eval(pattern))) {
						localStorage.removeItem(prop);
					}
				}
			}
		}
		// Store script entry point
		if (Stage.script.sequence[0] == label) {
			localStorage[chkpt+"sequence"] = Stage.script.sequence[1];
			localStorage[chkpt+"frame"] = Stage.script.frame;
		}
		else {
			localStorage[chkpt+"sequence"] = '';
			localStorage[chkpt+"frame"] = 0;
		}
		// Store jump stack
		localStorage[chkpt+"frameStack"] = JSON.stringify(Stage.script.frameStack);
		// Store layer 0
		localStorage[chkpt+"l0_count"] = Stage.layers[0].length;
		for (var i=0; i<Stage.layers[0].length; i++) {
			localStorage[chkpt+"l0_"+i+"_id"] = Stage.layers[0][i].context.canvas.id;
			if (typeof Stage.layers[0][i].image == 'string')
				localStorage[chkpt+"l0_"+i+"_src"] = Stage.layers[0][i].image;
			else
				localStorage[chkpt+"l0_"+i+"_src"] = Stage.layers[0][i].image.src;
			localStorage[chkpt+"l0_"+i+"_obj_count"] = Stage.layers[0][i].objects.length;
			for (var j=0; j<Stage.layers[0][i].objects.length; j++) {
				localStorage[chkpt+"l0_"+i+"_obj_"+j+"_src"] = Stage.layers[0][i].objects[j].img.src;
				localStorage[chkpt+"l0_"+i+"_obj_"+j+"_x"] = Stage.layers[0][i].objects[j].x;
				localStorage[chkpt+"l0_"+i+"_obj_"+j+"_y"] = Stage.layers[0][i].objects[j].y;
				localStorage[chkpt+"l0_"+i+"_obj_"+j+"_frames"] = Stage.layers[0][i].objects[j].frames;
				localStorage[chkpt+"l0_"+i+"_obj_"+j+"_fps"] = Stage.layers[0][i].objects[j].fps;
			}
			localStorage[chkpt+"l0_"+i+"_alpha"] = Stage.layers[0][i].alpha;
			localStorage[chkpt+"l0_"+i+"_visible"] = Stage.layers[0][i].visible;
			localStorage[chkpt+"l0_"+i+"_effects"] = Stage.layers[0][i].effects;
			localStorage[chkpt+"l0_"+i+"_time"] = Stage.layers[0][i].transTime;
			localStorage[chkpt+"l0_"+i+"_orientation"] = Stage.layers[0][i].orientation;
			localStorage[chkpt+"l0_"+i+"_size"] = Stage.layers[0][i].size;
		}
		// Store layer 1
		localStorage[chkpt+"l1_count"] = Stage.layers[1].length;
		for (var i=0; i<Stage.layers[1].length; i++) {
			localStorage[chkpt+"l1_"+i+"_id"] = Stage.layers[1][i].id;
			localStorage[chkpt+"l1_"+i+"_nick"] = Stage.layers[1][i].nick;
			localStorage[chkpt+"l1_"+i+"_color"] = Stage.layers[1][i].color;
			localStorage[chkpt+"l1_"+i+"_zorder"] = Stage.layers[1][i].z_order;
			localStorage[chkpt+"l1_"+i+"_sprites_count"] = Stage.layers[1][i].sprites.length;
			for (var j=0; j<Stage.layers[1][i].sprites.length; j++) {
				localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_id"] = Stage.layers[1][i].sprites[j].id;
				localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_src"] = Stage.layers[1][i].sprites[j].src.src;			
				localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_align"] = Stage.layers[1][i].sprites[j].align;			
				localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_frames"] = Stage.layers[1][i].sprites[j].frames;			
				localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_fps"] = Stage.layers[1][i].sprites[j].fps;			
				localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_reps"] = Stage.layers[1][i].sprites[j].reps;			
			}
			localStorage[chkpt+"l1_"+i+"_offset_x"] = Stage.layers[1][i].offset.vx;
			localStorage[chkpt+"l1_"+i+"_offset_y"] = Stage.layers[1][i].offset.vy;
			if (Stage.layers[1][i].avatar != null)
				localStorage[chkpt+"l1_"+i+"_avatar"] = Stage.layers[1][i].avatar.src;
			else
				localStorage[chkpt+"l1_"+i+"_avatar"] = "undefined";
			if (Stage.layers[1][i].avatars != null)
				localStorage[chkpt+"l1_"+i+"_avatars"] = JSON.stringify(Stage.layers[1][i].avatars);
			else
				localStorage[chkpt+"l1_"+i+"_avatars"] = "undefined";
			localStorage[chkpt+"l1_"+i+"_active"] = Stage.layers[1][i].activeSprite;
			localStorage[chkpt+"l1_"+i+"_alpha"] = Stage.layers[1][i].alpha;
			if (Stage.layers[1][i].prevFx != '')
				localStorage[chkpt+"l1_"+i+"_effects"] = Stage.layers[1][i].prevFx;
			else
				localStorage[chkpt+"l1_"+i+"_effects"] = "undefined";
			localStorage[chkpt+"l1_"+i+"_time"] = Stage.layers[1][i].transTime;
			localStorage[chkpt+"l1_"+i+"_visible"] = Stage.layers[1][i].visible;
			localStorage[chkpt+"l1_"+i+"_pending"] = Stage.layers[1][i].pendingRemoval;
			localStorage[chkpt+"l1_"+i+"_posMode"] = Stage.layers[1][i].posMode;
			//localStorage[chkpt+"l1_"+i+"_fxparam"] = Stage.layers[1][i].fxparam;
			localStorage[chkpt+"l1_"+i+"_orientation"] = Stage.layers[1][i].orientation;
			localStorage[chkpt+"l1_"+i+"_size"] = Stage.layers[1][i].size;
			localStorage[chkpt+"l1_"+i+"_stats"] = JSON.stringify(Stage.layers[1][i].stats);
		}
		// Store layer 2
		localStorage[chkpt+"l2_count"] = Stage.layers[2].length;
		for (var i=0; i<Stage.layers[2].length; i++) {
			localStorage[chkpt+"l2_"+i+"_id"] = Stage.layers[2][i].context.canvas.id;
			if (typeof Stage.layers[2][i].image == 'string')
				localStorage[chkpt+"l2_"+i+"_src"] = Stage.layers[2][i].image;
			else
				localStorage[chkpt+"l2_"+i+"_src"] = Stage.layers[2][i].image.src;
			localStorage[chkpt+"l2_"+i+"_alpha"] = Stage.layers[2][i].alpha;
			localStorage[chkpt+"l2_"+i+"_visible"] = Stage.layers[2][i].visible;
			localStorage[chkpt+"l2_"+i+"_effects"] = Stage.layers[2][i].effects;
			localStorage[chkpt+"l2_"+i+"_time"] = Stage.layers[2][i].transTime;
			localStorage[chkpt+"l2_"+i+"_scroll"] = Stage.layers[2][i].scroll;
			localStorage[chkpt+"l2_"+i+"_offset_x"] = Stage.layers[2][i].offset.vx;
			localStorage[chkpt+"l2_"+i+"_offset_y"] = Stage.layers[2][i].offset.vy;
			localStorage[chkpt+"l2_"+i+"_orientation"] = Stage.layers[2][i].orientation;
			localStorage[chkpt+"l2_"+i+"_size"] = Stage.layers[2][i].size;
		}
		// Store layer 3
		localStorage[chkpt+"l3_count"] = Stage.layers[3].length;
		for (var i=0; i<Stage.layers[3].length; i++) {
			localStorage[chkpt+"l3_"+i+"_id"] = Stage.layers[3][i].context.canvas.id;
			localStorage[chkpt+"l3_"+i+"_type"] = Stage.layers[3][i].type;
			localStorage[chkpt+"l3_"+i+"_action"] = Stage.layers[3][i].action;
			localStorage[chkpt+"l3_"+i+"_visible"] = Stage.layers[3][i].visible;
			localStorage[chkpt+"l3_"+i+"_param"] = JSON.stringify(Stage.layers[3][i].saveparam);
		}
		// Store layer 4
		localStorage[chkpt+"l4_count"] = Stage.layers[4].length;
		for (var i=0; i<Stage.layers[4].length; i++) {
			localStorage[chkpt+"l4_"+i+"_type"] = Stage.layers[4][i].type;
			if (Stage.layers[4][i].type == "box") {
				localStorage[chkpt+"l4_"+i+"_visible"] = Stage.layers[4][i].visible;
				localStorage[chkpt+"l4_"+i+"_text"] = Stage.layers[4][i].text;
				localStorage[chkpt+"l4_"+i+"_pos"] = Stage.layers[4][i].pos;
				localStorage[chkpt+"l4_"+i+"_back"] = Stage.layers[4][i].back;
				if (Stage.layers[4][i].src != null)
					localStorage[chkpt+"l4_"+i+"_src"] = Stage.layers[4][i].src;
				else
					localStorage[chkpt+"l4_"+i+"_src"] = "undefined";
				if (Stage.layers[4][i].psrc != '')
					localStorage[chkpt+"l4_"+i+"_prompt"] = Stage.layers[4][i].psrc;
				else
					localStorage[chkpt+"l4_"+i+"_prompt"] = "undefined";
				if (Stage.layers[4][i].avatar != null) {
					localStorage[chkpt+"l4_"+i+"_avatar"] = Stage.layers[4][i].avatar.src;
					localStorage[chkpt+"l4_"+i+"_avatarStruct"] = Stage.layers[4][i].avatarStruct;
				}
				else {
					localStorage[chkpt+"l4_"+i+"_avatar"] = "undefined";
					localStorage[chkpt+"l4_"+i+"_avatarStruct"] = "undefined";
				}
				if (Stage.layers[4][i].balloon != null)
					localStorage[chkpt+"l4_"+i+"_balloon"] = Stage.layers[4][i].balloon;
				else
					localStorage[chkpt+"l4_"+i+"_balloon"] = "undefined";
				localStorage[chkpt+"l4_"+i+"_cont"] = Stage.layers[4][i].cont;
				localStorage[chkpt+"l4_"+i+"_fontFamily"] = Stage.layers[4][i].fontFamily;
				localStorage[chkpt+"l4_"+i+"_fontSize"] = Stage.layers[4][i].fontSize;
				localStorage[chkpt+"l4_"+i+"_lineHeight"] = Stage.layers[4][i].lineHeight;
				localStorage[chkpt+"l4_"+i+"_fontWeight"] = Stage.layers[4][i].fontWeight;
				localStorage[chkpt+"l4_"+i+"_fontColor"] = Stage.layers[4][i].fontColor;
				localStorage[chkpt+"l4_"+i+"_tagFamily"] = Stage.layers[4][i].tagFamily;
				localStorage[chkpt+"l4_"+i+"_tagSize"] = Stage.layers[4][i].tagSize;
				localStorage[chkpt+"l4_"+i+"_tagWeight"] = Stage.layers[4][i].tagWeight;
				localStorage[chkpt+"l4_"+i+"_tagColor"] = Stage.layers[4][i].tagColor;
				localStorage[chkpt+"l4_"+i+"_timeout"] = Stage.layers[4][i].timeout;
				localStorage[chkpt+"l4_"+i+"_textAlign"] = Stage.layers[4][i].textAlign;
				localStorage[chkpt+"l4_"+i+"_offset_x"] = Stage.layers[4][i].textOffset.vx;
				localStorage[chkpt+"l4_"+i+"_offset_y"] = Stage.layers[4][i].textOffset.vy;
				localStorage[chkpt+"l4_"+i+"_inputFocus"] = Stage.layers[4][i].inputFocus;
				localStorage[chkpt+"l4_"+i+"_alpha"] = Stage.layers[4][i].alpha;
				localStorage[chkpt+"l4_"+i+"_effects"] = Stage.layers[4][i].effects;
				localStorage[chkpt+"l4_"+i+"_jumpTo_count"] = Stage.layers[4][i].jumpTo.length;
				for (var j=0; j<Stage.layers[4][i].jumpTo.length; j++) {
					localStorage[chkpt+"l4_"+i+"jumpTo"+j+"hotspot_x"] = Stage.layers[4][i].jumpTo[j].hotspot[0];
					localStorage[chkpt+"l4_"+i+"jumpTo"+j+"hotspot_y"] = Stage.layers[4][i].jumpTo[j].hotspot[1];
					localStorage[chkpt+"l4_"+i+"jumpTo"+j+"link"] = Stage.layers[4][i].jumpTo[j].link;
				}
			}
			else {
				localStorage[chkpt+"l4_"+i+"_type"] = Stage.layers[4][i].type;
				localStorage[chkpt+"l4_"+i+"_id"] = Stage.layers[4][i].id;
				if (Stage.layers[4][i].group != '')
					localStorage[chkpt+"l4_"+i+"_group"] = Stage.layers[4][i].group;
				else
					localStorage[chkpt+"l4_"+i+"_group"] = "undefined";
				localStorage[chkpt+"l4_"+i+"_param"] = JSON.stringify(Stage.layers[4][i].saveparam);			
				localStorage[chkpt+"l4_"+i+"_text"] = Stage.layers[4][i].text;
				localStorage[chkpt+"l4_"+i+"_visible"] = Stage.layers[4][i].visible;
				if ((Stage.layers[4][i].link != null) && (Stage.layers[4][i].link.length > 0)) {
					localStorage[chkpt+"l4_"+i+"_link_count"] = Stage.layers[4][i].link.length;
					for (var j=0; j<Stage.layers[4][i].link.length; j+=2) {
						localStorage[chkpt+"l4_"+i+"_link_"+j] = Stage.layers[4][i].link[j].toString().split(/[\s|(|)|{|}]/g, 2)[1];
						localStorage[chkpt+"l4_"+i+"_link_"+(j+1)] = JSON.stringify(Stage.layers[4][i].link[j+1]);
					}
				}
				else {
					localStorage[chkpt+"l4_"+i+"_link_count"] = 0;				
					//localStorage[chkpt+"l4_"+i+"_link_0"] = "undefined";
					//localStorage[chkpt+"l4_"+i+"_link_1"] = "undefined";
				}
			}
		}
		// Store sounds
		for (var i=0; i<4; i++) {
			localStorage[chkpt+"s"+i+"_count"] = Stage.sounds[i].length;
			for (var j=0; j<Stage.sounds[i].length; j++) {
				localStorage[chkpt+"s"+i+"_"+j+"_src"] = Stage.sounds[i][j].src;
				localStorage[chkpt+"s"+i+"_"+j+"_repeat"] = Stage.sounds[i][j].repeat;
				localStorage[chkpt+"s"+i+"_"+j+"_delay"] = Stage.sounds[i][j].delay;
				localStorage[chkpt+"s"+i+"_"+j+"_isStopping"] = Stage.sounds[i][j].isStopping;
				localStorage[chkpt+"s"+i+"_"+j+"_isPaused"] = Stage.sounds[i][j].isPaused;
			}
		}
		// Store video?? No need. Videos are non-persistent data anyway
		// Store user variables
		var uv_count = 0;
		for (prop in Stage.variables) {
			if (Stage.variables.hasOwnProperty(prop)) {
				localStorage[chkpt+"uv"+uv_count+"_name"] = prop;
				localStorage[chkpt+"uv"+uv_count+"_value"] = JSON.stringify(Stage.variables[prop].Value());
				localStorage[chkpt+"uv"+uv_count+"_type"] = Stage.variables[prop].Type();
				if (Stage.variables[prop].persist) {
					localStorage[chkpt+"uv"+uv_count+"_persist"] =  true;
					localStorage["_persist_uv_"+prop] = JSON.stringify(Stage.variables[prop].Value());
				}
				else
					localStorage[chkpt+"uv"+uv_count+"_persist"] =  false;
				uv_count++;
			}
		}
		localStorage[chkpt+"uv_count"] = uv_count;
		// Store forms
		localStorage[chkpt+"forms_count"] = Stage.formStack.length;
		for (var i=0; i<Stage.formStack.length; i++) {
			localStorage[chkpt+"formStack_"+i] = Stage.formStack[i];
		}
		localStorage[chkpt+"forms_style_count"] = Stage.formStyle.length;
		for (var i=0; i<Stage.formStyle.length; i++) {
			localStorage[chkpt+"formStyle_"+i] = Stage.formStyle[i];
		}
		// Store animation sets
		var aset_count = 0;
		for (prop in Stage.animations) {
			if (Stage.animations.hasOwnProperty(prop)) {
				localStorage[chkpt+"animation"+aset_count+"_name"] = prop;
				localStorage[chkpt+"animation"+aset_count+"_value"] = JSON.stringify(Stage.animations[prop]);
				aset_count++;
			}
		}
		localStorage[chkpt+"aset_count"] = aset_count;
		// Store config
		localStorage[chkpt+"Config"] = JSON.stringify(Config);
	}
	else if (cmd == "load") {
		var chkpt_exist = false;
		if (chkpt != '') {
			var pattern = "/^"+chkpt+"/g";
			for (prop in localStorage) {
				if (prop.match(eval(pattern))) {
					chkpt_exist = true;
					break;
				}
			}
		}
		else chkpt_exist = true;
		if ((localStorage.length <= 0) || !chkpt_exist){
			alert ("No checkpoint data found!\nStarting a new game instead...");
			return;
		}
		// populate layer 0
		Stage.layers[0].splice(0, Stage.layers[0].length);
		for (var i=0; i<parseInt(localStorage[chkpt+"l0_count"]); i++) {
			var bg = new Backdrop();
			bg.type = 'scene';
			var obj = new Array();
			for (var j=0; j<parseInt(localStorage[chkpt+"l0_"+i+"_obj_count"]); j++) {
				var item = {src:'', x:0, y:0, frames:1, fps:0};
				item.src = localStorage[chkpt+"l0_"+i+"_obj_"+j+"_src"];
				item.x = parseInt(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_x"]);
				item.y = parseInt(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_y"]);
				item.frames = parseInt(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_frames"]);
				item.fps = parseInt(localStorage[chkpt+"l0_"+i+"_obj_"+j+"_fps"]);
				obj.push(item);
			}
			bg.Create(localStorage[chkpt+"l0_"+i+"_id"], localStorage[chkpt+"l0_"+i+"_src"], obj);
			bg.effects = localStorage[chkpt+"l0_"+i+"_effects"];
			bg.alpha = parseFloat(localStorage[chkpt+"l0_"+i+"_alpha"]);
			bg.visible = (localStorage[chkpt+"l0_"+i+"_visible"] == "true");
			bg.transTime = parseFloat(localStorage[chkpt+"l0_"+i+"_time"]);
			bg.orientation = parseFloat(localStorage[chkpt+"l0_"+i+"_orientation"]);
			bg.rotation = parseFloat(localStorage[chkpt+"l0_"+i+"_orientation"]);
			bg.size = parseFloat(localStorage[chkpt+"l0_"+i+"_size"]);
			bg.scale = parseFloat(localStorage[chkpt+"l0_"+i+"_size"]);
			Stage.layers[0].push(bg);
			obj = null; bg = null;
		}
		// populate layer 1
		Stage.layers[1].splice(0, Stage.layers[1].length);
		for (var i=0; i<parseInt(localStorage[chkpt+"l1_count"]); i++) {
			var chr = new Character(localStorage[chkpt+"l1_"+i+"_id"]);
			//chr.type = 'actor';
			//chr.Create(localStorage[chkpt+"l1_"+i+"_id"]);
			chr.nick = localStorage[chkpt+"l1_"+i+"_nick"];
			chr.color = localStorage[chkpt+"l1_"+i+"_color"];
			chr.z_order = parseInt(localStorage[chkpt+"l1_"+i+"_zorder"]);
			for (var j=0; j<parseInt(localStorage[chkpt+"l1_"+i+"_sprites_count"]); j++) {
				var sprite = new Array(6);
				sprite[0] = localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_id"];
				sprite[1] = localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_src"];
				sprite[2] = localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_align"];
				sprite[3] = localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_frames"];
				sprite[4] = localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_fps"];
				sprite[5] = localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_reps"];
				chr.AddSprite(sprite);
				//chr.AddSprite(localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_id"], 
				//			  localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_src"],
				//			  localStorage[chkpt+"l1_"+i+"_sprites_"+j+"_align"]);
			}
			if (localStorage[chkpt+"l1_"+i+"_avatar"] != "undefined")
				chr.AddAvatar(localStorage[chkpt+"l1_"+i+"_avatar"]);
			else 
				chr.AddAvatar('');
			if (localStorage[chkpt+"l1_"+i+"_avatars"] != "undefined")
				chr.avatars = JSON.parse(localStorage[chkpt+"l1_"+i+"_avatars"]);
			else 
				chr.avatars = [];
			chr.activeSprite = parseInt(localStorage[chkpt+"l1_"+i+"_active"]);
			chr.offset = new Vector2d(parseInt(localStorage[chkpt+"l1_"+i+"_offset_x"]), parseInt(localStorage[chkpt+"l1_"+i+"_offset_y"]))
			chr.alpha = parseFloat(localStorage[chkpt+"l1_"+i+"_alpha"]);
			//chr.effects = localStorage[chkpt+"l1_"+i+"_effects"];
			if (localStorage[chkpt+"l1_"+i+"_effects"] != "undefined")
				chr.prevFx = localStorage[chkpt+"l1_"+i+"_effects"];
			else
				chr.prevFx = 'done';
			chr.transTime = parseFloat(localStorage[chkpt+"l1_"+i+"_time"]);
			chr.visible = (localStorage[chkpt+"l1_"+i+"_visible"] == "true");
			chr.pendingRemoval = (localStorage[chkpt+"l1_"+i+"_pending"] == "true");
			chr.posMode = localStorage[chkpt+"l1_"+i+"_posMode"];
			//chr.fxparam = localStorage[chkpt+"l1_"+i+"_fxparam"];
			chr.orientation = parseFloat(localStorage[chkpt+"l1_"+i+"_orientation"]);
			chr.rotation = parseFloat(localStorage[chkpt+"l1_"+i+"_orientation"]);
			chr.size = parseFloat(localStorage[chkpt+"l1_"+i+"_size"]);
			chr.scale = parseFloat(localStorage[chkpt+"l1_"+i+"_size"]);
			chr.stats = JSON.parse(localStorage[chkpt+"l1_"+i+"_stats"]);
			Stage.layers[1].push(chr);
			chr = null;
		}
		// populate layer 2
		Stage.layers[2].splice(0, Stage.layers[2].length);
		for (var i=0; i<parseInt(localStorage[chkpt+"l2_count"]); i++) {
			var ovl = new Backdrop();
			ovl.type = 'overlay';
			ovl.Create(localStorage[chkpt+"l2_"+i+"_id"], localStorage[chkpt+"l2_"+i+"_src"], null);
			ovl.effects = localStorage[chkpt+"l2_"+i+"_effects"];
			ovl.alpha = parseFloat(localStorage[chkpt+"l2_"+i+"_alpha"]);
			ovl.visible = (localStorage[chkpt+"l2_"+i+"_visible"] == "true");
			ovl.transTime = parseFloat(localStorage[chkpt+"l2_"+i+"_time"]);
			ovl.scroll = (localStorage[chkpt+"l2_"+i+"_scroll"] == "true");
			ovl.offset = new Vector2d(parseInt(localStorage[chkpt+"l2_"+i+"_offset_x"]), parseInt(localStorage[chkpt+"l2_"+i+"_offset_y"]))
			ovl.orientation = parseFloat(localStorage[chkpt+"l2_"+i+"_orientation"]);
			ovl.rotation = parseFloat(localStorage[chkpt+"l2_"+i+"_orientation"]);
			ovl.size = parseFloat(localStorage[chkpt+"l2_"+i+"_size"]);
			ovl.scale = parseFloat(localStorage[chkpt+"l2_"+i+"_size"]);
			Stage.layers[2].push(ovl);
			ovl = null;
		}
		// populate layer 3
		Stage.layers[3].splice(0, Stage.layers[3].length);
		for (var i=0; i<parseInt(localStorage[chkpt+"l3_count"]); i++) {
			var atm = new Atmosphere(localStorage[chkpt+"l3_"+i+"_id"]);
			var param = JSON.parse(localStorage[chkpt+"l3_"+i+"_param"]);
			//atm.Create(localStorage[chkpt+"l3_"+i+"_id"]);
			atm.Init(localStorage[chkpt+"l3_"+i+"_type"], param);
			atm.action = localStorage[chkpt+"l3_"+i+"_action"];
			atm.visible = (localStorage[chkpt+"l3_"+i+"_visible"] == "true");
			Stage.layers[3].push(atm);
			atm = null;
		}
		// populate layer 4
		Stage.layers[4].splice(0, Stage.layers[4].length);
		for (var i=0; i<parseInt(localStorage[chkpt+"l4_count"]); i++) {
			if (localStorage[chkpt+"l4_"+i+"_type"] == 'box') {
				var sb = new ScriptBox();
				sb.Create(Stage.canvas.width, Stage.canvas.height);
				sb.visible = (localStorage[chkpt+"l4_"+i+"_visible"] == "true");
				sb.text = localStorage[chkpt+"l4_"+i+"_text"];
				sb.pos = localStorage[chkpt+"l4_"+i+"_pos"];
				sb.back = localStorage[chkpt+"l4_"+i+"_back"];
				if (localStorage[chkpt+"l4_"+i+"_src"] != "undefined")
					sb.src = localStorage[chkpt+"l4_"+i+"_src"];
				else
					sb.src = null;
				if (localStorage[chkpt+"l4_"+i+"_prompt"] != "undefined") {
					sb.psrc = localStorage[chkpt+"l4_"+i+"_prompt"];
					sb.prompt.src = sb.psrc;
				}
				else 
					sb.psrc = '';
				if (localStorage[chkpt+"l4_"+i+"_avatar"] != "undefined") {
					for (var j in Stage.layers[1]) {
						if (Stage.layers[1][j].avatar && 
						   (Stage.layers[1][j].avatar.src.search(localStorage[chkpt+"l4_"+i+"_avatar"])!=-1)) {
							sb.avatar = Stage.layers[1][j].avatar;
							for (var k in Stage.layers[1][j].avatars) {
								if (Stage.layers[1][j].avatars[k].src == localStorage[chkpt+"l4_"+i+"_avatar"]) {
									sb.avatarStruct = JSON.parse(chkpt+"l4_"+i+"_avatarStruct");
									break;
								}
							}
							break;
						}
					}
				}
				else
					sb.avatar = null;
				if (localStorage[chkpt+"l4_"+i+"_balloon"] != "undefined")
					sb.balloon = localStorage[chkpt+"l4_"+i+"_balloon"];
				else
					sb.balloon = null;
				sb.cont = (localStorage[chkpt+"l4_"+i+"_cont"] == "true");
				sb.fontFamily = localStorage[chkpt+"l4_"+i+"_fontFamily"];
				sb.fontSize = localStorage[chkpt+"l4_"+i+"_fontSize"];
				sb.lineHeight = localStorage[chkpt+"l4_"+i+"_lineHeight"];
				sb.fontWeight = localStorage[chkpt+"l4_"+i+"_fontWeight"];
				sb.fontColor = localStorage[chkpt+"l4_"+i+"_fontColor"];
				sb.tagFamily = localStorage[chkpt+"l4_"+i+"_tagFamily"];
				sb.tagSize = localStorage[chkpt+"l4_"+i+"_tagSize"];
				sb.tagWeight = localStorage[chkpt+"l4_"+i+"_tagWeight"];
				sb.tagColor = localStorage[chkpt+"l4_"+i+"_tagColor"];
				sb.timeout = parseFloat(localStorage[chkpt+"l4_"+i+"_timeout"]);
				sb.textAlign = localStorage[chkpt+"l4_"+i+"_textAlign"];
				sb.textOffset.vx = parseInt(localStorage[chkpt+"l4_"+i+"_offset_x"]);
				sb.textOffset.vy = parseInt(localStorage[chkpt+"l4_"+i+"_offset_y"]);
				sb.inputFocus = (localStorage[chkpt+"l4_"+i+"_inputFocus"] == "true");
				sb.alpha = parseFloat(localStorage[chkpt+"l4_"+i+"_alpha"]);
				sb.effects = localStorage[chkpt+"l4_"+i+"_effects"];
				for (var j=0; j<parseInt(localStorage[chkpt+"l4_"+i+"_jumpTo_count"]); j++) {
					var menuItem = {hotspot:[], link:''};
					menuItem.link = localStorage[chkpt+"l4_"+i+"jumpTo"+j+"link"];
					menuItem.hotspot = [parseInt(localStorage[chkpt+"l4_"+i+"jumpTo"+j+"hotspot_x"]),
										parseInt(localStorage[chkpt+"l4_"+i+"jumpTo"+j+"hotspot_y"])];
					sb.jumpTo.push(menuItem);
				}			
				Stage.layers[4].push(sb);
				sb = null;
			}
			else {
				var element = new ActiveImage();
				var link = new Array();
				element.saveparam = JSON.parse(localStorage[chkpt+"l4_"+i+"_param"]);
				element.type = localStorage[chkpt+"l4_"+i+"_type"];
				CformElements[element.type]['_init'](element, element.saveparam);
				if (localStorage[chkpt+"l4_"+i+"_group"] != "undefined")
					element.group = localStorage[chkpt+"l4_"+i+"_group"];
				element.text = localStorage[chkpt+"l4_"+i+"_text"];
				element.visible = (localStorage[chkpt+"l4_"+i+"_visible"] == "true");
				for (var j=0; j<parseInt(localStorage[chkpt+"l4_"+i+"_link_count"]); j+=2) {
					link.push(eval(localStorage[chkpt+"l4_"+i+"_link_"+j]));
					link.push(JSON.parse(localStorage[chkpt+"l4_"+i+"_link_"+(j+1)]));
				}
				if (link.length > 0)
					element.link = link;
				else
					element.link = null;
				/*if ((localStorage[chkpt+"l4_"+i+"_link_0"] != "undefined") && 
					(localStorage[chkpt+"l4_"+i+"_link_1"] != "undefined")) {
					var link = new Array();
					link.push(eval(localStorage[chkpt+"l4_"+i+"_link_0"]));
					link.push(JSON.parse(localStorage[chkpt+"l4_"+i+"_link_1"]));
					element.link = link;
				}*/
				Stage.layers[4].push(element);
				element = null;
			}
		}
		// Populate sounds
		for (var i=0; i<4; i++) {
			Stage.sounds[i].splice(0, Stage.sounds[i].length);
			for (var j=0; j<parseInt(localStorage[chkpt+"s"+i+"_count"]); j++) {
				var s = new Sounds();
				s.src = localStorage[chkpt+"s"+i+"_"+j+"_src"];
				s.repeat = parseInt(localStorage[chkpt+"s"+i+"_"+j+"_repeat"]);
				s.delay = parseFloat(localStorage[chkpt+"s"+i+"_"+j+"_delay"]);
				s.isStopping = (localStorage[chkpt+"s"+i+"_"+j+"_isStopping"] == "true");
				s.isPaused = (localStorage[chkpt+"s"+i+"_"+j+"_isPaused"] == "true");
				Stage.sounds[i].push(s);
				s = null;
			}
		}
		// populate user variables
		Stage.variables = {};
		for (var i=0; i<parseInt(localStorage[chkpt+"uv_count"]); i++) {
			var uv = new UserVars();
			uv.Set(JSON.parse(localStorage[chkpt+"uv"+i+"_value"]),(localStorage[chkpt+"uv"+i+"_persist"] == "true"));
			Stage.variables[localStorage[chkpt+"uv"+i+"_name"]] = uv;
			uv = null;
		}
		// overwrite persistent user variables
		for (prop in localStorage) {
			if (prop.match(/^_persist_uv_/g)) {
				var uv = new UserVars();
				uv.Set(JSON.parse(localStorage[prop]), true);
				Stage.variables[prop.replace(/^_persist_uv_/g,'')] = uv;
				uv = null;
			}
		}
		
		// populate form stack and style
		Stage.formStack.splice(0, Stage.formStack.length);
		for (var i=0; i<parseInt(localStorage[chkpt+"forms_count"]); i++) {
			Stage.formStack.push(localStorage[chkpt+"formStack_"+i]);
		}
		Stage.formStyle.splice(0, Stage.formStyle.length);
		for (var i=0; i<parseInt(localStorage[chkpt+"forms_style_count"]); i++) {
			Stage.formStyle.push(localStorage[chkpt+"formStyle_"+i]);
		}
		// populate animations
		Stage.animations = [];
		for (var i=0; i<parseInt(localStorage[chkpt+"aset_count"]); i++) {
			Stage.animations[localStorage[chkpt+"animation"+i+"_name"]] = JSON.parse(localStorage[chkpt+"animation"+i+"_value"]);
		}
		// populate Config
		Config = JSON.parse(localStorage[chkpt+"Config"]);
		Helper.configUpdate("activeTheme");
		
		// populate frameStack
		Stage.script.frameStack = JSON.parse(localStorage[chkpt+"frameStack"])
		// then jump to checkpoint location
		if (localStorage[chkpt+"sequence"] != '')
			Stage.script.sequence = eval(localStorage[chkpt+"sequence"]);
		Stage.script.frame = parseInt(localStorage[chkpt+"frame"]);
	}
	else if (cmd == 'clear') {
		if (chkpt != '') {
			var pattern = "/^"+chkpt+"/g";
			for (prop in localStorage) {
				if (prop.match(eval(pattern))) {
					localStorage.removeItem(prop);
				}
			}
		}
	}
}

///////////////////////////////////////////////////////////////////////////////
// Stage elements
///////////////////////////////////////////////////////////////////////////////
// User variables
///////////////////////////////////////////////////////////////////////////////
function UserVars() {
	this.value = 0;
	this.type = 0;
	this.persist = false;
}
UserVars.prototype.Set = function(v,p) {
	this.value = v;
	this.type = typeof v;
	if (p) this.persist = p;
}
UserVars.prototype.Value = function() {
	return this.value;
}
UserVars.prototype.Type = function() {
	return this.type;
}
UserVars.prototype.Persist = function() {
	return this.persist;
}
///////////////////////////////////////////////////////////////////////////////
// Audio/Video elements
///////////////////////////////////////////////////////////////////////////////
function Sounds() {
	this.initd = false;
	this.src = 0;
	this.audio = new Audio();
	this.repeat = -1;
	this.delay = 0;
	this.isStopping = false;
	this.isPaused = false;
}
Sounds.prototype.Play = function(init) {
	var that = this;
	if (init && this.initd) return;
	if ((this.audio != null) &&
		(this.src != null)) {
		if (init) {
			this.audio.src = this.src;
			Helper.addEvent(this.audio, 'ended', function(e) {
				if (that.repeat > 0) {
					that.Play(false);
					that.repeat--;
				}
				else if (that.repeat < 0) {
					that.Play(false);
				}
				else {
					that.isPaused = true;
				}
			}, false);
			this.audio.volume = Config.volumeAudio;
			if (!this.isPaused) {
				if (this.delay > 0)
					setTimeout(function() {
						if (!that.isPaused && !that.isStopping)
							that.audio.play();
					}, this.delay * 1000);
				else
					this.audio.play();
			}
			this.initd = true;
		}
		else {
			this.audio.volume = Config.volumeAudio;
			this.isPaused = false;
			if (this.delay > 0)
				setTimeout(function() {
					if (!that.isPaused && !that.isStopping)
						that.audio.play();
				}, this.delay * 1000);
			else
				this.audio.play();
		}
	}
}
Sounds.prototype.Stop = function(immediate) {
	if ((this.audio != null) &&	(this.initd)) {
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
}
Sounds.prototype.Pause = function() {
	if ((this.audio != null) && (this.initd)) {
		this.audio.pause();
		this.isPaused = true;
	}
}
Sounds.prototype.Seek = function(pos) {
	if ((this.audio != null) && (this.initd)) {
		this.audio.currentTime = pos;
	}
}
Sounds.prototype.Rewind = function() {
	if ((this.audio != null) &&	(this.initd)) {
		this.audio.currentTime = 0;
	}
}
function Movie() {
	this.initd = false;
	this.src = 0;
	this.movie = document.createElement('video');
	this.isStopping = false;
	this.pos = new Vector2d(0,0);
	this.parent = 0;
}
Movie.prototype.Play = function() {
	var that = this;
	if (this.initd)	return;
	if ((this.movie != null) && 
		(this.src != null)) {
		Helper.addEvent(this.movie, 'ended', function(){
			that.isStopping = true;
		}, false);
		if (!Config.movieOnCanvas) {
			Helper.addEvent(this.movie, 'mouseup', function(e) {
				if (e.which != 1) return;
				that.isStopping = true;
			}, false);
			Helper.addEvent(this.movie, 'touchend', function(e) {
				e.preventDefault();
				that.isStopping = true;
			}, false);

			this.pos.vx = Stage.canvas.offsetLeft;
			this.pos.vy = Stage.canvas.offsetTop;
		}
		this.movie.src = this.src;
		this.movie.width = Config.movieSize * Stage.canvas.width;
		this.movie.height = Config.movieSize * Stage.canvas.height;
		this.pos.vx += (Stage.canvas.width - this.movie.width)>>1; 
		this.pos.vy += (Stage.canvas.height - this.movie.height)>>1; 

		this.initd = true;
		this.movie.autoplay = true;
		this.movie.volume = Config.volumeVideo;
		if (!Config.movieOnCanvas) {
			this.movie.setAttribute('style', 'position:absolute; left:'+this.pos.vx+'px; top:'+this.pos.vy+'px');
			this.parent = Stage.canvas.parentElement;
			this.parent.appendChild(this.movie);
		}
	}
}
Movie.prototype.Stop = function(init) {
	if ((this.movie != null) && (this.initd)) {
		this.movie.pause();
		if (!Config.movieOnCanvas)
			this.parent.removeChild(this.movie);
		this.movie = null;
		Stage.pause = false;
	}
}
///////////////////////////////////////////////////////////////////////////////
// Default form elements
///////////////////////////////////////////////////////////////////////////////
function Form(id) {
	this.newForm = document.createElement("form");
	this.newFieldset = document.createElement("fieldset");
	//this.parent = 0;
		
	this.newForm.id = id;
	var x = Stage.canvas.offsetLeft;
	var y = Stage.canvas.offsetTop;
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
}
Form.prototype.AddChild = function(element, fieldsetname) {
	if (fieldsetname != null)
		document.getElementById(fieldsetname).appendChild(element);
	else
		this.newFieldset.appendChild(element);
}
///////////////////////////////////////////////////////////////////////////////
// Background/Overlay image
///////////////////////////////////////////////////////////////////////////////
function Backdrop() {
	this.isready = false,
	this.loaded = 1;

	this.type = '';
	this.context = 0;
	this.image = 0;
	this.objects = new Array();
	this.drawn = false;
	this.redraw = true;
	this.visible = true;
	this.update = false;
		
	this.effects = 'done';
	this.fxparam = '';
	this.alpha = 0;
	this.target_alpha = 1;
	this.rotation = 0;
	this.accum_rotation = 0;
	this.orientation = 0;
	this.scale = 1;
	this.size = 1;
	this.scroll = false;
	this.transTime = 1;
	this.wait = true;

	this.origin = new Vector2d(0,0);		// backdrop's origin is center
	this.pos = new Vector2d(0,0);
	this.target_pos = new Vector2d(0,0);
	this.offset = new Vector2d(0,0);
	this.backdropDim = new Vector2d(0,0);
}
Backdrop.prototype.Create = function(id, file, obj) {
	var that = this;
	var canvas = document.createElement('canvas');
	canvas.id = escape(id);
	this.context =  canvas.getContext('2d');

	if (obj) {
		this.loaded += obj.length;	// total number of images to load
		for (var i in obj) {
			var item = {img:new Image(), x:obj[i].x, y:obj[i].y, frames:obj[i].frames, fps:obj[i].fps,
						bdTimer:0, bdTimerOn:false, curFrame:0};	// each object needs to have its own timer
			Helper.addEvent(item.img, 'load', function() {
				that.IsLoaded();
			}, false);
			item.img.src = Helper.parseArg(obj[i].src);
			this.objects.push(item);
			item = null;
		}
	}
	if (Helper.checkIfImage(file)) {
		this.image = new Image();
		Helper.addEvent(this.image, 'load', function() {
			// use larger canvas to support sprite rotation
			that.backdropDim = new Vector2d(that.image.width, that.image.height);
			var dim = Math.ceil(that.backdropDim.length());
			that.context.canvas.setAttribute('width', dim);
			that.context.canvas.setAttribute('height', dim);
			that.origin = new Vector2d(dim/2, dim/2);
			that.IsLoaded();
		}, false);
		this.image.src = Helper.parseArg(file);
	}
	else {
		// assume valid HTML color
		this.image = file;
		this.context.canvas.setAttribute('width', 1.1*Stage.canvas.width);
		this.context.canvas.setAttribute('height', 1.1*Stage.canvas.height);
		this.origin = new Vector2d(this.context.canvas.width>>1, this.context.canvas.height>>1);
		this.isready = true;
	}
	// configure transition
	this.transTime = (Config.transTime > 0) ? Config.transTime : 0.1;
	this.update = false;
	this.Reset(true);
	canvas = null;
	return this.context.canvas.id;
}		
Backdrop.prototype.IsLoaded = function() {
	if (--this.loaded <= 0)
		this.isready = true;
}
Backdrop.prototype.Reset = function(init) {
	if ((init) || (!this.visible)) {
		this.target_pos = new Vector2d(Stage.canvas.width>>1, Stage.canvas.height>>1);
		this.pos.copy(this.target_pos);
	}
	this.visible = true;
	this.redraw = true;
}
Backdrop.prototype.Update = function(elapsed) {
	var that = this;
	if (this.isready) Helper.processEffects(this, elapsed);
	// update object timers
	if (this.objects.length>0) {
		for (var i in this.objects) {
			if ((!this.objects[i].bdTimerOn) && (this.objects[i].fps>0)) {
				this.objects[i].bdTimer = setTimeout(function() {
					that.objects[i].curFrame = (++that.objects[i].curFrame) % that.objects[i].frames;
					that.redraw = true;
					if (that.visible) that.objects[i].bdTimerOn = false;
				}, 1000/this.objects[i].fps);
				this.objects[i].bdTimerOn = true;
			}
		}
	}
	return this.update;
}
Backdrop.prototype.Draw = function() {
	if (!this.isready) return false;
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
								((this.context.canvas.width - this.backdropDim.vx)/2)>>0,
								((this.context.canvas.height - this.backdropDim.vy)/2)>>0);
		}
		else {
			this.context.fillStyle = this.image;
			this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);		
		}
		if (this.objects.length > 0) {
			for (var i in this.objects) {
				if (this.objects[i].fps == 0) {
					this.context.drawImage(this.objects[i].img, 
						(this.objects[i].x + (this.context.canvas.width - this.backdropDim.vx)/2)>>0,
						(this.objects[i].y + (this.context.canvas.height - this.backdropDim.vy)/2)>>0);
				}
				else {
					this.context.drawImage(this.objects[i].img,
						this.objects[i].curFrame * this.objects[i].img.width / this.objects[i].frames,
						0, this.objects[i].img.width / this.objects[i].frames, this.objects[i].img.height,
						(this.objects[i].x + (this.context.canvas.width - this.backdropDim.vx)/2)>>0,
						(this.objects[i].y + (this.context.canvas.height - this.backdropDim.vy)/2)>>0,
						this.objects[i].img.width / this.objects[i].frames, this.objects[i].img.height);
				}
			}
		}
	}
	this.redraw = false;
	if (this.drawn) this.update = true;
	return true;
}
///////////////////////////////////////////////////////////////////////////////
// Canvas Form elements plug-ins
///////////////////////////////////////////////////////////////////////////////
var CformElements = {
	button: {
		_init: function (obj, param) {
			var rect = new Rect(param.x, param.y, (param.w)?param.w:0, (param.h)?param.h:0);
			var sprites = new Array();
			if (param.base) sprites.push(param.base);
			sprites.push((param.hover)?param.hover:param.base);
			sprites.push((param.click)?param.click:param.base);
			obj.Create(param.name, rect, sprites);
			if (param.link) obj.link = param.link;
			if (param.showText == false) obj.showText = false;
			if (param.align) obj.align = param.align;
			if (param.tip) obj.tooltip = param.tip;
		},
		_update: function (obj, elapsed) {
			if (!Helper.checkMapAccess(obj.group, obj.id)) return;
			if (obj.prev_state != obj.state) {
				obj.prev_state = obj.state;
				obj.redraw = true;	
				if ((obj.state == 'hover') || (obj.state == 'clicked')) {
					obj.inputFocus = true;
					if (obj.tooltip != '') Stage.Transition(1.0);
				}
				else
					obj.inputFocus = false;
			}
			if (Stage.mouseClick && obj.inputFocus) {
				if (obj.link != null) {
					obj.link[0](obj.link[1]);
					Stage.pause = false;
				}
				obj.redraw = true;
			}
		},
		_draw: function (obj) {
			if (!Helper.checkMapAccess(obj.group, obj.id)) return;
			if ((obj.sprites.length>1) && (obj.state=='hover'))
				obj.DrawImageOrFill(obj.sprites[1]);
			else if ((obj.sprites.length>2) && (obj.state=='clicked'))
				obj.DrawImageOrFill(obj.sprites[2]);
			else
				obj.DrawImageOrFill(obj.sprites[0]);
		},
	},
	toggle: {
		_init: function (obj, param) {
			obj.type = "toggle";
			CformElements.button._init(obj, param);
		},
		_update: function (obj, elapsed) {
			if (!Helper.checkMapAccess(obj.group, obj.id)) return;
			if (obj.prev_state != obj.state) {
				obj.prev_state = obj.state;
				obj.redraw = true;	
				if ((obj.state == 'hover') || (obj.state == 'clicked')) {
					obj.inputFocus = true;
					if (obj.tooltip != '') Stage.Transition(1.0);
				}
				else
					obj.inputFocus = false;
			}
			if (Stage.mouseClick && obj.inputFocus) {
				if (obj.link != null) {
					obj.link[0](obj.link[1]);
					Stage.pause = false;
				}
				/* swap base and click images */
				var newbase = obj.sprites.pop();
				var newclick = obj.sprites.shift();
				obj.sprites.unshift(newbase);
				obj.sprites.push(newclick);
				newbase = null; newclick = null;
				obj.redraw = true;
			}
		},
		_draw: function (obj) {
			CformElements.button._draw(obj);
		},
	},
	picture: {
		_init: function (obj, param) {
			obj.type = "picture";
			obj.fps = (param.fps > 1) ? param.fps : 1;
			var rect = new Rect(param.x, param.y, 0, 0);
			var sprites = new Array();
			for (var i in param.frames) 
				sprites.push(param.frames[i]);
			obj.Create(param.name, rect, sprites);
			obj.showText = false;
		},
		_update: function (obj, elapsed) {
			if ((!obj.aTimerOn) && (obj.sprites.length > 1)) {
				obj.aTimer = setTimeout(function() {
					obj.countup = (++obj.countup) % obj.sprites.length;
					obj.redraw = true;
					if (obj.visible) obj.aTimerOn = false;
				}, 1000/obj.fps);
				obj.aTimerOn = true;
			}
		},
		_draw: function (obj) {
			obj.DrawImageOrFill(obj.sprites[obj.countup]);
		}
	},
	timer: {
		_init: function (obj, param) {
			obj.type = "timer";
			obj.fps = 1;
			if (param.timeout) obj.timeout = param.timeout;
			if (param.link) obj.link = param.link;
			var rect = new Rect(param.x, param.y, param.w, param.h);
			obj.Create(param.name, rect, null);

			obj.text = Helper.convertTime(obj.timeout);
			// create a user variable named param.name
			var val = Helper.findVar(escape(param.name));
			if (val != null) {
				Stage.variables[escape(param.name)].Set(obj.timeout, false);
			}
			else {
				var uv = new UserVars();
				uv.Set(obj.timeout, false);
				Stage.variables[escape(param.name)] = uv;
			}
			obj.countup = !(obj.timeout > 0);
		},
		_update: function (obj, elapsed) {
			if (!obj.aTimerOn) {
				this.aTimer = setTimeout(function() {
					if (obj.countup)
						Helper.setValue(obj.id, Helper.getValue(obj.id)+1);
					else
						Helper.setValue(obj.id, Helper.getValue(obj.id)-1);
					obj.text = Helper.convertTime(Helper.getValue(obj.id));
					obj.redraw = true;
					if (!obj.countup) {
						if (Helper.getValue(obj.id) > 0) {
							if (obj.visible) obj.aTimerOn = false;
						}
						else {
							if (obj.link != null) {
								obj.link[0](obj.link[1]);
								Stage.pause = false;
							}
						}
					}
					else {
						if (obj.visible) obj.aTimerOn = false;
					}
				}, 1000/obj.fps );
				obj.aTimerOn = true;
			}
		},
		_draw: function (obj) {
			obj.DrawImageOrFill(obj.sprites[0]);
		},
	},
	marquee: {
		_init: function (obj, param) {
			obj.type = "marquee";
			obj.fps = (param.fps > 1) ? param.fps : 1;
			if (param.timeout) obj.timeout = param.timeout;
			if (param.link) obj.link = param.link;
			var rect = new Rect(param.x, param.y, param.w, param.h);
			obj.Create(param.name, rect, null);

			// add the text to sprites array
			for (var i in param.frames) 
				obj.sprites.push(param.frames[i]);
			obj.text = param.frames[0];
		},
		_update: function (obj, elapsed) {
			if ((!obj.aTimerOn) && (obj.sprites.length > 2)) {
				obj.aTimer = setTimeout(function() {
					obj.countup++;
					obj.countup %= obj.sprites.length-1;
					obj.redraw = true;
					obj.text = obj.sprites[obj.countup+1];
					if (obj.visible) obj.aTimerOn = false;
				}, 1000/obj.fps);
				obj.aTimerOn = true;
			}
		},
		_draw: function (obj) {
			obj.DrawImageOrFill(obj.sprites[0]);
		},
	},
};
///////////////////////////////////////////////////////////////////////////////
// Selectable/clickable image; use for buttons, imagemaps, etc.
///////////////////////////////////////////////////////////////////////////////
function ActiveImage() {
	this.isready = false,
	this.redraw = true,
	this.loaded = 0,
	this.update = false,
	this.prev_state = '',
	this.aTimer = 0,
	this.aTimerOn = false;

	this.type = 'button';
	this.id = '';
	this.group = '';
	this.context = 0;
	this.sprites = new Array();
	this.inputFocus = false;
	this.text = '';
	this.link = null;
	this.origin = new Vector2d(0,0);
	this.rect = new Rect(0, 0, 0, 0);
	this.visible = true;
	this.showText = true;
	this.align = 'center';
	this.state = '';
	this.tooltip = '';
	this.saveparam = {};
	
	this.fps = 0;
	this.timeout = 0;
	this.countup = 0;
}
ActiveImage.prototype.Create = function(id, rect, obj) {
	var that = this;
	var canvas = document.createElement('canvas');
	canvas.id = escape(id);
	this.id = id;
	this.context = canvas.getContext('2d');
	this.text = id;
	this.rect = rect;
	this.origin = new Vector2d(this.rect.x, this.rect.y);
	
	try {
		if (obj.length>0) {
			this.loaded = obj.length;
			for (var i in obj) {
				if (Helper.checkIfImage(obj[i])) {
					var item = new Image();
					Helper.addEvent(item, 'load', function() {
						that.IsLoaded();
					}, false);
					item.src = obj[i];
					this.sprites.push(item);
					this.rect.w = 0;
					this.rect.h = 0;
					item = null;
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
		this.isready = true;
	}
	canvas = null;
},
ActiveImage.prototype.IsLoaded = function() {
	if (--this.loaded <= 0) {
		this.isready = true;
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
}
ActiveImage.prototype.Update = function(elapsed) {
	var that = this;
	if (this.isready) {
		if (!this.visible)
			this.inputFocus = false;
		else
			CformElements[this.type]['_update'](this, elapsed);
	}
	return this.update;
}
ActiveImage.prototype.Draw = function() {
	if (!this.isready) return false;
	if (!this.redraw) return false;

	if (this.visible) {
		this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
		CformElements[this.type]['_draw'](this);
		if ((this.showText) && (this.text != '')) {
			this.context.textBaseline = 'middle';
			this.context.textAlign = this.align;
			if (Stage.formStyle.length > 0)
				this.context.font = Stage.formStyle[0];
			if (Stage.formStyle.length > 1)
				this.context.fillStyle = Stage.formStyle[1];
			if (this.align == 'left')
				this.context.fillText(this.text, 0,this.rect.h/2);
			else if (this.align == 'right')
				this.context.fillText(this.text, this.rect.w,this.rect.h/2);
			else
				this.context.fillText(this.text, this.rect.w/2,this.rect.h/2);
		}			
		if (this.link != null) {
			// create a detectable path
			this.context.beginPath();
			this.context.rect(this.rect.x,this.rect.y,this.rect.w,this.rect.h);
			this.context.closePath();
		}
	}
	this.redraw = false;
	this.update = true;
	return true;
}
ActiveImage.prototype.DrawImageOrFill = function(obj) {
	if ((obj.constructor == HTMLImageElement) || (obj.constructor == Image))
		this.context.drawImage(obj,0,0);
	else {
		this.context.fillStyle = obj;
		this.context.fillRect(0,0,this.context.canvas.width,this.context.canvas.height);
	}
}
///////////////////////////////////////////////////////////////////////////////
// Script box and script handler for dialogs
///////////////////////////////////////////////////////////////////////////////
function ScriptBox() {	
	this.image = null;
	this.vpwidth = 0;
	this.vpheight = 0;
	this.redraw = true;
	this.update = false;
	this.fxupdate = false;
	this.menuHover = -1;
	this.curLineCount = 0;

	this.type = 'box';				// identifies type of gui
	this.group = '';
	this.pos = 'bottom';
	this.back = 'dim';
	this.src = null;
	this.balloon = null;
	this.context = 0;
	this.canvasText = new CanvasText;
	this.dimStyle = new Array();
	this.balloonStyle = new Array();
	this.jumpTo = new Array();
	this.origin = new Vector2d(0,0);		// gui origin is topleft
		
	this.isready = true;				// flow control
	this.changed = true;
	this.cont = false;
	this.visible = false;
	this.inputFocus = false;
	this.timeout = 0;

	this.text = '';					// text display
	this.prompt = new Image();
	this.avatar = null;				// avatar kept for compatibility
	this.avatarStruct = null;		// for avatar parameters
	this.psrc = '';
	this.alpha = 1;
	this.effects = 'none';
	this.scrollOffsetY = 0;

	this.fontFamily = 'Verdana';		// font properties
	this.fontColor = 'white';
	this.fontSize = '14px';
	this.fontWeight = 'normal';
	this.lineHeight = '18';
	this.textOffset = new Vector2d(10, 20);
	this.textAlign = 'start';
	this.tagFamily = this.fontFamily;
	this.tagColor = '#c8ffc8';
	this.tagSize = this.fontSize;
	this.tagWeight = 'bold';
}
ScriptBox.prototype.Create = function(w, h) {
	var that = this;
	this.src = '';
	this.vpwidth = w;	// viewport dimensions
	this.vpheight = h;
	this.origin.vx = this.vpwidth * (1-Config.boxWidth)/2;
	this.origin.vy = this.vpheight * (1-Config.boxHeight);
	
	// create a default script box: dim at bottom
	var canvas = document.createElement('canvas');
	this.context = canvas.getContext('2d');
	this.context.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
	this.context.canvas.setAttribute('height', this.vpheight * Config.boxHeight);
	// create prompt this.images
	if (this.psrc != '') {
		Helper.addEvent(this.prompt, 'load', function() {
			that.isready = true;
		}, false);
		this.prompt.src = this.psrc;
	}
	canvas = null;
}
ScriptBox.prototype.Update = function(elapsed) {
	var that = this;
	if (this.changed || this.fxupdate) {
		if (this.changed) {
			if (!this.balloon) {
				switch (this.pos) {
					case 'bottom':
						this.origin.vx = this.vpwidth * (1-Config.boxWidth)/2;
						this.origin.vy = this.vpheight * (1-Config.boxHeight);
						this.context.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
						this.context.canvas.setAttribute('height', this.vpheight * Config.boxHeight);
						break;
					case 'center':
						this.origin.vx = this.vpwidth * (1-Config.boxWidth)/2;
						this.origin.vy = this.vpheight * (1-Config.boxHeight)/2;
						this.context.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
						this.context.canvas.setAttribute('height', this.vpheight * Config.boxHeight);
						break;
					case 'top':
						this.origin.vx = this.vpwidth * (1-Config.boxWidth)/2;
						this.origin.vy = 0;
						this.context.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
						this.context.canvas.setAttribute('height', this.vpheight * Config.boxHeight);
						break;
					case 'full':
						this.origin.vx = this.vpwidth * (1-Config.boxWidth)/2;
						this.origin.vy = this.vpheight * (1-Config.boxFullHeight)/2;
						this.context.canvas.setAttribute('width', this.vpwidth * Config.boxWidth);
						this.context.canvas.setAttribute('height', this.vpheight * Config.boxFullHeight)
						break;
				}
			}
			else {
				var xoffset = 0, yoffset = 0;
				for (var i in Stage.layers[1]) {
					if (Stage.layers[1][i].id == this.balloon) {
						// TODO: race issue: when checkpoint loading, actor sprite haven't completed
						// loading yet when actor origin is used below, so set a default to half of 
						// viewport height instead of half of actor sprite
						if (Stage.layers[1][i].origin.vy <= 0)
							yoffset = this.vpheight * (1 - Config.balloonHeight)/2;
						else
							yoffset = Stage.layers[1][i].pos.vy - Stage.layers[1][i].origin.vy/2 
								  - Config.balloonHeight * this.vpheight * 0.5;
						if (Stage.layers[1][i].pos.vx >= this.vpwidth/2)
							xoffset = Stage.layers[1][i].pos.vx - Config.balloonWidth * this.vpwidth * 0.75;
						else
							xoffset = Stage.layers[1][i].pos.vx - Config.balloonWidth * this.vpwidth * 0.25;
						break;
					}
				}
				this.origin.vx = xoffset;
				this.origin.vy = yoffset;
				this.context.canvas.setAttribute('width', this.vpwidth * Config.balloonWidth);
				this.context.canvas.setAttribute('height', this.vpheight * Config.balloonHeight);
			}
			switch (this.back) {
				case 'image':
					if (this.src != null) {
						if ((this.image == null) || (this.image.src.search(this.src)==-1)) {
							this.image = new Image();
							this.isready = false;
							Helper.addEvent(this.image, 'load', function() {
								that.isready = true;
							}, false);
							this.image.src = this.src;
							this.update = false;
						}
					}
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
					this.fxupdate = true;
				}
				this.update = false;
				break;
			case 'scroll':
				if (this.scrollOffsetY <= -(this.curLineCount+1) * this.lineHeight) {
					this.effects = 'none';
					//this.scrollOffsetY = 0;
					this.timeout = 0.1;	// setup timer once scroll is finished
				}
				else {
					this.scrollOffsetY -= Config.boxScrollSpeed * elapsed/(Config.transTime * 25);
					this.fxupdate = true;
					this.timeout = 0;	// disable timer if enabled
				}
				this.update = false;
				break;
			case 'none':
			default:
				this.fxupdate = false;
				break;
		}
		this.changed = false;
		this.redraw = true;
	}
	if (this.CheckHoverOnHotspot()) {
		this.redraw = true;
	}
	if ((this.avatar != null) && (this.avatarStruct != null)) {
		if ((!this.avatarStruct.avTimerOn) && (this.avatarStruct.fps>0)) {
			this.avatarStruct.avTimer = setTimeout(function() {
				that.avatarStruct.curFrame = (++that.avatarStruct.curFrame) % that.avatarStruct.frames;
				if (that.avatarStruct.curFrame == 0) that.avatarStruct.curRep++;
				that.redraw = true;
				if (that.visible) { 
					if ((that.avatarStruct.reps < 0) || (that.avatarStruct.curRep < that.avatarStruct.reps))
						that.avatarStruct.avTimerOn = false;
				}
			}, 1000/this.avatarStruct.fps);
			this.avatarStruct.avTimerOn = true;
		}
	}
	if (Stage.mouseClick && this.inputFocus && (this.menuHover != -1)) {
		if (typeof this.jumpTo[this.menuHover].link == 'string')
			Stage.script.SetFrame(this.jumpTo[this.menuHover].link);
		else {
			// this is an object, must be "set" command
			set(this.jumpTo[this.menuHover].link);
		}
		this.inputFocus = false;
		this.menuHover = -1;
		this.jumpTo.splice(0,this.jumpTo.length);
		this.visible = false;
		this.redraw = true;
	}
	return this.update;
}
ScriptBox.prototype.Draw = function() {
	if (!this.isready) return false;
	if (!this.redraw) return false;
	
	if (this.visible == true) {
		this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
		if (!this.balloon) {
			if (this.back == 'dim') {
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
			if ((this.back == 'image') && (this.src != null)) {
				this.context.globalAlpha = 1;		
				this.context.drawImage(this.image, 0, 0, this.context.canvas.width,this.context.canvas.height);
			}
		}
		else {
			this.context.globalAlpha = 0.5;
			this.context.lineWidth = 2;
			this.context.strokeStyle = this.balloonStyle[0];
			
			if (this.balloonStyle.length > 2) {
				var grd=this.context.createLinearGradient(0,0,0,this.context.canvas.height);
				grd.addColorStop(0,this.balloonStyle[1]);
				grd.addColorStop(1,this.balloonStyle[2]);
				this.context.fillStyle=grd;
			} 
			else if (this.balloonStyle.length > 1){
				this.context.fillStyle = this.balloonStyle[1];
			}
			
			var balloon_ptr = true;
			for (var i in Stage.layers[1]) {
				if (Stage.layers[1][i].id == this.balloon) {
					if (Stage.layers[1][i].pos.vx >= this.vpwidth/2)
						balloon_ptr = false;
					break;
				}
			}
			Helper.createBalloon(this.context,
								 0,this.lineHeight,this.context.canvas.width,this.context.canvas.height,
								 10,balloon_ptr);
			this.context.fill();
			this.context.stroke();
		}
		if (this.text != '') {
			this.context.globalAlpha = 1;
			// draw the avatar if any
			var avatarOffsetX = 0;
			if ((Config.actorShowAvatar == true) && (!this.balloon)){
				if (this.avatar != null) {
					if (this.avatarStruct.fps == 0) {
						avatarOffsetX = this.avatar.width;
						this.context.drawImage(this.avatar, 
											   (this.textOffset.vx/2)>>0, 
											   ((this.context.canvas.height - this.avatar.height)/2)>>0);
					}
					else {
						avatarOffsetX = this.avatar.width / this.avatarStruct.frames;
						this.context.drawImage(this.avatar,
									this.avatarStruct.curFrame * this.avatar.width / this.avatarStruct.frames,
									0, avatarOffsetX, this.avatar.height,
									(this.textOffset.vx/2)>>0,
									((this.context.canvas.height - this.avatar.height)/2)>>0,
									avatarOffsetX, this.avatar.height);
					}
				}
			}
			var ret = this.canvasText.drawText({
				text:this.text,
				x: this.textOffset.vx + avatarOffsetX,
				y: this.textOffset.vy + ((this.balloon) ? this.lineHeight : 0), // + this.scrollOffsetY,
				align: this.textAlign,
				alpha: this.alpha,
				boxWidth:this.context.canvas.width-2*this.textOffset.vx - avatarOffsetX,
				scroll: [(this.effects == 'scroll'), this.scrollOffsetY],
			});
			// draw the prompt icon
			if (typeof ret == "object") {
				//vncanvas doesn't use cache or return this.image
				this.curLineCount = ret.linecount;
				if (ret.hotspot.length == 0) {
					if ((this.effects == 'none') && (this.psrc != '') && (!this.balloon))
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
			if ((this.jumpTo.length > 0) && (this.menuHover != -1)) {
				this.context.save();
				this.context.globalAlpha = 0.25;
				this.context.fillStyle = Config.activeTheme.boxMenuHilite;
				this.context.fillRect(5,this.jumpTo[this.menuHover].hotspot[1] - this.lineHeight + 4,
										this.context.canvas.width - 10,this.lineHeight);
				this.context.restore();
			}
		}
		// Pauses script box
		Stage.pause = true;
		if (!Stage.utimerOn && (this.timeout > 0)) {
			Stage.utimer = setTimeout((function(self) { 
				return function() {
					Stage.pause = false; 
					Stage.utimerOn = false;
					self.timeout = 0;
				}
			})(this), this.timeout * 1000);
			Stage.utimerOn = true;
		}
	}
	else {
		Stage.pause = false;
	}
	if (!this.changed) this.update = true;
	this.redraw = false;
	return true;
}
ScriptBox.prototype.CheckHoverOnHotspot = function() {
	if (Stage.mouseMove == false) return false;
	if (this.jumpTo.length == 0) return false;
	if (this.jumpTo[0].hotspot.length < 2) return false;
	if (Stage.coord.vx < this.origin.vx) return false;
	if (Stage.coord.vx > this.origin.vx + this.vpwidth * Config.boxWidth) return false;
	
	for (var i in this.jumpTo) {
		if (Stage.coord.vy < this.origin.vy + this.jumpTo[i].hotspot[1] - this.lineHeight) continue;
		if (Stage.coord.vy > this.origin.vy + this.jumpTo[i].hotspot[1]) continue;
		this.menuHover = i;
		return true;
	}
	return false;
}
function Script() {
	this.sequence = 0;		// story board, composed of object-value pairs
	this.frame = 0;			// sequence counter
	this.frameStack = new Array();
}
Script.prototype.Init = function(name) {
	this.sequence = name;
	this.frame = 0;
}
Script.prototype.Update = function() {
	if (Helper.supportsLocalStorage()) {
		if (Stage.script.sequence[0] == label) {
			var tmp = new Array();
			if (localStorage["_persist_skip_"+Stage.script.sequence[1]] != null)
				tmp = JSON.parse(localStorage["_persist_skip_"+Stage.script.sequence[1]]);
			if ((tmp.length == 0) || (tmp.length%2 == 1)) tmp.push(Stage.script.frame);
			else {
				var found = false;
				for (var i=0; i<tmp.length; i+=2) {
					if ((Stage.script.frame >= tmp[i]) && (Stage.script.frame <= tmp[i+1]+2)) {
						if (Stage.script.frame > tmp[i+1]) tmp.splice(i+1,1,Stage.script.frame);
						found = true;
						break;
					}
				}
				if (!found) tmp.push(Stage.script.frame);
			}
			localStorage["_persist_skip_"+Stage.script.sequence[1]] = JSON.stringify(tmp);
			Stage.skipTextUpdated = true;
			tmp = null;
		}
	}
	if (this.sequence.length > this.frame) {
		if (typeof(this.sequence[this.frame]) == "function") {
			this.sequence[this.frame](this.sequence[this.frame+1]);
		}
		else if (typeof(this.sequence[this.frame]) == "string") {
			// assumes an actor shortcut
			if (Helper.checkIfActor(this.sequence[this.frame])) {
				if (typeof this.sequence[this.frame+1] == "string") {
					var param = {id:this.sequence[this.frame],
							     say:this.sequence[this.frame+1]};
				}
				else {
					var param = this.sequence[this.frame+1];
					param.id = this.sequence[this.frame];
				}
				actor(param);
				param = null;
			}
			
		}
		this.frame += 2;
	}
	else if (this.sequence.length > 0) {
		/*alert("End of script!"); */
		Stage.update = false;
		Stage.pause = true;
	}
}
Script.prototype.SetFrame = function(locator) {
	var str = locator.split('#');
	if (str.length > 1)
		this.sequence = eval(str.shift());
	var newlabel = str.shift();
	for (var i=0; i<this.sequence.length; i+=2){
		if ((this.sequence[i] == label) && (this.sequence[i+1] == newlabel)) {
			this.frame = i;
			return true;
		}
	}
	return false;
}
Script.prototype.PushFrame = function() {
	var seq_name = '';
	if (this.sequence[0] == label)
		seq_name = this.sequence[1];
	// TODO: limit stack to 8 
	while (this.frameStack.length >= 8)
		this.frameStack.shift();
	this.frameStack.push([seq_name, this.frame-2]);
}
Script.prototype.PopFrame = function() {
	if (this.frameStack.length > 0) {
		var ret_frame = this.frameStack.pop();
		this.sequence = eval(ret_frame[0]);
		this.frame = ret_frame[1];
	}
}
Script.prototype.Insert = function(newScript) {
	for (var i=0; i<newScript.length; i+=2) {
		if ((this.sequence[this.frame+2+i] == newScript[i]) &&
			(JSON.stringify(this.sequence[this.frame+3+i]) == JSON.stringify(newScript[i+1]))) {
			this.sequence.splice(this.frame+2+i,2);
		}
		this.sequence.splice(this.frame+2+i,0,newScript[i]);
		this.sequence.splice(this.frame+3+i,0,newScript[i+1]);
	}
}
///////////////////////////////////////////////////////////////////////////////
// Actors
///////////////////////////////////////////////////////////////////////////////
function Character(id, order) {
	this.type = 'actor';
	//this.context = 0;
	this.sprites = new Array();
	this.avatar = null;
	this.avatars = new Array();				// avatar array with tags
	//this.id = '';
	this.nick = '';
	this.color = 0;
	this.prevSprite = -1;
	this.activeSprite = -1;
	//this.isready = false;
	this.drawn = false;
	//this.update = false;
	this.redraw = true;
	this.visible = true;
	this.pendingRemoval = false;
	this.activeSpriteRemoval = false;
	this.stats = Helper.buildStats(id);

	this.origin = new Vector2d(0,0);		// actor origin is bottom center
	this.pos = new Vector2d(0,0);
	this.target_pos = new Vector2d(0,0);
	this.offset = new Vector2d(0,0);
	this.spriteDim = new Vector2d(0,0);
	this.posMode = 'auto';

	this.effects = 'done';
	this.prevFx = '';
	this.fxparam = '';
	this.alpha = 0;
	this.target_alpha = 0;
	this.rotation = 0;
	this.accum_rotation = 0;
	this.orientation = 0;
	this.scale = 1;
	this.size = 1;
	//this.transTime = 1;
	this.wait = true;

	this.id = id;
	this.z_order = order;
	var canvas = document.createElement('canvas');
	canvas.id = escape(id);
	this.context = canvas.getContext('2d');
	this.transTime = (Config.transTime > 0) ? Config.transTime : 0.1;
	this.isready = true;
	this.update = false;
	this.Reset(true);
	canvas = null;
	//return this.context.canvas.id;
}
//Character.prototype.AddSprite = function(tag, file, valign) {
Character.prototype.AddSprite = function(spriteArray) {
	var that = this;
	var idx = -1;
	var tag = spriteArray[0];
	var file = spriteArray[1];
	var valign = 'floor';
	var frames = 1;
	var fps = 0;
	var reps = -1;
	
	if (this.sprites.length > 1) {
		for (var i in this.sprites) {
			if (this.sprites[i].id == tag) {
				if (this.sprites[i].src.src.search(file) != -1) {
					// this is same sprite, set to active and update alignment
					this.isready = true;
					this.update = false;
					this.activeSprite = i;
					
					if (spriteArray[2]) {
						if (typeof spriteArray[2] == 'string') {
							this.sprites[this.activeSprite].align = spriteArray[2];
							if (spriteArray[3] != null) this.sprites[this.activeSprite].frames = spriteArray[3];
							if (spriteArray[4] != null) this.sprites[this.activeSprite].fps = spriteArray[4];
							if (spriteArray[5] != null) this.sprites[this.activeSprite].reps = spriteArray[5];
						}
						else {
							this.sprites[this.activeSprite].frames = spriteArray[2];
							if (spriteArray[3] != null) this.sprites[this.activeSprite].fps = spriteArray[3];
							if (spriteArray[4] != null) this.sprites[this.activeSprite].reps = spriteArray[4];
						}
					}
					if (this.sprites[this.activeSprite].align == 'roof')
						this.offset.vy = -Stage.canvas.height*(2*Config.actorYPosition-1) + this.sprites[this.activeSprite].src.height;
					else if (this.sprites[this.activeSprite].align == 'top')
						this.offset.vy = -Stage.canvas.height*(Config.actorYPosition) + this.sprites[this.activeSprite].src.height;
					else if (this.sprites[this.activeSprite].align == 'center')
						this.offset.vy = -Stage.canvas.height*(Config.actorYPosition-0.5) + this.sprites[this.activeSprite].src.height*0.5;
					else if (this.sprites[this.activeSprite].align == 'bottom')
						this.offset.vy = -Stage.canvas.height*(Config.actorYPosition-1);
					else
						this.offset.vy = 0;
					// update sprite dimensions here
					this.spriteDim = new Vector2d(this.sprites[this.activeSprite].src.width / this.sprites[this.activeSprite].frames, 
												 this.sprites[this.activeSprite].src.height);
					var dim = Math.ceil(this.spriteDim.length());
					this.context.canvas.setAttribute('width', dim);
					this.context.canvas.setAttribute('height', dim);
					this.origin = new Vector2d(dim/2, dim/2 + this.spriteDim.vy/2);
					// set timer to false to trigger animation
					if (this.sprites[this.activeSprite].fps > 0) { 
						this.sprites[this.activeSprite].curRep = 0;
						this.sprites[this.activeSprite].spTimerOn = false;
					}
					return;
				}
				else {
					// this is same tag but different sprite
					idx = i;
					break;
				}
			}
		}
	}
	this.isready = false;
	if (spriteArray[2]) {
		if (typeof spriteArray[2] == 'string') {
			valign = spriteArray[2];
			frames = (spriteArray[3] != null) ? spriteArray[3] : 1;
			fps = (spriteArray[4] != null) ? spriteArray[4] : 0;
			reps = (spriteArray[5] != null) ? spriteArray[5] : -1;
		}
		else {	// it's a number, set is as frames
			frames = (spriteArray[2] != null) ? spriteArray[2] : 1;
			fps = (spriteArray[3] != null) ? spriteArray[3] : 0;
			reps = (spriteArray[4] != null) ? spriteArray[4] : -1;
		}
	}

	if (idx == -1) {
		var image = new Image();
		var newSprite = {id:tag, src:image, align:valign,
						 frames:frames, fps:fps, reps:reps, 
						 spTimer:0, spTimerOn:false, curFrame:0, curRep:0};
		this.sprites.push(newSprite);
		image = null;
	} 
	else {
		var tmpSprite = this.sprites[i];
		this.sprites.splice(i, 1)
		tmpSprite.src = new Image();
		tmpSprite.align = valign;
		tmpSprite.frames = frames; 
		tmpSprite.fps = fps; 
		tmpSprite.reps = reps;
		this.sprites.push(tmpSprite);
		tmpSprite.src = null; tmpSprite = null;
	}
	Helper.addEvent(this.sprites[this.sprites.length-1].src, 'load', function() {
		// use larger canvas to support sprite rotation
		that.spriteDim = new Vector2d(that.sprites[that.sprites.length-1].src.width / that.sprites[that.sprites.length-1].frames, 
							 that.sprites[that.sprites.length-1].src.height);
		var dim = Math.ceil(that.spriteDim.length());
		that.context.canvas.setAttribute('width', dim);
		that.context.canvas.setAttribute('height', dim);
		that.origin = new Vector2d(dim/2, dim/2 + that.spriteDim.vy/2);
		if (that.sprites[that.sprites.length-1].align == 'roof')
			that.offset.vy = -Stage.canvas.height*(2*Config.actorYPosition-1) + that.sprites[that.sprites.length-1].src.height;
		else if (that.sprites[that.sprites.length-1].align == 'top')
			that.offset.vy = -Stage.canvas.height*(Config.actorYPosition) + that.sprites[that.sprites.length-1].src.height;
		else if (that.sprites[that.sprites.length-1].align == 'center')
			that.offset.vy = -Stage.canvas.height*(Config.actorYPosition-0.5) + that.sprites[that.sprites.length-1].src.height*0.5;
		else if (that.sprites[that.sprites.length-1].align == 'bottom')
			that.offset.vy = -Stage.canvas.height*(Config.actorYPosition-1);
		else
			that.offset.vy = 0;
		that.isready = true;
	}, false);
	this.sprites[this.sprites.length-1].src.src = Helper.parseArg(file);
	this.activeSprite = this.sprites.length-1;
	this.update = false;
}

Character.prototype.RemoveSprite = function(tag) {
	if (this.sprites.length > 1) {
		for (var i in this.sprites) {
			if (this.sprites[i].id == tag) {
				// if i > activeSprite, just remove
				// if i < activeSprite, remove then set activeSprite+1
				// if i == activeSprite, wait until hidden
				if (i > this.activeSprite) {
					this.sprites[i].src = null;
					this.sprites.splice(i, 1);
				}
				else if (i < this.activeSprite) {
					this.sprites[i].src = null;
					this.sprites.splice(i, 1);
					this.activeSprite = Math.max(this.activeSprite-1, 0);
				}
				else {
					this.activeSpriteRemoval = true;
				}
				break;
			}
		}
	}
}
Character.prototype.AddAvatar = function(file) {
	var that = this;
	if (file != '') {
		this.isready = false;
		this.avatar = new Image();
		Helper.addEvent(this.avatar, 'load', function() {
			that.isready = true;
		}, false);
		this.avatar.src = Helper.parseArg(file);
		this.update = false;
	}
	else {
		this.avatar = null;
	}
}
Character.prototype.Reset = function (init) {
	if (init || !this.visible) {
		this.target_pos = new Vector2d(Stage.canvas.width/2, 
							Stage.canvas.height*Config.actorYPosition);
		this.pos.copy(this.target_pos);
	}
	this.visible = true;
	this.redraw = true;
}
Character.prototype.Update = function(elapsed) {
	var that = this;
	if (this.isready) {
		Helper.processEffects(this, elapsed);
		if ((!this.sprites[this.activeSprite].spTimerOn) && (this.sprites[this.activeSprite].fps>0)) {
			this.sprites[this.activeSprite].spTimer = setTimeout(function() {
				that.sprites[that.activeSprite].curFrame = (++that.sprites[that.activeSprite].curFrame) % that.sprites[that.activeSprite].frames;
				if (that.sprites[that.activeSprite].curFrame == 0) that.sprites[that.activeSprite].curRep++;
				that.redraw = true;
				if (that.visible) {
					if ((that.sprites[that.activeSprite].reps < 0) || (that.sprites[that.activeSprite].curRep < that.sprites[that.activeSprite].reps))
						that.sprites[that.activeSprite].spTimerOn = false;
				}
			}, 1000/this.sprites[this.activeSprite].fps);
			this.sprites[this.activeSprite].spTimerOn = true;
		}
	}	
	return this.update;
}
Character.prototype.Draw = function() {
	if (!this.isready) return false;
	if (!this.redraw) return false;
	if (this.activeSprite > this.sprites.length-1) return false;
	
	if (this.visible) {
		this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
		if (this.prevSprite >= 0) {
			this.context.globalAlpha = Math.max(0, Math.min(1, this.target_alpha-this.alpha));
			this.context.drawImage(this.sprites[this.prevSprite].src, 
								((this.context.canvas.width - this.spriteDim.vx)/2)>>0,
								((this.context.canvas.height - this.spriteDim.vy)/2)>>0);
			if (this.target_alpha - this.alpha <= 0) this.prevSprite = -1;
		}
		this.context.globalAlpha = Math.max(0, Math.min(1, this.alpha));
		if (this.rotation != 0) {
			this.context.translate(this.context.canvas.width/2, this.context.canvas.height/2);
			this.context.rotate(this.rotation * Math.PI/180);
			this.context.translate(-this.context.canvas.width/2, -this.context.canvas.height/2);
			this.rotation = 0.0;
		}
		if (this.sprites[this.activeSprite].fps == 0) {
			this.context.drawImage(this.sprites[this.activeSprite].src,
					   ((this.context.canvas.width - this.spriteDim.vx)/2)>>0,
					   ((this.context.canvas.height - this.spriteDim.vy)/2)>>0);
		}
		else {
			this.context.drawImage(this.sprites[this.activeSprite].src,
						this.sprites[this.activeSprite].curFrame * this.sprites[this.activeSprite].src.width / this.sprites[this.activeSprite].frames,
						0, this.sprites[this.activeSprite].src.width / this.sprites[this.activeSprite].frames, this.sprites[this.activeSprite].src.height,
					    ((this.context.canvas.width - this.spriteDim.vx)/2)>>0,
					    ((this.context.canvas.height - this.spriteDim.vy)/2)>>0,
					    this.sprites[this.activeSprite].src.width / this.sprites[this.activeSprite].frames, this.sprites[this.activeSprite].src.height);
		}
		if (this.activeSpriteRemoval && (this.alpha <= 0)) {
			this.sprites[this.activeSprite].src = null;
			this.sprites.splice(this.activeSprite, 1);
			this.activeSprite = Math.max(this.activeSprite-1, 0);
			this.activeSpriteRemoval = false;
		}
	}
	this.redraw = false;
	if (this.drawn) this.update = true;
	return true;
}
///////////////////////////////////////////////////////////////////////////////
// Atmosphere special effects plug-ins
///////////////////////////////////////////////////////////////////////////////
var AtmoEffects = {
	rain: {
		_init: function(obj, param) {
			obj.alpha = 0.5;
			obj.numParticles = (typeof param.rain == 'number') ? param.rain : 0;
			obj.direction = (param.direction != null) ? param.direction%360 : 90;
			obj.particles = new Array(obj.numParticles);
			for (var i=0; i<obj.numParticles; i++) {
				obj.particles[i] = new Particle();
				obj.particles[i].Create(obj.context.canvas,obj.direction,1,1);
			}
			obj.visible = true;
			// saves
			// numParticles is saved in param.rain
			obj.saveparam.direction = obj.direction;
		},
		_update: function(obj, elapsed) {
			var running_draw = false;
			for (var i=0; i<obj.numParticles; i++) {
				var ret = obj.particles[i].Update(elapsed, (obj.action=='start')?true:false);
				if (ret) running_draw = true;
			}
			obj.redraw = running_draw;
			if (!obj.redraw && (obj.numParticles>0)) {
				// free some memory by clearing particles, we'll add later if needed again
				obj.particles.splice(0, obj.numParticles);
				obj.numParticles = 0;
				obj.visible = false;
			}
			//else if (!obj.redraw && (obj.numParticles<=0)) {
			//	obj.update = true;
			//}
		},
		_draw: function(obj) {
			obj.context.lineWidth = "1";
			obj.context.strokeStyle = "rgb(255, 255, 255)";
			obj.context.beginPath();
			for (var i=0; i<obj.numParticles; i++) {
				obj.context.moveTo(obj.particles[i].pos.vx, obj.particles[i].pos.vy);
				obj.context.lineTo(obj.particles[i].pos.vx - obj.particles[i].size.vx, 
									obj.particles[i].pos.vy - obj.particles[i].size.vy);
			}
			obj.context.closePath();
			// do a per frame stroke or fill, instead of per particle
			obj.context.stroke();
		}
	},
	snow: {
		_init: function(obj, param) {
			obj.alpha = 0.5;
			obj.numParticles = (typeof param.snow == 'number') ? param.snow : 0;
			obj.direction = (param.direction != null) ? param.direction%360 : 90;
			obj.particles = new Array(obj.numParticles);
			for (var i=0; i<obj.numParticles; i++) {
				obj.particles[i] = new Particle();
				obj.particles[i].Create(obj.context.canvas,obj.direction,0.25,0.25);
			}
			obj.visible = true;
			// saves
			// numParticles is saved in param.snow
			obj.saveparam.direction = obj.direction;
		},
		_update: function(obj, elapsed) {
			var running_draw = false;
			for (var i=0; i<obj.numParticles; i++) {
				var ret = obj.particles[i].Update(elapsed, (obj.action=='start')?true:false);
				if (ret) running_draw = true;
			}
			obj.redraw = running_draw;
			if (!obj.redraw && (obj.numParticles>0)) {
				// free some memory by clearing particles, we'll add later if needed again
				obj.particles.splice(0, obj.numParticles);
				obj.numParticles = 0;
				obj.visible = false;
			}
			//else if (!obj.redraw && (obj.numParticles<=0)) {
			//	obj.update = true;
			//}
		},
		_draw: function(obj) {
			obj.context.lineWidth = "1";
			obj.context.strokeStyle = "rgb(255, 255, 255)";
			obj.context.fillStyle = 'white';
			obj.context.beginPath();
			for (var i=0; i<obj.numParticles; i++) {
				obj.context.moveTo(obj.particles[i].pos.vx, obj.particles[i].pos.vy);
				obj.context.arc(obj.particles[i].pos.vx, obj.particles[i].pos.vy, 
								obj.particles[i].size.vy, 0, 2*Math.PI);
			}
			obj.context.closePath();
			// do a per frame stroke or fill, instead of per particle
			obj.context.fill();
		}
	},
	cloud: {
		_init: function(obj, param) {
			if (param.cloud.search(/(start|stop)/g) == -1)
				obj.src = param.cloud;
			obj.isready = false;
			obj.alpha = 0;
			obj.image = new Image();
			Helper.addEvent(obj.image, 'load', function() {
				obj.isready = true;
				obj.visible = true;
			}, false);
			obj.image.src = obj.src;
			obj.direction = null;
			obj.pos = new Vector2d(0,0);
			if (param.direction != null) {
				obj.direction = param.direction % 360;
				obj.dirVector = new Vector2d(1,0);
				obj.dirVector.rotate(obj.direction * Math.PI/180);
			}
			// saves
			obj.saveparam.cloud = obj.src;
			obj.saveparam.direction = obj.direction;
		},
		_update: function(obj, elapsed) {
			if (obj.action == 'stop') {
				if (obj.alpha > 0) {
					obj.alpha -= elapsed/(Config.transTime * 1000)
					obj.redraw = true;
				}
				else {
					obj.image = null;
					obj.visible = false;
				}
			}
			else {
				if (obj.alpha < 1) {
					obj.alpha += elapsed/(Config.transTime * 1000);
					obj.redraw = true;
				}
				// scroll it here
				if (obj.direction != null) {
					var vel = new Vector2d(obj.dirVector.vx,obj.dirVector.vy);
					vel.scale(elapsed/(Config.transTime * 32));
					obj.pos.add(vel);
					if (obj.pos.vx < -obj.image.width) obj.pos.vx = 0;
					if (obj.pos.vx > 0) obj.pos.vx = -obj.image.width;
					if (obj.pos.vy < -obj.image.height) obj.pos.vy = 0;
					if (obj.pos.vy > 0) obj.pos.vy = -obj.image.height;
					obj.redraw = true;
				}
				else {
					obj.pos = new Vector2d(0,0);
				}
			}
		},
		_draw: function(obj) {
			var x = obj.pos.vx;
			var y = obj.pos.vy;
			while (x < obj.context.canvas.width) {
				while (y < obj.context.canvas.height) {
					obj.context.drawImage(obj.image, x, y);
					y += obj.image.height;
				}
				y = obj.pos.vy;
				x += obj.image.width;
			}
		}
	},
	beam: {
		_init: function(obj, param) {
			obj.pos = new Vector2d(0,0);
			obj.radius = (typeof param.beam == 'number') ? param.beam : 0;
			obj.mask = (param.mask) ? param.mask : 'black';
			obj.alpha = 0;
			obj.visible = true;
			// saves
			// radius is saved in param.beam
			obj.saveparam.mask = obj.mask;
		},
		_update: function(obj, elapsed) {
			if (obj.action == 'stop') {
				if (obj.alpha > 0) {
					obj.alpha -= elapsed/(Config.transTime * 1000)
					obj.redraw = true;
				}
				else {
					obj.visible = false;
				}
			}
			else {
				if (obj.alpha < 1) {
					obj.alpha += elapsed/(Config.transTime * 1000);
					obj.redraw = true;
				}
				if (!obj.pos.equal(Stage.coord)) {
					obj.pos.copy(Stage.coord);
					obj.redraw = true;
				}
			}
		},
		_draw: function(obj) {
			obj.context.fillStyle = obj.mask;
			obj.context.fillRect(0, 0, obj.context.canvas.width, obj.context.canvas.height);
			obj.context.save();
			obj.context.globalCompositeOperation = "destination-out";
			var grd = obj.context.createRadialGradient(Stage.coord.vx, Stage.coord.vy, 0,
														Stage.coord.vx, Stage.coord.vy, obj.radius);
			grd.addColorStop(0, 'rgba(0,0,0,1)');
			grd.addColorStop(0.6, 'rgba(0,0,0,0.8)');
			grd.addColorStop(1, 'rgba(0,0,0,0)');
			obj.context.fillStyle = grd;
			obj.context.beginPath();
			obj.context.arc(Stage.coord.vx, Stage.coord.vy, obj.radius, 0, 2*Math.PI);
			obj.context.closePath();
			obj.context.fill();
			obj.context.restore();
		}
	},
	minimap: {
		_init: function(obj, param) {
			if (param.minimap.search(/(start|stop)/g) == -1) {
				obj.src = param.minimap;
				obj.size = param.size;
				obj.pos = new Vector2d(param.offset[0], param.offset[1]);
				obj.alpha = 0;
			}
			obj.isready = false;
			obj.image = new Image();
			Helper.addEvent(obj.image, 'load', function() {
				obj.isready = true;
				obj.visible = true;
				obj.dimx = obj.image.width/obj.size[0];
				obj.dimy = obj.image.height/obj.size[1];
			}, false);
			obj.image.src = obj.src;
			// saves
			obj.saveparam.minimap = obj.src;
			// size saved in param
		},
		_update: function(obj, elapsed) {
			if (obj.action == 'stop') {
				if (obj.alpha > 0) {
					obj.alpha -= elapsed/(Config.transTime * 1000)
					obj.redraw = true;
				}
				else {
					obj.image = null;
					obj.visible = false;
				}
			}
			else {
				if (obj.alpha < 0.6) {
					obj.alpha += elapsed/(Config.transTime * 1000);
					obj.alpha = Math.min(0.6, obj.alpha);
					obj.redraw = true;
				}
			}
		},
		_draw: function(obj) {
			// draw map cover or image
			obj.context.save();
			obj.context.fillStyle = Config.activeTheme.automapMask;
			var val = Stage.variables["_nav_automap"].Value();
			for (var i=0; i<obj.size[0]; i++) {
				for (var j=0; j<obj.size[1]; j++) {
					if (!val[i][j])
						obj.context.fillRect(i*obj.dimx+obj.pos.vx, j*obj.dimy+obj.pos.vy, obj.dimx, obj.dimy);
					else
						obj.context.drawImage(obj.image, i*obj.dimx, j*obj.dimy, obj.dimx, obj.dimy,
											  i*obj.dimx+obj.pos.vx, j*obj.dimy+obj.pos.vy, obj.dimx, obj.dimy)
				}
			}
			obj.context.restore();
			if (Helper.findVar("_nav_pos") != null) {
				obj.context.save();
				var subs = Config.activeTheme.automapPointer.split(' ');
				obj.context.fillStyle = subs[0];
				obj.context.strokeStyle = subs[1];
				val = Stage.variables["_nav_pos"].Value();
				Helper.createPointer(obj.context, val[0]*obj.dimx+obj.pos.vx, val[1]*obj.dimy+obj.pos.vy, 
										obj.dimx, obj.dimy, Stage.variables["_nav_dir"].Value());
				obj.context.fill();
				obj.context.stroke();
				obj.context.restore();
			}
		}
	}
};
function Atmosphere(id) {
	this.alpha = 0;
	//this.isready = false;
	this.redraw = true;
	//this.update = false;
	//this.context = 0;
	this.type = '';
	this.visible = true;
	this.action = 'start';
	this.saveparam = {};

	var canvas = document.createElement('canvas');
	canvas.id = escape(id);
	this.context = canvas.getContext('2d');
	this.context.canvas.setAttribute('width', Stage.canvas.width);
	this.context.canvas.setAttribute('height', Stage.canvas.height);
	this.isready = true;
	this.update = false;
	canvas = null;
	//return this.context.canvas.id;
}
Atmosphere.prototype.Init = function(type, param) { 
	this.type = type;
	this.saveparam = param;
	AtmoEffects[this.type]['_init'](this, param);
}
Atmosphere.prototype.Update = function(elapsed) {
	if (this.isready) {
		AtmoEffects[this.type]['_update'](this, elapsed);
	}
	return this.update;
}
Atmosphere.prototype.Draw = function() {
	if (!this.isready) return false;
	if (!this.redraw) return false;
	if (this.visible) {
		this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
		this.context.globalAlpha = Math.max(0, Math.min(1, this.alpha));
		AtmoEffects[this.type]['_draw'](this);
	}	
	this.redraw = false;
	this.update = true;
	return true;
}
function Particle() {
	this.pos = new Vector2d(0,0);
	this.vel = new Vector2d(0,0);
	this.size = new Vector2d(0,0);
	this.viewh = 0;
	this.vieww = 0;
	this.dir = 0;
}
Particle.prototype.Create = function(canvas, angle, vbase, sbase) {
	this.vieww = canvas.width;
	this.viewh = canvas.height;
	this.dir = (90-angle)*Math.PI/180;

	// fix the size and velocity upon creation
	// to speed up reset and update
	this.vel.vy = Math.random() * 40 * vbase + 10;
	this.vel.vx = this.vel.vy * Math.tan(this.dir);
	this.size.copy(this.vel);
	this.vel.scale(2);
	this.size.scale(sbase);
	this.Reset();
}
Particle.prototype.Reset = function() {
	// randomize position only
	this.pos.vx = this.vieww * (2*Math.random() - 0.5);
	this.pos.vy = this.viewh * (-1*Math.random());
}
Particle.prototype.Update = function(elapsed, reset) {
	this.pos.add(this.vel);
	if (this.pos.vy > this.viewh + 50) {
		if (reset) 
			this.Reset();
		else 
			return false;
	}
	return true;
}
//Particle.prototype.Pos = function() { return this.pos; };
//Particle.prototype.Size = function() { return this.size; };
///////////////////////////////////////////////////////////////////////////////
// Main Stage
///////////////////////////////////////////////////////////////////////////////
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
	coord: new Vector2d(0,0),
	click: new Vector2d(0,0),
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
	targetPos: new Vector2d(0,0),
	prevPos: new Vector2d(0,0),
	camTime: 0,
	/* temporary data */
	transTime: 0,
	spritePos: new Array(8),
	shake: 0,
	fall:0,
	stageIdle: 0,
	lookAheadFrame: 0,
	skipTextUpdated: 0,
	/* 	Normally shouldn't need more than 5 layers,
		the higher the layer, the higher Z order
			- background = 0: backdrop layer
			- foreground = 1: actors in foreground (optionally more than one layer)
			- closeup	 = 2: actors in closeup, overlay image
			- atmosphere = 3: atmospheric effects, e.g. lightning flash, dim/brighten, smoke, rain, etc.
			- interface  = 4: script box, buttons, ads
	*/
	layers: new Array(5),
	/*	User variables that the script can set/get
		useful for checking conditions, etc.
	*/
	variables: {},
	/*	Sounds to play, 3+1 types of sound
			- bgm = 0: background music
			- bgs = 1: background sound
			- se  = 2: sound effects
			- voice = 3: dialog vocals
	*/
	sounds: new Array(4),	
	/*	Custom defined animations
			- reusable for actor, scenes and overlays
	*/
	animations: new Array(),
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
	
	Init: function(id, width, height) {
		// DEBUG: for FPS monitoring
		this.fps = 0;
		this.prevtime = new Date().getTime();
		this.curtime = this.prevtime;
		this.framecount = 0;
		
		this.canvasid = id;
		this.canvas = document.getElementById(id);
		this.context = this.canvas.getContext('2d');
		this.canvas.setAttribute('width', width);
		this.canvas.setAttribute('height', height);
		this.coord = new Vector2d(width/2, height/2);
		// for camera integrator
		this.targetPos.copy(this.coord);
		this.prevPos.copy(this.coord);
		// idle detection
		this.stageIdle = false;
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
			//Stage.HandleEvents(e);
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
		// create an auto-position lookup table, up to 8 simultaneous characters
		// which is more than enough, else stage will look crowded
		for (var j=0; j<8; j++) {
			var table = new Array();
			for (var i=1; i<j+2; i++) {
				if (i%2 == 0) // even
					table.push((Stage.canvas.width*(j+2-i/2)/(j+2))>>0);
				else // odd
					table.push((Stage.canvas.width*(((i/2)>>0)+1)/(j+2))>>0);
			}
			this.spritePos[j] = table;
			table = null;
		}
		// auto create script box as first element in layers[4]
		var sb = new ScriptBox();
		sb.Create(width, height);
		this.layers[4].push(sb);
		Helper.configUpdate("activeTheme");
		sb = null;
		// create the sounds playlist
		this.sounds[0] = new Array();
		this.sounds[1] = new Array();
		this.sounds[2] = new Array();
		this.sounds[3] = new Array();
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
		for (var i in this.layers[4]) {
			if (this.layers[4][i].inputFocus) 
				this.inputFocus = false;
		}
		// handle user inputs
		this.camTime += elapsed;
		if (this.camTime > 40) {
			this.coord = this.GetCameraPosition(elapsed, this.inputFocus);
			this.camTime -= 40;		// about 25fps
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
		//if (this.update && !this.pause) {
		if (this.update) {
			if (!(this.pause &&	!Helper.skipReadText()))
				this.script.Update()
		}
		// play sounds if any
		for (var idx in this.sounds) {
			for (var entry in this.sounds[idx]) {
				if (this.sounds[idx][entry].isStopping)
					this.sounds[idx][entry].Stop(false);
				else
					this.sounds[idx][entry].Play(true);
			}
		}
		// play videos if any
		for (var idx in this.videos) {
			if ((this.videos[idx].isStopping) ||
				(this.mouseClick && Config.movieOnCanvas)){
				this.videos[idx].Stop();
				this.videos.pop();
			}
			else
				this.videos[idx].Play();
		}
		// update layers
		var running_update = true;
		for (var idx in this.layers) {
			for (var entry in this.layers[idx]) {
				if (!this.layers[idx][entry].Update(elapsed)) {
					running_update = false;
				}
			}
		}
		this.update = running_update;
		// update stage transition time
		if (/*(this.update) &&*/ (this.transTime > 0)) {
			this.transTime = Math.max(0, this.transTime - elapsed/1000);
			if (this.transTime <=0) {
				this.shake = 0;
				this.fall = 0;
			}
		}
		// reset clicked, assumed processing done
		this.mouseClick = false;
		this.mouseMove = false;
		this.touchStart = false;
		this.touchEnd = false;
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
		for (var i in this.layers[0]) {
			if (this.layers[0][i].Draw()) running_draw = true;
			if (this.redraw) {
				if (Helper.drawElements(this.layers[0][i], 0)) 
					running_draw = true;
			}
		}
		// draw foreground here
		if (this.layers[1].length > 0) {
			// get number of visible && auto-position actors
			var count = 0;
			for (var i in this.layers[1]) {
				if ((this.layers[1][i].visible) && (this.layers[1][i].posMode == 'auto')) count++;
			}						
			// display actors
			var j=0;
			for (var i in this.layers[1]) {
				if (this.layers[1][i].Draw()) running_draw = true;
				if (this.redraw) {
					if (this.layers[1][i].visible) {
						if (this.layers[1][i].posMode == 'auto') {
							this.layers[1][i].target_pos.vx = this.spritePos[count-1][j++];
							Helper.interpolatePosition(this.layers[1][i]);
						}
						if (Helper.drawElements(this.layers[1][i],10 + this.layers[1][i].z_order))
							running_draw = true;
					}
					else if (this.layers[1][i].pendingRemoval) {
						// free up sprites and avatar
						for (var j in this.layers[1][i].sprites)
							this.layers[1][i].sprites[j].src = null;
						this.layers[1][i].avatar = null;
						this.layers[1].splice(i, 1);
					}
				}
			}
		}		
		// draw overlay/closeup here
		for (var i in this.layers[2]) {
			if (this.layers[2][i].Draw()) running_draw = true;
			if (this.redraw && this.layers[2][i].visible) {
				if (this.layers[2][i].scroll) {
					this.context.save();
					this.context.translate((-this.layers[2][i].scale*(this.layers[2][i].context.canvas.width-this.layers[2][i].backdropDim.vx)/2 
											-(this.layers[2][i].scale*this.layers[2][i].backdropDim.vx-this.canvas.width)*(this.coord.vx/this.canvas.width))>>0,
										   (-this.layers[2][i].scale*(this.layers[2][i].context.canvas.height-this.layers[2][i].backdropDim.vy)/2
											-(this.layers[2][i].scale*this.layers[2][i].backdropDim.vy-this.canvas.height)*(this.coord.vy/this.canvas.height))>>0);
					this.context.scale(this.layers[2][i].scale, this.layers[2][i].scale);
					this.context.drawImage(this.layers[2][i].context.canvas, 0, 0,
											this.layers[2][i].context.canvas.width,
											this.layers[2][i].context.canvas.height);
					this.context.restore();
				}
				else {
					if (Helper.drawElements(this.layers[2][i], 20)) 
						running_draw = true;
				}
			}
		}
		// draw atmosphere effects here
		for (var i in this.layers[3]) {
			if (this.layers[3][i].Draw()) running_draw = true;
			if (this.redraw && this.layers[3][i].visible) {
				this.context.drawImage(this.layers[3][i].context.canvas, 0, 0);
			}
		}		
		// draw gui here
		if (this.layers[4].length > 0) {
			for (var i in this.layers[4]) {
				if (this.layers[4][i].Draw()) running_draw = true;
				if (this.redraw && this.layers[4][i].visible) {
					this.context.drawImage(this.layers[4][i].context.canvas, 
										   this.layers[4][i].origin.vx>>0, 
										   this.layers[4][i].origin.vy>>0);
				}
			}
			// draw tooltips if any
			for (var i in this.layers[4]) {
				if (this.redraw && this.layers[4][i].visible) {
					if (!Helper.checkMapAccess(this.layers[4][i].group, this.layers[4][i].id))
						continue;
					if ((this.layers[4][i].state == 'hover') && (this.layers[4][i].tooltip)){
						if (this.transTime <= 0)
							Helper.showTooltip(this.layers[4][i].tooltip);
					}
				}
			}
		}
		// draw videos here
		if (Config.movieOnCanvas) {
			for (var i in this.videos) {
				this.context.drawImage(this.videos[i].movie,
									   this.videos[i].pos.vx,
									   this.videos[i].pos.vy,
									   this.videos[i].movie.width, 
									   this.videos[i].movie.height);
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
			this.click.copy(this.coord);	// used only for debug
			this.mouseClick = true;
			this.mouseUp = false;
			this.touchEnd = false;
			this.touchStart = false;
		}
		else if (this.mouseDown || this.touchStart) {
			for (var i in Stage.layers[4]) {
				//if (Stage.layers[4][i].type == "button") {
				if ((Stage.layers[4][i].link != undefined) && (Stage.layers[4][i].link != null)) {
					if (Stage.layers[4][i].context.isPointInPath(this.targetPos.vx, this.targetPos.vy))
						Stage.layers[4][i].state = 'clicked';
					else
						Stage.layers[4][i].state = '';
				}
			}
		}
		else if (this.mouseMove) {
			for (var i in Stage.layers[4]) {
				//if (Stage.layers[4][i].type == "button") {
				if ((Stage.layers[4][i].link != undefined) && (Stage.layers[4][i].link != null)) {
					if (Stage.layers[4][i].context.isPointInPath(this.targetPos.vx, this.targetPos.vy))
						Stage.layers[4][i].state = 'hover';
					else
						Stage.layers[4][i].state = '';
				}
			}
		}
	},
	AddDepth: function(order, dist) {
		if (!Config.actorPerspective) return 0;
		if (order >= 2) return 0;
		// process only background and foreground layers
		return ((order+1) * 0.1 * dist);
	},
	GetMousePosition: function(obj, event) {
		var pos = new Vector2d(event.pageX, event.pageY);
		pos.vx -= obj.offsetLeft;
		pos.vy -= obj.offsetTop;
		pos.vx = Math.max(0, Math.min(obj.width, pos.vx));
		pos.vy = Math.max(0, Math.min(obj.height, pos.vy));
		try { return pos; }
		finally { pos = null; }
	},
	GetTouchPosition: function(obj, event) {
		var pos = new Vector2d(0,0);
		if (event.targetTouches != null) {
			pos.vx = event.targetTouches[0].pageX - obj.offsetLeft;
			pos.vy = event.targetTouches[0].pageY - obj.offsetTop;
		}
		else {
			pos.vx = event.touches[0].pageX - obj.offsetLeft;
			pos.vy = event.touches[0].pageY - obj.offsetTop;
		}
		pos.vx = Math.max(0, Math.min(obj.width, pos.vx));
		pos.vy = Math.max(0, Math.min(obj.height, pos.vy));
		try { return pos; }
		finally { pos = null; }
	},
	GetCameraPosition: function(elapsed, spring) {
		if (spring) {
			var camPos = new Vector2d(this.coord.vx, this.coord.vy);
			camPos.sub(this.targetPos);
			if (camPos.length() < 0.1) {
				this.prevPos.copy(this.targetPos);
				return this.targetPos;
			}
			camPos.copy(this.targetPos);
			camPos.add(this.coord);
			camPos.scale(0.5);
			this.prevPos.copy(this.coord);		
			try { return camPos; }
			finally { camPos = null; }
		}	
		else {
			this.prevPos.copy(this.targetPos);
			return this.targetPos;	
		}
	},
	CheckCamera: function() {
		var vec = new Vector2d(this.coord.vx, this.coord.vy);
		vec.sub(this.targetPos);
		if (vec.length() > 0.1) return true;
		return false;
	},
	Transition: function(time) {
		this.transTime = Math.max((time != null) ? time : Config.transTime, 0.1);
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
		now = null;
		
		if (window.jQuery) {
			// DEBUG:
			//$('#debug').html(Stage.coord.vx +', '+ Stage.coord.vy);
			//$('#debug').html(Stage.targetPos.vx +', '+ Stage.targetPos.vy);
			//$('#debug').html(eval(Stage.coord.vx - Stage.targetPos.vx) +', '+ eval(Stage.coord.vy-Stage.targetPos.vy));
			//$('#debug').html(Stage.click.vx +', '+ Stage.click.vy);
			//$('#debug').html(this.script.frame/2 + ' ' + this.update);
			//if (Helper.findVar("_nav_loc") != null)
			//	$('#debug').html(this.variables["_nav_loc"].Value()+' '+this.variables["_nav_dir"].Value());
			$('#debug').html('FPS: '+ this.fps + ' Frame: ' + this.script.frame/2 + ' Idle: ' + this.stageIdle);
		}
		// update the stage
		this.Update(elapsed);	
		// draw the stage
		this.Draw();
		// check for idle
		this.stageIdle = false;
		if (this.pause && (this.transTime <= 0) && (this.fps > 30)) {
			this.stageIdle = true;
			if (Config.gameAllowLookAhead && (this.script.frame > this.lookAheadFrame)) {
				// look for resources to preload
				for (var i=this.script.frame; i<this.script.sequence.length; i+=2) {
					if ((this.script.sequence[i] == actor) ||
						(this.script.sequence[i] == scene) ||
						(this.script.sequence[i] == overlay) ||
						(this.script.sequence[i] == audio) ||
						(this.script.sequence[i] == video)) {
						this.lookAheadFrame = i;
						setTimeout(function() {
							Helper.preloadResources(Stage.script.sequence[Stage.lookAheadFrame],
													Stage.script.sequence[Stage.lookAheadFrame+1]);
						}, 250);
						break;
					}
				}
			}
			if (this.skipTextUpdated && Helper.supportsLocalStorage() && 
			   ((Stage.script.sequence[0] == label) && (localStorage["_persist_skip_"+Stage.script.sequence[1]] != null))) {
				var skip_array = JSON.parse(localStorage["_persist_skip_"+Stage.script.sequence[1]]);
				var opt_array = [];
				for (var i=0; i<skip_array.length; i+=2) {
					if (opt_array.length == 0) {
						opt_array.push(skip_array[i]);
						opt_array.push(skip_array[i+1]);
					}
					else {
						var found = false;
						for (var j=0; j<opt_array.length; j+=2) {
							if ((skip_array[i] >= opt_array[j]) && (skip_array[i] <= opt_array[j+1]+2)) {
								if ((skip_array[i+1] > opt_array[j+1]))
									opt_array[j+1] = skip_array[i+1];
								found = true;
								break;
							}
						}
						if (!found) {
							opt_array.push(skip_array[i]);
							opt_array.push(skip_array[i+1]);
						}
					}
				}
				opt_array.sort(function(a,b){return a-b});
				localStorage["_persist_skip_"+Stage.script.sequence[1]] = JSON.stringify(opt_array);
				this.skipTextUpdated = false;
				opt_array = null; skip_array = null;
			}
		}
		// setup next timer tick
		requestAnimFrame(function(){
			Stage.Tick(interval);
		});
	}
}

// ensure config and stats is not null
var Config = {};
var Stats = {};
// finally, the script, config and plugins are loaded
for (var j in TOC) {
	Helper.includeJs(TOC[j]);
}