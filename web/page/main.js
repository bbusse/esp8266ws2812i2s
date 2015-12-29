//Copyright (C) 2015 <>< Charles Lohr, see LICENSE file for more info.
//
//This particular file may be licensed under the MIT/x11, New BSD or ColorChord Licenses.

is_leds_running = false;
pause_led = false;

function KickLEDs()
{
	$( "#LEDPauseButton" ).css( "background-color", (is_leds_running&&!pause_led)?"green":"red" );

	if( !is_leds_running && !pause_led )
		LEDDataTicker();

}

window.addEventListener("load", KickLEDs, false);

function ToggleLEDPause()
{
	pause_led = !pause_led;
	KickLEDs();
}


function GotLED(req,data)
{
	var ls = document.getElementById('LEDCanvasHolder');
	var canvas = document.getElementById('LEDCanvas');
	var ctx = canvas.getContext('2d');
	var h = ls.height;
	var w = ls.width;
	
	var zeilen=10;
	var spalten=20;
	
	if( canvas.width != ls.clientWidth-10 )   canvas.width = ls.clientWidth-10;
	if( ctx.canvas.width != canvas.clientWidth )   ctx.canvas.width = canvas.clientWidth;

	var secs = data.split( ":" );

	$( "#LEDPauseButton" ).css( "background-color", "green" );

	var samps = Number( secs[1] );
	var data = secs[2];
	var lastsamp = parseInt( data.substr(0,4),16 );
	ctx.clearRect( 0, 0, canvas.width, canvas.height );
	ctx.fillStyle = "#000000";
	ctx.lineWidth = 0;
	ctx.fillRect( 0, 0, 200, canvas.height );

	for( var i = 0; i < samps; i++ )
	{
		var x2 = i * canvas.clientWidth / samps;
		var samp = data.substr(i*6,6);
		var y2 = ( 1.-samp / 2047 ) * canvas.clientHeight;
		
		var cur_y = Math.floor(i/zeilen);
		var cur_x = 0;
		
		if (cur_y%2 == 0) {
			cur_x = i % spalten;
		} else {
			cur_x = spalten - 1 - (i % spalten);
		}

		ctx.fillStyle = "#" + samp.substr( 2, 2 ) + samp.substr( 0, 2 ) + samp.substr( 4, 2 );
		ctx.lineWidth = 0;
		ctx.fillRect( cur_x*20, cur_y*20, 19, 19 );
	}

	var samp = parseInt( data.substr(i*2,2),16 );

	LEDDataTicker();
} 

function LEDDataTicker()
{
	if( IsTabOpen('LEDs') && !pause_led )
	{
		is_leds_running = true;
		QueueOperation( "CL",  GotLED );
	}
	else
	{
		is_leds_running = 0;
	}
	$( "#LEDPauseButton" ).css( "background-color", (is_leds_running&&!pause_led)?"green":"red" );

}




