demo_slide = [
	label, "demo_slide",

	scene, {src:"black"},
	/* cheat here to show first image */
	set, {pointer:1, display:"demo/bgcity01.jpg"},

	label, "showimage",
	overlay, {src:"display", effect:"dissolve nowait"},
	
	label, "start",
	cform, ["slideshow", true,
		cfelement, {type:"imageViewer", name:"Viewer", x:0, y:390, w:720, h:80, 
					frames:["demo/slideback.png",
							"demo/bgcity01.jpg",
							"demo/bgforest01.jpg",
							"demo/bgroom01.jpg",
							"demo/bgtown01.jpg",
							"demo/vina01.png",
							"demo/vina02.png",
							"demo/vina03.png",
							"demo/vina04.png",
							"demo/mom01.png",
							"demo/dad01.png"]},
		button, {name:"prev", x:318, y:435, link:[set, {pointer:"-1"}], showText:false, tip:"Back",
				 base:"demo/prev_base.png", hover:"demo/prev_hover.png", click:"demo/prev_click.png"},
		button, {name:"next", x:360, y:435, link:[set, {pointer:"+1"}], showText:false, tip:"Forward",
				 base:"demo/next_base.png", hover:"demo/next_hover.png", click:"demo/next_click.png"},
	],
	jump, "showimage",

];

CformElements.imageViewer = {
	_init: function (obj, param) {
		obj.Create(param.name, 
				   {x:param.x, y:param.y, w:param.w, h:param.h},
				   param.frames);
		obj.showText = false;
		obj.countup = 0;		//image counter, 0 is background		
	},
	_update: function (obj, elapsed) {
		// update counter depending on button pressed
		var tmp = Helper.getValue("pointer");
		if (tmp != obj.countup) {
			obj.countup = Math.max(Math.min(tmp, obj.sprites.length-1),1);
			Helper.setValue("pointer", obj.countup);
			Helper.setValue("display", obj.sprites[obj.countup].src);
			obj.redraw = true;
		}
	},
	_draw: function (obj) {
		// compute x start location, selected image is centered
		var x = Stage.canvas.width/2;
		var wid = obj.sprites[obj.countup].width * (obj.rect.h-10) / obj.sprites[obj.countup].height; 
		x -= wid/2;
		for (var i=obj.countup-1; i>=1; i--) {
			wid = obj.sprites[i].width * (obj.rect.h-10) / obj.sprites[i].height; 
			x -= wid + 5;
		}		
		// draw background & slides
		for (var i in obj.sprites) {
			if (i==0) {
				// draw background which sets the size of the slide
				obj.DrawImageOrFill(obj.sprites[i]);
			} else {
				// draw the thumbnails
				wid = obj.sprites[i].width * (obj.rect.h-10) / obj.sprites[i].height; 
				obj.context.drawImage(obj.sprites[i], x, 5, wid, obj.rect.h-10);
				// for unselected image
				if (obj.countup != i) {
					try {
						// grayscale unselected image
						// requires image in same domain as script, local run returns error
					    var imageData = obj.context.getImageData(x, 5, wid, obj.rect.h-10);
					    var data = imageData.data;
					    for (var i = 0; i < data.length; i += 4) {
					        var brightness = (0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]) *0.5;
					         data[i] = brightness; // red
					        data[i + 1] = brightness; // green
					        data[i + 2] = brightness; // blue
					        // i+3 is alpha (the fourth element)
						}
					    obj.context.putImageData(imageData, x, 5);
					} catch(e) {
						// fallback on error
						// just create a dim box over the image
						obj.context.save();
						obj.context.globalAlpha = 0.7;
						obj.context.fillStyle = "black";
						obj.context.fillRect(x, 5, wid, obj.rect.h-10);
						obj.context.restore();
					}
				}
				x += wid + 5;
			}
		}
	}
}