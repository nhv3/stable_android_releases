/**
 * Object that holds application data and functions.
 */
 var app = {};

/**
 * Data that is plotted on the canvas.
 */
 app.dataPoints1 = [];
 app.dataPoints2 = [];
 app.dataPoints3 = [];

 var plotMolarity = 0;
 var movArrG = [];
 var movArrR = [];
 var movArrN = [];
 var movArrA = [];
 var movingAvgWindow = 10;
 movArrG.length = movingAvgWindow;
 movArrR.length = movingAvgWindow;
 movArrN.length = movingAvgWindow;
 movArrA.length = movingAvgWindow;
 var DCsumG = 0;
 var DCmeanG = 0;
 var DCsumR = 0;
 var DCmeanR = 0;
 var DCsumN = 0;
 var DCmeanN = 0;
 var DCsumA = 0;
 var DCmeanA = 0;
 var stamp = new Date();
 var time_tick = 0;
 var datapack1=[];
 var datapack2=[];
 var datapack3=[];
 var datapack4=[];
 var tickpack=[];

 var time_connection = 29410200; //Default value for the timer mode, 15 minutes, steps from 32.678KHz timer

 var isConnected = false;

 app.CONNECT_TIMEOUT = 120000;

/**
 * Object that holds SensorTag UUIDs and general device information.
 */
 app.sensortag = {};
 var deviceName = 'GUTSENS';
 app.sensortag.SENSOR_SERVICE = '0000b001-1212-efde-1523-785fef13d123';
 app.sensortag.TEMP = '0000c001-1212-efde-1523-785fef13d123';
 app.sensortag.GREEN = '0000c002-1212-efde-1523-785fef13d123'; //Used for real time streaming
 app.sensortag.RED= '0000c003-1212-efde-1523-785fef13d123'; // Used for data programming 
 app.sensortag.NIR = '0000c004-1212-efde-1523-785fef13d123'; //Used for time connection monitoring

 evothings.loadScript('libs/smoothie.js');
/**
 * Initialise the application.
 */

 app.initialize = function()
 {
 	document.addEventListener(
 		'deviceready',
 		function() { evothings.scriptsLoaded(app.onDeviceReady) },
 		false);

	// Called when HTML page has been loaded.
	$(document).ready( function()
	{
		// Adjust canvas size when browser resizes
		$(window).resize(app.respondCanvas);

		// Adjust the canvas size when the document has loaded.
		app.respondCanvas();
	});


};

//Automatic window container for resizing the layout on various devices 
app.respondCanvas = function()
{
	var canvas = $('#canvas')
	var container = $(canvas).parent()
	canvas.attr('width', $(container).width() ) // Max width

};


//Updates the averavge values for DC tracking
app.avgupdate= function(newValue, inArray, sum, mean)
{
	var slice = inArray.slice(0,movingAvgWindow);
	var temp_array = [newValue];
	inArray = temp_array.concat(slice);
	sum = inArray.reduce(function(a, b){return a + b;}, 0);
	mean = sum/movingAvgWindow;
};

app.onDeviceReady = function()
{
	app.showInfo('Activate PPG App ...');
};

app.showInfo = function(info)
{
	document.getElementById('info').innerHTML = info;
};

app.onStartButton = function()
{
	app.onStopButton();
	app.startScan();
	app.showInfo('Status: scanning for wearS ...');
	app.startConnectTimer();
};

app.onStopButton = function()
{
	// Stop any ongoing scan and close devices.
	app.stopConnectTimer();
	evothings.easyble.stopScan();
	evothings.easyble.closeConnectedDevices();
	isConnected = false;
	app.showInfo('Status: stopped.');
};


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() 
{

	document.getElementById("writeFile").addEventListener("click", writeFile);


};

app.startConnectTimer = function()
{
	// If connection is not made within the timeout
	// period, an error message is shown.
	app.connectTimer = setTimeout(
		function()
		{
			app.showInfo('Status: scanning... ' +
				'please wait...');
		},
		app.CONNECT_TIMEOUT)
}

app.stopConnectTimer = function()
{
	clearTimeout(app.connectTimer);
}

app.startScan = function()
{
	evothings.easyble.startScan(
		function(device)
		{
			// Connect if we have found a sensor tag.
			if (app.deviceIsSensorTag(device))
			{
				app.showInfo('Status: device found: ' + deviceName + '.');
				evothings.easyble.stopScan();
				app.connectToDevice(device);
				app.stopConnectTimer();
			}
		},
		function(errorCode)
		{
			app.showInfo('Error: startScan: ' + errorCode + '.');
		});
};

app.deviceIsSensorTag = function(device)
{
	console.log('device name: ' + device.name);
	return (device != null) &&
	(device.name != null) &&
	(device.name.indexOf(deviceName) > -1 ||
		device.name.indexOf(deviceName) > -1);
};

app.ProgRead = function()
{
	app.onStartButton();
}

/**
 * Read services for a device.
 */
 app.connectToDevice = function(device)
 {
 	app.showInfo('Connecting...');
 	device.connect(
 		function(device)
 		{
 			app.showInfo('Status: wearS connected ...');
 			isConnected = true;
 			app.timerConfig(device);
 		},
 		function(errorCode)
 		{
 			app.showInfo('Error: connection failed: ' + errorCode + '.');
 			isConnected = false;
 			app.stopConnectTimer();
 			evothings.easyble.stopScan();
 			evothings.easyble.closeConnectedDevices();
 			evothings.ble.reset();
 		});
 };

 app.timerConfig = function(device)
 {
    	//On either BLE operation we need to set the timing configuration
 	if(observer_mode) //if enabled, we need to write a timer value mode
 	{
 		//First check if the time interval is a valid number
 		prog.valueCheck();	

 		if(number_is_valid)
 		{
 			device.readServices(
 				[app.sensortag.SENSOR_SERVICE],
 				function(){hyper.log('Services Read')
 				var arra = new Uint8Array(3);
 			arra[0] = 0x01; //Send one byte that tells the BLE module to timeout at the specified time interval
 			arra[1] = time_pack[0];
 			arra[2] = time_pack[1];

 			device.writeCharacteristic(
 				"0000c004-1212-efde-1523-785fef13d123",
		      arra, // Write byte 
		      function()
		      {
		      	console.log('BLE characteristic written.');
		      },
		      function(errorCode)
		      {
		      	console.log('BLE writeDescriptor error: ' + errorCode);
		      });},
 			function(errorCode)
 			{
 				console.log('Error: failed to read services: ' + errorCode + '.');
 			});

			//Contact next set of services
			setTimeout(() => { app.readServices(device) }, 2000);
		}

		else
		{
			app.onStopButton(); //stop and disconnec to prevent going any further
		}
	}
	
	else if(!observer_mode)
	{
		device.readServices(
			[app.sensortag.SENSOR_SERVICE],
			function(){hyper.log('Services Read')
			var arra = new Uint8Array(1);
 			arra[0] = 0; //Send a 0 to let the process know there is not time monitoring
 			device.writeCharacteristic(
 				"0000c004-1212-efde-1523-785fef13d123",
		      arra, // Write byte 
		      function()
		      {
		      	console.log('BLE characteristic written.');
		      },
		      function(errorCode)
		      {
		      	console.log('BLE writeDescriptor error: ' + errorCode);
		      });},
 			function(errorCode)
 			{
 				console.log('Error: failed to read services: ' + errorCode + '.');
 			});

			//Contact next set of services
			setTimeout(() => { app.readServices(device) }, 2000);

		}
};

app.readServices = function(device)
{
	if(program_enabled)
	{
		device.readServices(
			[app.sensortag.SENSOR_SERVICE],
			function(){hyper.log('Services Read')
			var arra = new Uint8Array(10);
			arra[0] = prog_pack[0];
			arra[1] = prog_pack[1];
			arra[2] = prog_pack[2];
			arra[3] = prog_pack[3];
			arra[4] = prog_pack[4];
			arra[5] = prog_pack[5];
			arra[6] = prog_pack[6];
			arra[7] = prog_pack[7];
			arra[8] = prog_pack[8];
			arra[9] = prog_pack[9];

			device.writeCharacteristic(
				"0000c003-1212-efde-1523-785fef13d123",
		      arra, // Write byte with value og programming pack.
		      function()
		      {
		      	console.log('BLE characteristic written.');
		      },
		      function(errorCode)
		      {
		      	console.log('BLE writeDescriptor error: ' + errorCode);
		      });},
		// Use this function to monitor magnetometer data
		function(errorCode)
		{
			console.log('Error: failed to read services: ' + errorCode + '.');
		});
		program_enabled = 0;    

	}
	else
	{
		device.readServices(
			[app.sensortag.SENSOR_SERVICE],
			app.startNotification,
		// Use this function to monitor magnetometer data
		function(errorCode)
		{
			console.log('Error: failed to read services: ' + errorCode + '.');
		});

	}
}

app.startNotification = function(device)
{
	app.showInfo('Status: Data Streaming ...');

	device.enableNotification(
		app.sensortag.GREEN,
		function(data)
		{
			hyper.log(evothings.util.typedArrayToHexString(data))
			var dataArray = new Uint8Array(data);
			var canvas = document.getElementById('canvas2');
			var context = canvas.getContext('2d');
			//Now we need to split the 8byte array into two 4byte chonks 
			var d1 = dataArray.slice(0,4); //Grabs Red reg
			var d2 = dataArray.slice(4,8); //Grabs Green reg
			var d3 = dataArray.slice(8,12); //Grabs NIR reg
			var d4 = dataArray.slice(12,16); //Grabs AMB1 reg
			var time_stamp = dataArray.slice(16,20); //Grabs time nibble

			var dataSensor1 = Number((evothings.util.littleEndianToUint32(d1,0)*(1.2)/(Math.pow(2,21))).toPrecision(6))
			var dataSensor2 = Number((evothings.util.littleEndianToUint32(d2,0)*(1.2)/(Math.pow(2,21))).toPrecision(6))
			var dataSensor3 = Number((evothings.util.littleEndianToUint32(d3,0)*(1.2)/(Math.pow(2,21))).toPrecision(6))
			var dataSensor4 = Number((evothings.util.littleEndianToUint32(d4,0)*(1.2)/(Math.pow(2,21))).toPrecision(6))

			var tick = evothings.util.littleEndianToUint32(time_stamp,0);

			datapack1.push(dataSensor1);
			datapack2.push(dataSensor2);
			datapack3.push(dataSensor3);
			datapack4.push(dataSensor4);
			tickpack.push(tick);

			//Update the average DC values 
			app.avgupdate(dataSensor1,movArrR,DCsumR,DCmeanR);
			app.avgupdate(dataSensor2,movArrG,DCsumG,DCmeanG);
			app.avgupdate(dataSensor3,movArrN,DCsumN,DCmeanN);
			app.avgupdate(dataSensor4,movArrA,DCsumA,DCmeanA);

			//Update the smoothie chart
			line1.append(new Date().getTime(), dataSensor1);
			line2.append(new Date().getTime(), dataSensor2);
			line3.append(new Date().getTime(), dataSensor3);
			line4.append(new Date().getTime(), dataSensor4);

			//line1dc.append(new Date().getTime(), DCmeanR);
			//line2dc.append(new Date().getTime(), DCmeanG);
			//line3dc.append(new Date().getTime(), DCmeanN);
			//line4dc.append(new Date().getTime(), DCmeanA);

			document.getElementById('info1').innerHTML = 'Red CH.:'+ dataSensor1 + 'V' ;
			document.getElementById('info2').innerHTML = 'Green CH.:'+ dataSensor2 + 'V';
			document.getElementById('info3').innerHTML = 'NIR CH.:'+ dataSensor3 + 'V';
			document.getElementById('info4').innerHTML = 'AMB1 CH.:'+ dataSensor4 + 'V' ;
		},

		function(errorCode)
		{
			console.log('Error: enableNotification: ' + errorCode + '.');
		});

};

stamp = new Date();
function createFile() {
	var type = window.TEMPORARY;
	var size = 5*1024*1024;
	logfilename = "WearS" + "_" + stamp.getFullYear() + "_" + stamp.getMonth() + "_" + stamp.getDate() + "_" + stamp.getHours() + "_" + stamp.getMinutes() + "_" + stamp.getSeconds() + ".txt";
	window.requestFileSystem(type, size, successCallback, errorCallback)

	function successCallback(fs) {
		fs.root.getFile(logfilename, {create: true, exclusive: true}, function(fileEntry) {
			alert('File creation successfull!')
		}, errorCallback);
	}

	function errorCallback(error) {
		alert("ERROR: " + error.code)
	}

}

//



function writeFile() {
	var type = window.TEMPORARY;
	var size = 5*1024*1024;
	var stamp = new Date();

	logfilename = "wearS" + "_" + stamp.getFullYear() + "_" + (stamp.getMonth()+1) + "_" + stamp.getDate() + "_" + stamp.getHours() + "_" + stamp.getMinutes() + "_" + stamp.getSeconds() + ".txt";
	window.requestFileSystem(type, size, successCallback, errorCallback)

	function successCallback(fs) {

		fs.root.getFile(logfilename, {create: true, exclusive: true}, function(fileEntry) {

			fileEntry.createWriter(function(fileWriter) {
				fileWriter.onwriteend = function(e) {
					alert('Write completed.');
				};

				fileWriter.onerror = function(e) {
					alert('Write failed: ' + e.toString());
				};

            //var blob = new Blob([line1s.data + "\n" + line2s.data + "\n" + line3s.data + "\n" + line4s.data], {type: 'text/plain'});
            var blob = new Blob([datapack1 + "\n" + " END OF RED DATA " + "\n" + datapack2 + "\n" +" END OF GREEN DATA " + "\n" + datapack3 + "\n" +" END OF NIR DATA " + "\n" + datapack4 + "\n" +" END OF DATA " + "\n" + tickpack], {type: 'text/plain'});
            fileWriter.write(blob);
        }, errorCallback);

		}, errorCallback);

	}

	function errorCallback(error) {
		alert("ERROR: " + error.code)
	}

}

app.initialize();