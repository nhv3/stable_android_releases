var csvfilename = "wearx_data";
var filewriter = false;
var bFilewriter = false;
var logfilename = "";
var fileOutLog = 1;
var savedlines = 0;





function failCreateLogFileTest(error)
{
	alert("failGotFileEntry: " + error.code);
}







var mysavestring = "";

function saveCSV(string)
{
	if (bFilewriter == true)
	{
		filewriter.write(line0.data "; \n");
	}
}
