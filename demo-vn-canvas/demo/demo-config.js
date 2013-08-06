// Globals for configuration
Theme1 = {
	formFontStyle:		"bold 16px 'Courier New' #404040",
	formElementBack:	"#FFFFE0",
	formTipColor:		"#FFFFE0",
	formTipStyle:		"normal 12px sans-serif black",
	
	boxFontStyle:		"bold 16px 'Courier New' white",
	boxDimStyle:		"#000000 #808080",
	boxImageStyle:		null,
	boxTagStyle:		"bold 18px Verdana #c8ffc8",
	boxMenuHilite:		"#c08040",
	
	balloonFillStyle:	"#000000 #808080",
	balloonStrokeStyle: "#FFFFFF",
	
	automapMask:		"C0C0C0",
	automapPointer:		"#FF0000 #000000"
}

Theme2 = {
	formFontStyle:		"normal 16px Arial #404040",
	formElementBack:	"#FFFFE0",
	formTipColor:		"#FFFFE0",
	formTipStyle:		"normal 12px sans-serif red",
	
	boxFontStyle:		"bold 16px Verdana white",
	boxDimStyle:		"#800000 #808080",
	boxImageStyle:		"demo/box-image.png",
	boxTagStyle:		"bold 18px Verdana #ff8000",
	boxMenuHilite:		"#c08040",

	balloonFillStyle:	"#800000 #808080",
	balloonStrokeStyle: "#FF0000",

	automapMask:		"C0C0C0",
	automapPointer:		"#FF0000 #000000"
}

Config = {
	// Themes
	themeList:			["Simplify", Theme1, 
						 "Radical", Theme2],
	activeTheme:		Theme1,

	// Volume
	volumeAudio:		0.9,
	volumeVideo:		0.9,
	
	// Script Box
	boxWidth:			0.75,
	boxHeight:			0.25,
	boxFullHeight:		0.875,
	boxScrollSpeed:		1.0,
	balloonWidth:		0.5,
	balloonHeight:		0.2,

	// Actors
	actorShowAvatar:	true,
	actorPerspective:	true,
	actorYPosition:		1.125,

	// Audio
	audioFormat:		["mp3", "ogg"],

	// Movie
	movieSize:			0.75,
	movieOnCanvas:		true,
	movieFormat:		["mp4", "ogv"],
	
	// Transitions
	transTime:			1.0,
	
	// Gameplay
	gameMatureFilter:	true,
	gameBadWords:		["fuck", "wank", "shit", "pussy", "cunt", "dick"],
	gameAltWord:		"****",
	gameAllowMacro:		true,
	gameAllowPreload:	true,
	gameNamedCheckpts:	false,
	gameAllowLookAhead: true,
}

