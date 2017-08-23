	//Reading the file
	const readline = require('readline')
	const fs = require('fs')
	const rl = readline.createInterface(fs.createReadStream('crimedata.csv','utf-8'));
	//Creating the writestream for json 
	let myfile=fs.createWriteStream('./../json/robbery_and_burglary_yearwise.json');
	let myfile1=fs.createWriteStream('./../json/datafiltering(2001-2016).json');
	let myfile2=fs.createWriteStream('./../json/aggregate_robbery.json');
	let year=[];
	for (i=2001;i<=2016;i++)
	{
		year[i-2001]=i;
	}
	let robbery_and_burglary=[],datafiltering=[],robbery_aggregate=[];		//Declaring all the required arrays for code
	let robbery =Array(16).fill(0); 
	let burglary=Array(16).fill(0);
	let damagetoproperty=Array(16).fill(0);
	let damagetovehicle=Array(16).fill(0);
	let damagetostatesub=Array(16).fill(0);
	rl.on('line', (line) => {
	    line.split('\n')
	    let  arr=line.split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
	    if(arr.includes("Year"))
	      yearindex=arr.indexOf("Year");
	    if(arr.includes("Primary Type"))
	      primaryindex=arr.indexOf("Primary Type");
	    if(arr.includes("Description"))
		      descriptionindex=arr.indexOf("Description");
	    let year=parseInt(arr[yearindex]);
	    let primary=arr[primaryindex];
	    let description=arr[descriptionindex];
	    if(year>=2001&&year<=2016)	//	Main logic starts
	    {
	     if(primary == "ROBBERY")
	      	robbery[year-2001]++;
	     if(primary == "BURGLARY") 
	     		burglary[year-2001]++;
	     if(primary == "CRIMINAL DAMAGE"&& description ==  "TO PROPERTY")
	      	damagetoproperty[year-2001]++;
	     if(primary == "CRIMINAL DAMAGE" && description == "TO VEHICLE") 
	     	damagetovehicle[year-2001]++;
	     if(primary == "CRIMINAL DAMAGE" && description == "TO STATE SUP PROP") 
	      damagetostatesub[year-2001]++;
	    }
	 });
	rl.on('close' , (line) =>{
		let a=new Array(16);
		for(i in year){
			robbery_and_burglary.push({"year":year[i],"robbery": robbery[i],"burglary": burglary[i]});	//push the content in array
		}
		myfile.write(JSON.stringify(robbery_and_burglary,null,2));	//	Writing into json
		for(i in year){
			datafiltering.push({"year":year[i],"Damage_to_property": damagetoproperty[i],"Damage_to_vehicle": damagetovehicle[i], "Damage_to_state_sup_prop" : damagetostatesub[i] });
		}
		myfile1.write(JSON.stringify(datafiltering,null,2));
		for(i in year){
			robbery_aggregate.push({"year":year[i],"robbery": robbery[i]});
		}
		myfile2.write(JSON.stringify(robbery_aggregate,null,2));
	});
