//Support JS for gathering up all of the programming options 

var prog = {};
var developer_mode = false;
var sep_gain_mode = false;
var observer_mode = false;
var prog_pack = [];
var LED_Control = [];
var time_pack = [];
var program_enabled = false;
var number_is_valid = false;
var time_length = 0;
var tia_res_char = ['500k','250k','100k','50k','25k','10k','1M','2M'];
var tia_cap_char = ['5p','2.5p','10p','7.5p', '20p','17.5p','25p','22.5p'];
var dac_char = ['0','0.47','0.93','1.4','1.87','2.33','2.8','3.27','3.73','4.2','4.67','5.13','5.6','6.07','6.53','7.0','-0.47','-0.93','-1.4','-1.87','-2.33','-2.8','-3.27','-3.73','-4.2','-4.67','-5.13','-5.6','-6.07','-6.53','-7.0'];
var led_char = ['N','G','GN','R','RN','RG','RGN'];

//Bit masks for LED phase modes 
var nir_mask = 0x01
var green_mask = 0x02
var gn_mask = 0x03
var red_mask = 0x04
var rn_mask = 0x05
var rg_mask = 0x06
var rgn_mask = 0x07
var phase_mode = 0x07; //set by default
var LED1_drive = 0x03;//set by default
var LED2_drive = 0x03;//set by default
var LED3_drive = 0x03;//set by default
var TIA_R1 = 0x02;
var TIA_C1 = 0x00;
var TIA_R2 = 0x02;
var TIA_C2 = 0x00;
var DAC1_val = 0x00;
var DAC2_val = 0x00;
var DAC3_val = 0x00;
var DACA_val = 0x00;



evothings.loadScript('libs/evothings/easyble/easyble.js');

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

prog.stepperInput = function(id, s, m) 
{

	var el = document.getElementById(id);
	if (s > 0) {
		if (parseInt(el.value) < m) {
			el.value = parseInt(el.value) + s;
		}
	} else {
		if (parseInt(el.value) > m) {
			el.value = parseInt(el.value) + s;
		}
	}
	switch(el.id)
	{
		case "stepperLED1":

		var current = Number(((el.value)*1.6).toPrecision(3));

		document.getElementById('LED1_current').textContent = 'L1 Set ->' + current + 'mA';

	  	LED1_drive = el.value; //save the current settings

	  	break;

	  	case "stepperLED2":

	  	var current = Number(((el.value)*1.6).toPrecision(3));

	  	document.getElementById('LED2_current').textContent = 'L2 Set ->' + current + 'mA';
	  	LED2_drive = el.value; //save the current settings

	  	break;

	  	case "stepperLED3":

	  	var current = Number(((el.value)*1.6).toPrecision(3));

	  	document.getElementById('LED3_current').textContent = 'L3 Set ->' + current + 'mA';
	  	LED3_drive = el.value; //save the current settings

	  	break;

	  	case "tiar1":
  		TIA_R1 = el.value; //save the current settings
  		document.getElementById('tia_gain_r1').textContent = 'R1 ->' + tia_res_char[TIA_R1];
  		break;

  		case "tiac1":
  		TIA_C1 = el.value; //save the current settings
  		document.getElementById('tia_gain_c1').textContent = 'C1 ->' + tia_cap_char[TIA_C1];
  		break;

  		case "tiar2":
  		TIA_R2 = el.value; //save the current settings
  		document.getElementById('tia_gain_r2').textContent = 'R2 ->' + tia_res_char[TIA_R2];
  		break;

  		case "tiac2":
  		TIA_C2 = el.value; //save the current settings
  		document.getElementById('tia_gain_c2').textContent = 'C2 ->' + tia_cap_char[TIA_C2];
  		break;

  		case "dac1":
  		DAC1_val = el.value;
  		document.getElementById('dac1_set').textContent = dac_char[DAC1_val]+'uA';
  		break;

  		case "dac2":
  		DAC2_val = el.value;
  		document.getElementById('dac2_set').textContent = dac_char[DAC2_val]+'uA';
  		break;

  		case "dac3":
  		DAC3_val = el.value;
  		document.getElementById('dac3_set').textContent = dac_char[DAC3_val]+'uA';
  		break;

  		case "dacamb":
  		DACA_val = el.value;
  		document.getElementById('dacamb_set').textContent = dac_char[DACA_val]+'uA';
  		break;

  		default:
  		break;
  	}
  }

//Function to change the LED selection
prog.onLEDSelect = function(clicked_id)
{

	switch(clicked_id)
	{
		case "L1":
		document.getElementById(clicked_id).style.background  =  '#54dfb3';
		document.getElementById("L2").style.background  = "#989898";
		document.getElementById("L3").style.background  = "#989898";
		document.getElementById("L4").style.background  = "#989898";
		document.getElementById("L5").style.background  = "#989898";
		document.getElementById("L6").style.background  = "#989898";
		document.getElementById("L7").style.background  = "#989898";
		phase_mode = rgn_mask;
		break;

		case "L2":
		document.getElementById(clicked_id).style.background  =  '#54dfb3';
		document.getElementById("L1").style.background  = "#989898";
		document.getElementById("L3").style.background  = "#989898";
		document.getElementById("L4").style.background  = "#989898";
		document.getElementById("L5").style.background  = "#989898";
		document.getElementById("L6").style.background  = "#989898";
		document.getElementById("L7").style.background  = "#989898";
		phase_mode = rg_mask;

		break;

		case "L3":
		document.getElementById(clicked_id).style.background  =  '#54dfb3';
		document.getElementById("L1").style.background  = "#989898";
		document.getElementById("L2").style.background  = "#989898";
		document.getElementById("L4").style.background  = "#989898";
		document.getElementById("L5").style.background  = "#989898";
		document.getElementById("L6").style.background  = "#989898";
		document.getElementById("L7").style.background  = "#989898";
		phase_mode = gn_mask;
		break;

		case "L4":
		document.getElementById(clicked_id).style.background  =  '#54dfb3';
		document.getElementById("L1").style.background  = "#989898";
		document.getElementById("L2").style.background  = "#989898";
		document.getElementById("L3").style.background  = "#989898";
		document.getElementById("L5").style.background  = "#989898";
		document.getElementById("L6").style.background  = "#989898";
		document.getElementById("L7").style.background  = "#989898";
		phase_mode = rn_mask;

		break;

		case "L5":
		document.getElementById(clicked_id).style.background  =  '#54dfb3';
		document.getElementById("L1").style.background  = "#989898";
		document.getElementById("L2").style.background  = "#989898";
		document.getElementById("L3").style.background  = "#989898";
		document.getElementById("L4").style.background  = "#989898";
		document.getElementById("L6").style.background  = "#989898";
		document.getElementById("L7").style.background  = "#989898";
		phase_mode = red_mask;

		break;

		case "L6":
		document.getElementById(clicked_id).style.background  =  '#54dfb3';
		document.getElementById("L1").style.background  = "#989898";
		document.getElementById("L2").style.background  = "#989898";
		document.getElementById("L3").style.background  = "#989898";
		document.getElementById("L4").style.background  = "#989898";
		document.getElementById("L5").style.background  = "#989898";
		document.getElementById("L7").style.background  = "#989898";
		phase_mode = green_mask;

		break;

		case "L7":
		document.getElementById(clicked_id).style.background  =  '#54dfb3';
		document.getElementById("L2").style.background  = "#989898";
		document.getElementById("L3").style.background  = "#989898";
		document.getElementById("L4").style.background  = "#989898";
		document.getElementById("L5").style.background  = "#989898";
		document.getElementById("L6").style.background  = "#989898";
		document.getElementById("L1").style.background  = "#989898";
		phase_mode = nir_mask;

		break;

		default:
		break;

	}

}

prog.valueCheck = function()
{
	var unit = document.getElementById("time_monitor_value").value;

	if(/^\d+$/.test(unit)) //Use regex magic. 
	{
		time_length = Number(unit);
		time_pack[0] = time_length & 0x00ff; //grab first byte
		time_pack[1] = (time_length & 0xff00) >> 8; //grab second byte
		number_is_valid = true;
	}

	else //if we fail, alert the user
	{
		alert("Sorry, the value entered is either NULL or not a number. Please enter a valid, positive number between the values of 10 and 65,000.")
		number_is_valid = false;
	}

}


prog.timeCheck = function(toggle_id)
{
	if(document.getElementById(toggle_id).checked)
	{

		document.getElementById("time_monitor_text").innerHTML = 'Time Monitor : ON'
		document.getElementById("time_monitor_text").style.fontWeight = "bold"
		observer_mode = true;

	}

	else
	{
		document.getElementById("time_monitor_text").innerHTML = 'Time Monitor : OFF'
		document.getElementById("time_monitor_text").style.fontWeight = "bold"
		observer_mode = false;
	}

}

//Check the developer mode. If its OFF, then we are only using the calibration mode and on the phase type can be modified (ie. green on, red on, nir on, single and dual phase items)
//On the ble device, the AFE will be program accordingly. If the the device is programmed to dual phase, one of the leds will be used as an ambient phase for individual ambient cancellation in the calibration code. 
prog.developerCheck = function(toggle_id)
{
	if(document.getElementById(toggle_id).checked)
	{
		document.getElementById("developer_mode_text").innerHTML = 'Developer Mode : ON'
		document.getElementById("developer_mode_text").style.fontWeight = "bold"
		developer_mode = true;
	}
	else
	{
		document.getElementById("developer_mode_text").innerHTML = 'Developer Mode : OFF'
		document.getElementById("developer_mode_text").style.fontWeight = "bold"
		developer_mode = false;
	}
}

//Check if the user wants to enable separate gain for the  red/nir phases
prog.sepGainCheck = function(toggle_id)
{
	if(document.getElementById(toggle_id).checked)
	{
		document.getElementById("sep_gain_mode_text").innerHTML = 'Enable Sep Gain : ON'
		document.getElementById("sep_gain_mode_text").style.fontWeight = "bold"
		sep_gain_mode = true;
	}
	else
	{
		document.getElementById("sep_gain_mode_text").innerHTML = 'Enable Sep Gain : OFF'
		document.getElementById("sep_gain_mode_text").style.fontWeight = "bold"
		sep_gain_mode = false;
	}
}

prog.gain_pack =function()
{
//If sep gain mode is enabled, we need to gather its contents for writing to TIAGAIN sector
if(sep_gain_mode)
{
				prog_pack[5] = 0x01; //Represents the separate gain 
				prog_pack[6] = TIA_R1;
				prog_pack[7] = TIA_C1;
				prog_pack[8] = TIA_R2;
				prog_pack[9] = TIA_C2;
			}

			else
			{
				prog_pack[5] = 0x00; //Represents the separate gain 
				prog_pack[6] = TIA_R1;
				prog_pack[7] = TIA_C1;
				prog_pack[8] = 0x00; //Get rid of the secondary options
				prog_pack[9] = 0x00;
			}

}

prog.dac_pack = function()
{
	if(DAC1_val <= 15)
	{
		prog_pack[10] = DAC1_val; //this means its positive 0 -> 7uA range, 0-15 val selection
		
	}
	else //then we want a negative dac offset value
	{
		var neg_val = DAC1_val - 15; //shift it back to the 0-15 range
		var shifted = 0x10 | neg_val; //Add in polarity constant
		prog_pack[10] = shifted;

	}

	if(DAC2_val <= 15)
	{
		prog_pack[11] = DAC2_val;
		
	}
	else
	{
		var neg_val = DAC2_val - 15; //shift it back to the 0-15 range
		var shifted = 0x10 | neg_val; //Add in polarity constant
		prog_pack[11] = shifted;
	}
	
	if(DAC3_val <= 15)
	{
		prog_pack[12] = DAC3_val;
	
	}
	else
	{
		var neg_val = DAC3_val - 15; //shift it back to the 0-15 range
		var shifted = 0x10 | neg_val; //Add in polarity constant
		prog_pack[12] = shifted;
	}
	
	if(DACA_val <= 15)
	{
		prog_pack[13] = DACA_val;
	
	}
	else
	{
		var neg_val = DACA_val - 15; //shift it back to the 0-15 range
		var shifted = 0x10 | neg_val; //Add in polarity constant
		prog_pack[13] = shifted;
	}
	
}

//User wants to gather all the options together 
prog.program = function()
{
	if(!isConnected)
	{
		//If the developer mode is disabled, we are only allowed to send the phase scheme over to the BLE side of things. If the developer mode is enabled, then we need to send all of the configurations over.  
		if(!developer_mode)
		{
			program_enabled =true; //Use a flag to let app.js know we only want to program the device and NOT stream data
			prog_pack[0] = 0x00; //Developer mode disabled
			prog_pack[1] = phase_mode; //Pack the phase mode in and then let the app do the calibration
			document.getElementById('start_button').click() //We want to tell app.js that we want to connect and program the device 
		}

		else if(developer_mode) //if the developer mode is enabled then it allows the user to send the all other items other than led phase selection
		{
			program_enabled =true; //Use a flag to let app.js know we only want to program the device and NOT stream data
			prog_pack[0] = 0x01; //Developer mode enabled
			prog_pack[1] = phase_mode; //Pack the phase mode in
			prog_pack[2] = LED1_drive;
			prog_pack[3] = LED2_drive;
			prog_pack[4] = LED3_drive;
			prog.gain_pack(); //pack up gain elements 
			prog.dac_pack(); //pack up offdac elements 
			document.getElementById('start_button').click()
			
		}
	}
	else
	{
		alert("Programming not allowed - device is currently connected. Please disconnect and then program device.")
	}
}

prog.update_settings_interface = function(DAC1,pol1,DAC2,pol2,DAC3,pol3,DACA,pola,LED1_cntrl,LED2_cntrl,LED3_cntrl,R_main,C_main,Enable_Sep_gain,R_aux,C_aux,current_phase)
{

	//For the DAC settings
	if((pol1 == 1) && (DAC1 !== 0))
	{

		document.getElementById('DAC1_csetting').textContent ='GREEN OFFDAC: ' + dac_char[DAC1+15]+'uA'
	}
	else
	{

		document.getElementById('DAC1_csetting').textContent ='GREEN OFFDAC: ' + dac_char[DAC1]+'uA'
	}

	if((pol2 == 1) && (DAC2 !== 0))
	{
		document.getElementById('DAC2_csetting').textContent ='RED OFFDAC: ' + dac_char[DAC2+15]+'uA'
	}
	else
	{
		document.getElementById('DAC2_csetting').textContent ='RED OFFDAC: ' + dac_char[DAC2]+'uA'
	}

	if((pol3 == 1) && (DAC3 !== 0))
	{
		document.getElementById('DAC3_csetting').textContent ='NIR OFFDAC: ' + dac_char[DAC3+15]+'uA'
	}
	else
	{
		document.getElementById('DAC3_csetting').textContent ='NIR OFFDAC: ' + dac_char[DAC3]+'uA'
	}

	if((pola == 1) && (DACA !== 0))
	{
		document.getElementById('DACA_csetting').textContent ='AMB1 OFFDAC: ' + dac_char[DACA+15]+'uA'
	}
	else
	{
		document.getElementById('DACA_csetting').textContent ='AMB1 OFFDAC: ' + dac_char[DACA]+'uA'
	}

	//Update LED brightness
	document.getElementById('LED1_csetting').textContent ='LED1 Current: ' + LED1_cntrl*1.6 +'mA'
	document.getElementById('LED2_csetting').textContent ='LED2 Current: ' + LED2_cntrl*1.6 +'mA'
	document.getElementById('LED3_csetting').textContent ='LED3 Current: ' + LED3_cntrl*1.6 +'mA'

	//Update Main TIA 
	document.getElementById('TIAMAINR1_csetting').textContent ='TIA MAIN R1: ' + tia_res_char[R_main]
	document.getElementById('TIAMAINC1_csetting').textContent ='TIA MAIN C1: ' + tia_cap_char[C_main]

	//Update sep TIA 
	if(Enable_Sep_gain == 1)
	{
		document.getElementById('ENSEP_csetting').textContent ='SEP GAIN ENABLED?: YES'
	}
	else
	{
		document.getElementById('ENSEP_csetting').textContent ='SEP GAIN ENABLED?: NO'
	}

	document.getElementById('TIAAUXR2_csetting').textContent ='TIA AUX R1: ' + tia_res_char[R_aux]
	document.getElementById('TIAAUXC2_csetting').textContent ='TIA AUX C1: ' + tia_cap_char[C_aux]

document.getElementById('LEDPhase_csetting').textContent ='Phase: ' + led_char[current_phase-1]
	

}


prog.initialize();