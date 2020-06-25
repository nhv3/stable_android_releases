var prog = {};
var developer_mode = false;
var prog_pack = [];
var program_enabled = false;


//Bit masks for LED phase modes 
var nir_mask = 0x01
var green_mask = 0x02
var gn_mask = 0x03
var red_mask = 0x04
var rn_mask = 0x05
var rg_mask = 0x06
var rgn_mask = 0x07
var phase_mode = 0x07;

prog.initialize = function()
{
	document.addEventListener(
		'deviceready',
		function() { evothings.scriptsLoaded(prog.onDeviceReady) },
		false);

	// Called when HTML page has been loaded.
	$(document).ready( function()
	{
		// Adjust canvas size when browser resizes
		$(window).resize(prog.respondCanvas);

		// Adjust the canvas size when the document has loaded.
		prog.respondCanvas();
	});


};

//Automatic window container for resizing the layout on various devices 
prog.respondCanvas = function()
{
	var canvas = $('#canvas')
	var container = $(canvas).parent()
	canvas.attr('width', $(container).width() ) // Max width

};

prog.onDeviceReady = function()
{
};

//Function to change the LED selection
prog.onLEDSelect = function(clicked_id)
{
	hyper.log(prog_pack)

	switch(clicked_id)
	{
		case "L1":
			document.getElementById(clicked_id).className  = "green"
			document.getElementById("L2").className  = "gray"
			document.getElementById("L3").className  = "gray"
			document.getElementById("L4").className  = "gray"
			document.getElementById("L5").className  = "gray"
			document.getElementById("L6").className  = "gray"
			document.getElementById("L7").className  = "gray"
			phase_mode = rgn_mask;
		break;

		case "L2":
		    document.getElementById(clicked_id).className  = "green"
			document.getElementById("L1").className  = "gray"
			document.getElementById("L3").className  = "gray"
			document.getElementById("L4").className  = "gray"
			document.getElementById("L5").className  = "gray"
			document.getElementById("L6").className  = "gray"
			document.getElementById("L7").className  = "gray"
			phase_mode = rg_mask;

		break;

		case "L3":
		    document.getElementById(clicked_id).className  = "green"
			document.getElementById("L1").className  = "gray"
			document.getElementById("L2").className  = "gray"
			document.getElementById("L4").className  = "gray"
			document.getElementById("L5").className  = "gray"
			document.getElementById("L6").className  = "gray"
			document.getElementById("L7").className  = "gray"
			phase_mode = gn_mask;
		break;

		case "L4":
			document.getElementById(clicked_id).className  = "green"
			document.getElementById("L1").className  = "gray"
			document.getElementById("L2").className  = "gray"
			document.getElementById("L3").className  = "gray"
			document.getElementById("L5").className  = "gray"
			document.getElementById("L6").className  = "gray"
			document.getElementById("L7").className  = "gray"
			phase_mode = rn_mask;

		break;

		case "L5":
			document.getElementById(clicked_id).className  = "green"
			document.getElementById("L1").className  = "gray"
			document.getElementById("L2").className  = "gray"
			document.getElementById("L3").className  = "gray"
			document.getElementById("L4").className  = "gray"
			document.getElementById("L6").className  = "gray"
			document.getElementById("L7").className  = "gray"
			phase_mode = red_mask;

		break;

		case "L6":
			document.getElementById(clicked_id).className  = "green"
			document.getElementById("L1").className  = "gray"
			document.getElementById("L2").className  = "gray"
			document.getElementById("L3").className  = "gray"
			document.getElementById("L4").className  = "gray"
			document.getElementById("L5").className  = "gray"
			document.getElementById("L7").className  = "gray"
			phase_mode = green_mask;

		break;

		case "L7":
			document.getElementById(clicked_id).className  = "green"
			document.getElementById("L2").className  = "gray"
			document.getElementById("L3").className  = "gray"
			document.getElementById("L4").className  = "gray"
			document.getElementById("L5").className  = "gray"
			document.getElementById("L6").className  = "gray"
			document.getElementById("L1").className  = "gray"
			phase_mode = nir_mask;

		break;

		default:
		break;

	}

	}

//Check the developer mode. If its OFF, then we are only using the calibration mode and on the phase type can be modified (ie. green on, red on, nir on, single and dual phase items)
//On the ble device, the AFE will be program accordingly. If the the device is programmed to dual phase, one of the leds will be used as an ambient phase for individual ambient cancellation in the calibration code. 
prog.developerCheck = function(toggle_id)
{
	if(document.getElementById(toggle_id).checked)
	{
		document.getElementById("developer_mode_text").innerHTML = 'Developer Mode ON'
		developer_mode = true;
	}
	else
	{
		document.getElementById("developer_mode_text").innerHTML = 'Developer Mode OFF'
		developer_mode = false;
	}
}

//User wants to gather all the options together 
prog.program = function()
{
	if(!(this.isConnected))
	{
		//If the developer mode is disabled, we are only allowed to send the phase scheme over to the BLE side of things. If the developer mode is enabled, then we need to send all of the configurations over.  
		if(!(this.developer_mode))
		{
			program_enabled =true; //Use a flag to let app.js know we only want to program the device and NOT stream data
			prog_pack[0] = phase_mode;
			app.onStartButton(); //We want to tell app.js that we want to connect and program the device 
		}




	}
	else
	{
		alert("Programming not allowed - device is currently connected. Please disconnect and then program device.")
	}
}

prog.initialize();