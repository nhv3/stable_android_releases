var currentTime = 0;
var currentDate = 0;
var timerCalled = 0;
var lastTime = -1;
var currentSensorString = "";
var timerstarttime = -1;


function getTimeInMs()
{
	if (lastTime != -1)
		lastTime = currentTime;
	var d = new Date();
	currentTime  = d.getTime();
	currentDate  = d.toLocaleString();
	if (lastTime == -1)
		lastTime = currentTime;
	if (timerstarttime == -1)
		timerstarttime = currentTime;
	timerCalled++;
	return currentTime;
}

function csvSensorData(code, data)
{
	var sensorString = 	code + ";" + timerCalled + ";" + currentDate + ";" + currentTime + ";" + (currentTime - startTime) + ";" + (currentTime - lastTime);
	for	(index = 0; index < data.length; index++)
	{
		sensorString += ";" + data[index];
	}

	if (arguments.length > 2)
	{
		for	(var index = 2; index < arguments.length; index++)
		{
			sensorString += ";" + arguments[index];
		}
	}

	return sensorString;
}

function csvSensorDataString(code, string)
{
	var sensorString = 	code + ";" + timerCalled + ";" + currentDate + ";" + currentTime + ";" + (currentTime - startTime) + ";" + (currentTime - lastTime) + ";" + string;
	if (arguments.length > 2)
	{
		for	(index = 2; index < arguments.length; index++)
		{
			sensorString += ";" + arguments[index];
		}
	}
	return sensorString;
}

var startTime = getTimeInMs();
timerCalled--;
lastTime = startTime;
if (window.hyper) { console.log = hyper.log; }

function initDataStorage()
{
	timerCalled=0;
	var startTime = getTimeInMs();
	lastTime = startTime;
	var result = startDataStorage();
	return false;
}

var testmode = false;

var gyroCounter = 0;
var accCounter = 0;
var tempCounter = 0;
var humCounter = 0;
var baroCounter = 0;
var magCounter = 0;

var startTime = 0;

function test()
{
	if (testmode)
	{
		// Ausschalten
		var d = new Date();
		var stopTime = d.getTime();
		document.getElementById("test").style.background = "green";
		document.getElementById("test").innerHTML = "Start Test";
		var diftime = (stopTime - startTime)/1000;
		testmode = false;
		var allMeasures = gyroCounter +	accCounter + tempCounter + humCounter +	baroCounter + magCounter;
		if (allMeasures > 0)
		{
			var measpermill = allMeasures/diftime;
			alert("Measures per second: " + measpermill + " (" + diftime + ")");
		}
		else
		{
			alert("No measures logged: " + diftime);
		}
	}
	else
	{
		// Einschalten
		testmode = true;
		gyroCounter = 0;
		accCounter = 0;
		tempCounter = 0;
		humCounter = 0;
		baroCounter = 0;
		magCounter = 0;
		// document.getElementById("test").disabled = false;
		document.getElementById("test").style.background = "red";
		document.getElementById("test").innerHTML = "Stop Test";
		var d = new Date();
		startTime = d.getTime();
	}
}

var markercount = 0;
function marker(value)
{
	markercount++;
	getTimeInMs();
	var t1 = document.getElementById("text1").value;
	var t2 = document.getElementById("text2").value;
	var string = csvSensorDataString("MARK", value + ";" + t1 + ";" + t2 + ";" + markercount);
	saveCSV(string);
}
