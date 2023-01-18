//let axios = require('axios').default;
const path = require('path');
const notifier = require('node-notifier');
//let alert = require('alert');
const child_process = require('child_process');
let fetch = require('node-fetch');

//console.log(fetch);



let moment = require('moment');
let momentjalali = require('moment-jalaali');
let today = momentjalali().format('jYYYY/jMM/jDD');

//console.log(today);

/*
const d = Date.now();
let today = new Date(d);
console.log(today.toLocaleString('sv'));


let dateContent = '' ;

dateContent += moment(today, 'YYYY/MM/DD').format('YYYY/MM/DD');

console.log(dateContent);

*/


let sectionCounterAll = 0;
let barmillCounterAll = 0;


let sectionCounter = 0;
let barmillCounter = 0;

let data = [] ;

let truckType = '';


setInterval( async () => {
	let response = await requestData();
	
	console.log(response);
	
	let title ;
	let message ;
	
	if( response.length > data.length ) {
		increaseCounters(response);
		appendResponseToData(response);
		calculateAllTruckInputs();
		
		
		if( sectionCounter == 0 ) {
			title = `عدم ورودی به سمت سکشن` + '.....' + ` مجموع ورودی : ${sectionCounterAll} ` ;
		} else {
			title = "تعداد " +
					`${sectionCounter} ` +
					"عدد تریلی " +
					"به سمت سکشن " +
					"وارد شد " +
					'.....' + ` مجموع ورودی : ${sectionCounterAll} ` ;
		}
		
		if(barmillCounter == 0) {
			message = `عدم ورودی به سمت بارمیل` + '.....' + ` مجموع ورودی : ${barmillCounterAll} ` ;
		} else {
			message = "تعداد " +
					  `${barmillCounter} ` +
					  "عدد تریلی " +
					  "به سمت بارمیل " +
					  "وارد شد " +
					  '.....' + ` مجموع ورودی : ${barmillCounterAll} ` ;;
		}
		
		showNotification( title , message );
		//alert( title + '\r\n' + message);
		
	} else {
		
	}
} , 1000 * 15 );


let increaseCounters = (response) => {
	sectionCounter = 0;
	barmillCounter = 0;
	for(let i=0;i<response.length;i++) {
		if(i < data.length) {
			continue;
		} else {
			if(response[i].BilletType.toLowerCase() == '3sp') {
				sectionCounter++;
			} else if (response[i].BilletType.toLowerCase() == '5sp') {
				barmillCounter++;
			}
		}
	}
}


let calculateAllTruckInputs = () => {
	
	sectionCounterAll = 0;
	barmillCounterAll = 0;
	
	for( let i=0;i<data.length;i++ ) {
		if(data[i].BilletType.toLowerCase() == '3sp') {
			sectionCounterAll++
		} else if (data[i].BilletType.toLowerCase() == '5sp') {
			barmillCounterAll++;
		}
	}
	
	
}





let appendResponseToData = (response) => {
	for( let i=0;i<response.length;i++ ) {
		if( i < data.length ) {
			continue;
		} else {
			data.push(response[i]);
		}
	}
}



let showNotification = (title , message) => {
	notifier.notify({
	  'app-name': 'محموله ورودی',
	  title,
	  message ,
	  icon: path.join(__dirname , 'images/truck48.png'),
	  label : 'محموله ورودی' ,
	  wait : true ,
	  timeout: 5,
	});


	notifier.on('click', function (notifierObject, options, event) {
	  //console.log('you clicked...');
	  //child_process.exec('start "" ' + varedi_path + '');
	  //exitProcess();		
	});


	notifier.on('timeout', function (notifierObject, options) {
	  // Triggers if `wait: true` and notification closes
	  //child_process.exec('start "" ' + varedi_path + '');
	  //exitProcess();
	});
}





let requestData = async () => {
	
	/*let data = await axios.get(
	  'http://172.16.32.4:81/api/BilletInput/GetBilletInputs/',
	   {
		username: '6272',
		password: 'sj6272',
		startDate : today ,
		endDate : today
	  }
	);*/
	
	//const response = await fetch(`http://172.16.32.4:81/api/BilletInput/GetBilletInputs/?username=6272&password=sj6272&startDate=1401/08/17&endDate=1401/08/17`);
	const response = await fetch(`http://172.16.32.4:81/api/BilletInput/GetBilletInputs/?username=6272&password=sj6272&startDate=${today}&endDate=${today}`);
	const body = await response.json();

	return body.Result ;
	
}











/*

http://172.16.32.4:81/api/BilletInput/GetBilletInputs/

Input Data:

username=username : string
password=pass :string
startDate=1400/01/01 :string
endDate=1400/01/01 :string

output Data:

Success:bool,
Message:string,
Result:array

*/