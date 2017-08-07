 function solarCalc(billamount, category, state, use) {	
	use = use || 25;
	var data = {
		"billamount": parseInt(billamount),
		"cusType": "",
		"state": "",
		"units": 0,
		"savings": 0,
		"slabrate": 0,
		"solarrate": 5,
		"totalunits": 0,
		"unitswSolar": 0,
		"lifetimesavings": 0,
		"percentuse": 100,
		"powergenerated": 0,
		"cost": 0,
		"newbill": 0,
		"roi": 0,
		"breakeven": 5,
		"opex": 500,
		"dailygen": 4.3,
		"emi": 0,
		"interest": 0,
		"term": 5,
		"debt": 70,
		"rescolifesavings": 0,
		"ftrbillArray" : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
		"ftrunitsArray" : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
		"ftrbillSolarArray" : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
		"ftrunitsSolarArray" : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
		"ftrOpExArray" : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
		"ftrPlantSize": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
		"ftrSavingsArray": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
		"ftrReplacementCostArray": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0],
		"ftrCashFlowsArray": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
		"ftrPVArray": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
	};
	
	data.percentuse = use;
	data.state = state;
	data.cusType = category;
	data.interest = 8.45;

	if (category === "Residential"){
		data.cusType = "Residential";
		for (var i = 0; i < data.ftrbillArray.length; i++) {
			data.ftrbillArray[i] = Math.round(billamount * Math.pow(1.05, i));
			data.ftrbillSolarArray[i] = Math.round(data.ftrbillArray[i] - (data.ftrbillArray[i] * use * 0.01));
			data.ftrunitsArray[i] = Math.round(getUnits(data.ftrbillArray[i], i, data.cusType));
			data.ftrunitsSolarArray[i] = Math.round(data.ftrunitsArray[i] - getUnits(data.ftrbillSolarArray[i], i, data.cusType));
			data.ftrPlantSize[i] = data.ftrunitsSolarArray[i] / (data.dailygen * 30);
			data.ftrSavingsArray[i] = Math.round(data.ftrbillArray[i] - data.ftrbillSolarArray[i]) * 12;
			data.lifetimesavings = data.lifetimesavings + data.ftrSavingsArray[i];
		}
		
		sum = data.ftrPlantSize.reduce((previous, current) => current += previous);
		data.maxplantcapacity = Math.round(sum/data.ftrPlantSize.length);
		
		for (var i = 0; i < data.ftrbillArray.length; i++) {
			data.ftrOpExArray[i] = 500 * data.maxplantcapacity * Math.pow(1.05, i);
			data.ftrSavingsArray[i] = Math.round(data.ftrbillArray[i] - data.ftrbillSolarArray[i]) * 12 - (500 * data.maxplantcapacity * Math.pow(1.05, i));
			if(i === 10){
				data.ftrSavingsArray[i] = data.ftrSavingsArray[i] - (4.2 * 1000 * data.maxplantcapacity) - (500 * data.maxplantcapacity * Math.pow(1.05, i));	
			}else if(i === 20){
				data.ftrSavingsArray[i] = data.ftrSavingsArray[i] - (4.2 * 1000 * data.maxplantcapacity) - (500 * data.maxplantcapacity * Math.pow(1.05, i));	
			}
		}

		for (var i = 0; i < 25; i++) {
			data.rescolifesavings = data.rescolifesavings + (data.maxplantcapacity * 4.3 * 365 * 2.5 * Math.pow(1.05, i));
		}

		data.rescolifesavings = Math.round(data.rescolifesavings)

		data.ftrReplacementCostArray[10] = 4.2 * data.maxplantcapacity * 1000;
		data.ftrReplacementCostArray[20] = 4.2 * data.maxplantcapacity * 1000;
		opex = data.ftrOpExArray.reduce((previous, current) => current += previous);
		data.lifetimesavings = Math.round(data.ftrSavingsArray.reduce((previous, current) => current += previous));
		data.plantarea = Math.round(data.maxplantcapacity * 100);
		data.powergenerated = Math.round(data.maxplantcapacity * 4 * 365 * 25);
		data.newbill = billamount * ((100-use)/100);
		data.savings = billamount - data.newbill;
		data.cost = Math.round(data.maxplantcapacity * getPlantCostPerKW(data.maxplantcapacity));
		data.roi = Math.round((((data.lifetimesavings/100000) - data.cost) / data.cost) * 100);
		data.emi = -1*(Math.round(PMT((data.interest * 0.01)/12, data.term * 12, (data.debt/100) * data.cost * 100000)));
	}

	if (category === "Commercial"){
		data.cusType = "Commercial";
		data.slabrate = 7.5;
		for (var i = 0; i < data.ftrbillArray.length; i++) {
			data.ftrbillArray[i] = Math.round(billamount * Math.pow(1.05, i));
			data.ftrbillSolarArray[i] = Math.round(data.ftrbillArray[i] - (data.ftrbillArray[i] * use * 0.01));
			data.ftrunitsArray[i] = Math.round(getUnits(data.ftrbillArray[i], i, data.cusType));
			data.ftrunitsSolarArray[i] = Math.round(data.ftrunitsArray[i] - getUnits(data.ftrbillSolarArray[i], i, data.cusType));
			data.ftrPlantSize[i] = data.ftrunitsSolarArray[i] / (data.dailygen * 30);
			data.ftrSavingsArray[i] = Math.round(data.ftrbillArray[i] - data.ftrbillSolarArray[i]) * 12;
			data.lifetimesavings = data.lifetimesavings + data.ftrSavingsArray[i];
		}
		
		sum = data.ftrPlantSize.reduce((previous, current) => current += previous);
		data.maxplantcapacity = Math.round(sum/data.ftrPlantSize.length);
		
		for (var i = 0; i < data.ftrbillArray.length; i++) {
			data.ftrOpExArray[i] = 500 * data.maxplantcapacity * Math.pow(1.05, i);
		}

		for (var i = 0; i < 25; i++) {
			data.rescolifesavings = data.rescolifesavings + (data.maxplantcapacity * 4.3 * 365 * 2.5 * Math.pow(1.05, i));
		}
		data.rescolifesavings = Math.round(data.rescolifesavings)

		data.ftrReplacementCostArray[10] = 4.2 * data.maxplantcapacity * 1000;
		data.ftrReplacementCostArray[20] = 4.2 * data.maxplantcapacity * 1000;
		opex = data.ftrOpExArray.reduce((previous, current) => current += previous);
		data.lifetimesavings = Math.round(data.ftrSavingsArray.reduce((previous, current) => current += previous) - data.ftrReplacementCostArray[10] - data.ftrReplacementCostArray[20] - opex);
		data.plantarea = Math.round(data.maxplantcapacity * 100);
		data.powergenerated = Math.round(data.maxplantcapacity * 4 * 365 * 25);
		data.newbill = billamount * ((100-use)/100);
		data.savings = billamount - data.newbill;
		data.cost = Math.round(data.maxplantcapacity * getPlantCostPerKW(data.maxplantcapacity));
		data.roi = Math.round((((data.lifetimesavings/100000) - data.cost) / data.cost) * 100);
		data.emi = Math.round((PMT((data.interest * 0.01)/12, data.term * 12, (data.debt/100) * data.cost * 100000))*(-1));
	}

	if (category === "Industrial"){
		data.cusType = "Industrial";
		data.slabrate = 6.5;
		for (var i = 0; i < data.ftrbillArray.length; i++) {
			data.ftrbillArray[i] = Math.round(billamount * Math.pow(1.05, i));
			data.ftrbillSolarArray[i] = Math.round(data.ftrbillArray[i] - (data.ftrbillArray[i] * use * 0.01));
			data.ftrunitsArray[i] = Math.round(getUnits(data.ftrbillArray[i], i, data.cusType));
			data.ftrunitsSolarArray[i] = Math.round(data.ftrunitsArray[i] - getUnits(data.ftrbillSolarArray[i], i, data.cusType));
			data.ftrPlantSize[i] = data.ftrunitsSolarArray[i] / (data.dailygen * 30);
			data.ftrSavingsArray[i] = Math.round(data.ftrbillArray[i] - data.ftrbillSolarArray[i]) * 12;
			data.lifetimesavings = data.lifetimesavings + data.ftrSavingsArray[i];
		}
		
		sum = data.ftrPlantSize.reduce((previous, current) => current += previous);
		data.maxplantcapacity = Math.round(sum/data.ftrPlantSize.length);
		
		for (var i = 0; i < data.ftrbillArray.length; i++) {
			data.ftrOpExArray[i] = 500 * data.maxplantcapacity * Math.pow(1.05, i);
		}

		for (var i = 0; i < 25; i++) {
			data.rescolifesavings = data.rescolifesavings + (data.maxplantcapacity * 4.3 * 365 * 2.5 * Math.pow(1.05, i));
		}
		data.rescolifesavings = Math.round(data.rescolifesavings)
		
		data.ftrReplacementCostArray[10] = 4.2 * data.maxplantcapacity * 1000;
		data.ftrReplacementCostArray[20] = 4.2 * data.maxplantcapacity * 1000;
		opex = data.ftrOpExArray.reduce((previous, current) => current += previous);
		data.lifetimesavings = Math.round(data.ftrSavingsArray.reduce((previous, current) => current += previous) - data.ftrReplacementCostArray[10] - data.ftrReplacementCostArray[20] - opex);
		data.plantarea = Math.round(data.maxplantcapacity * 100);
		data.powergenerated = Math.round(data.maxplantcapacity * 4 * 365 * 25);
		data.newbill = billamount * ((100-use)/100);
		data.savings = billamount - data.newbill;
		data.cost = Math.round(data.maxplantcapacity * getPlantCostPerKW(data.maxplantcapacity));
		data.roi = Math.round((((data.lifetimesavings/100000) - data.cost) / data.cost) * 100);
		data.emi = -1*Math.round(PMT((data.interest * 0.01)/12, data.term * 12, (data.debt/100) * data.cost * 100000));

	}

	// console.log("Customer of State: " + state);
	// console.log("Customer Type: "+ data.cusType);
	// console.log("Bill Amount Monthly: " + billamount);
	// console.log("Plant Capacity :" + data.maxplantcapacity);
	// console.log("Plant Area Sq.ft.:" + data.plantarea);
	// console.log("Daily Units : "+ data.dailyunits);
	// console.log("Savings : Rs. "+ data.savings);
	// console.log("Units with Solar: "+ data.unitswSolar);
	// console.log("Life Time Savings : Rs. "+ data.lifetimesavings);
	console.log("term"+ data.term);

	return data;
}

function getUnits(billamt, year, cusType){
	if(cusType === "Residential"){
		if ( billamt <= (200 * 5 * Math.pow(1.04, year)) ) {
			slabrate = 5 * Math.pow(1.04, year);
			slabrate = slabrate.toFixed(1);
			totalunits = billamt/slabrate;
		}
		else if( billamt > (200 * 5 * Math.pow(1.04, year)) & billamt <= (200 * 5 * Math.pow(1.04, year)) + (100 * 7.2 * Math.pow(1.04, year)) ) {
			slabrate = 7.2 * Math.pow(1.04, year);
			slabrate = slabrate.toFixed(1);
			units = (billamt-(200 * 5 * Math.pow(1.04, year)))/slabrate;
			totalunits = 200 + units;
		}
		else if( billamt > (200 * 5 * Math.pow(1.04, year)) + (100 * 7.2 * Math.pow(1.04, year)) & billamt <= (200 * 5 * Math.pow(1.04, year)) + (100 * 7.2 * Math.pow(1.04, year)) + (100 * 8.5 * Math.pow(1.04,year)) ) {
			slabrate = 8.5 * Math.pow(1.04, year);
			slabrate = slabrate.toFixed(1);
			units = (billamt-(200 * 5 * Math.pow(1.04, year)) + (100 * 7.2 * Math.pow(1.04, year)))/slabrate;
			totalunits = 200 + 100 + units;
		}
		else if ( billamt > (200 * 5 * Math.pow(1.04, year)) + (100 * 7.2 * Math.pow(1.04, year)) + (100 * 8.5 * Math.pow(1.04,year)) & billamt <= (200 * 5 * Math.pow(1.04, year)) + (100 * 7.2 * Math.pow(1.04, year)) + (100 * 8.5 * Math.pow(1.04,year)) + (400 * 9 * Math.pow(1.04,year)) ) {
			slabrate = 9.0 * Math.pow(1.04, year);
			slabrate = slabrate.toFixed(1);
			units = (billamt-(200 * 5 * Math.pow(1.04, year)) + (100 * 7.2 * Math.pow(1.04, year)) + (100 * 8.5 * Math.pow(1.04,year)) + (400 * 9 * Math.pow(1.04,year)))/slabrate;
			totalunits = 200 + 100 + 100 + units;
		}
		else if ( billamt > (200 * 5 * Math.pow(1.04, year)) + (100 * 7.2 * Math.pow(1.04, year)) + (100 * 8.5 * Math.pow(1.04,year)) + (400 * 9 * Math.pow(1.04,year)) ) {
			slabrate = 9.5 * Math.pow(1.04, year);
			slabrate = slabrate.toFixed(1);
			units = (billamt-((200 * 5 * Math.pow(1.04, year)) + (100 * 7.2 * Math.pow(1.04, year)) + (100 * 8.5 * Math.pow(1.04,year)) + (400 * 9 * Math.pow(1.04,year))))/slabrate;
			totalunits = 200 + 100 + 100 + 400 + units;
		}
	}
	if(cusType === "Commercial"){
		slabrate = 7.5 * Math.pow(1.04, year);
		slabrate = slabrate.toFixed(1);
		units = billamt/slabrate;
		totalunits = units;
	}
	if(cusType == "Industrial"){
		slabrate = 6.5 * Math.pow(1.04, year);
		slabrate = slabrate.toFixed(1);
		units = billamt/slabrate;
		totalunits = units;
	}
	return totalunits;	
}

function getPlantCostPerKW(sizeKw) {
	if(sizeKw >= 1 & sizeKw < 10){
		return 0.6;
	}else if(sizeKw >=10 & sizeKw < 25){
		return 0.52;
	}else if(sizeKw >= 25 & sizeKw < 50){
		return 0.5;
	}else if(sizeKw >= 50 & sizeKw < 100){
		return 0.48;
	}else if(sizeKw >= 100 & sizeKw < 200){
		return 0.45;
	}else if(sizeKw >= 200){
		return 0.43;
	}
}

function getSizeFromCost(cost){
	if(cost <= 5.5){
		return cost/0.55;
	}else if(cost > 5.5 & cost <= (0.52 * 25)){
		return cost/0.52;
	}else if(cost > (0.52 * 25) & cost <= 0.5 * 50){
		return cost/0.5;
	}else if(cost > (0.5 * 50) & cost <= 0.48 * 100){
		return cost/0.48;
	}else if(cost > (0.48 * 100) & cost <= 0.45 * 200){
		return cost/0.45;
	}else if(cost > (0.45 * 200)) {
		return cost/0.43;
	}
}

function getSavingsFromCap(billamount, capacity, cusType, year) {
	var tunits = capacity * 4.3 * 30;
	var gunits = getUnits(billamount, year , cusType);
	var slab = getSlab(billamount, year);
	var sunits1 = 0;
	var sunits2 = 0;
	var sunits3 = 0;
	var sunits4 = 0;
	var sunits5 = 0;
	var savings1 = 0;
	var savings2 = 0;
	var savings3 = 0;
	var savings4 = 0;
	var savings5 = 0;

	if(cusType === "Residential"){
		if(slab === 1){
			sunits1 = gunits;
			sunits2 = 0;
			sunits3 = 0;
			sunits4 = 0;
			sunits5 = 0;
		}else if(slab === 2){
			sunits1 = 200;
			sunits2 = gunits - 200;
			sunits3 = 0;
			sunits4 = 0;
			sunits5 = 0;
		}else if(slab === 3){
			sunits1 = 200;
			sunits2 = 100;
			sunits3 = gunits - 300;
			sunits4 = 0;
			sunits5 = 0;
		}else if(slab === 4){
			sunits1 = 200;
			sunits2 = 100;
			sunits3 = 100;
			sunits4 = gunits - 400;
			sunits5 = 0;
		}else if(slab === 5){
			sunits1 = 200;
			sunits2 = 100;
			sunits3 = 100;
			sunits4 = 400;
			sunits5 = gunits - 800;
		}

		if(slab === 5){
			if((sunits5 - tunits) < 0){
				savings5 = sunits5 * 9.5 * Math.pow(1.04, year);
				tunits = tunits - sunits5;
				if((sunits4 - tunits) < 0){
					savings4 = sunits4 * 9 * Math.pow(1.04, year);
					tunits = tunits - sunits4;
					if((sunits3 - tunits) < 0){
						savings3 = sunits3 * 8.5 * Math.pow(1.04, year);
						tunits = tunits - sunits3;
						if((sunits2 - tunits) < 0){
							savings2 = sunits2 * 7.2 * Math.pow(1.04, year);
							tunits = tunits - sunits2;
							if((sunits1 - tunits) < 0){
								savings1 = sunits1 * 5 * Math.pow(1.04, year);
								tunits = tunits - sunits1;
							}
						}
					}
				}
			}else{
				savings5 = tunits * 9.5 * Math.pow(1.04, year);
			}
		}else if(slab === 4){
			if((sunits4 - tunits) < 0){
				savings4 = sunits4 * 9 * Math.pow(1.04, year);
				tunits = tunits - sunits4;
				if((sunits3 - tunits) < 0){
					savings3 = sunits3 * 8.5 * Math.pow(1.04, year);
					tunits = tunits - sunits3;
					if((sunits2 - tunits) < 0){
						savings2 = sunits2 * 7.2 * Math.pow(1.04, year);
						tunits = tunits - sunits2;
						if((sunits1 - tunits) < 0){
							savings1 = sunits1 * 5 * Math.pow(1.04, year);
							tunits = tunits - sunits1;
						}
					}
				}
			}else{
				savings4 = tunits * 9.5 * Math.pow(1.04, year);
			}
		}else if(slab === 3){
			if((sunits3 - tunits) < 0){
				savings3 = sunits3 * 8.5 * Math.pow(1.04, year);
				tunits = tunits - sunits3;
				if((sunits2 - tunits) < 0){
					savings2 = sunits2 * 7.2 * Math.pow(1.04, year);
					tunits = tunits - sunits2;
					if((sunits1 - tunits) < 0){
						savings1 = sunits1 * 5 * Math.pow(1.04, year);
						tunits = tunits - sunits1;
					}
				}
			}else{
				savings3 = tunits * 9.5 * Math.pow(1.04, year);
			}
		}else if(slab === 2){
			if((sunits2 - tunits) < 0){
				savings2 = sunits2 * 7.2 * Math.pow(1.04, year);
				tunits = tunits - sunits2;
				if((sunits1 - tunits) < 0){
					savings1 = sunits1 * 5 * Math.pow(1.04, year);
					tunits = tunits - sunits1;
				}
			}else{
				savings2 = tunits * 9.5 * Math.pow(1.04, year);
			}
		}else if(slab === 1){
			if((sunits1 - tunits) < 0){
				savings1 = sunits1 * 5 * Math.pow(1.04, year);
				tunits = tunits - sunits1;
			}else{
				savings1 = tunits * 9.5 * Math.pow(1.04, year);
			}
		}
		// console.log("slab "+slab);
		// console.log("gunits "+gunits);
		// console.log("tunits "+tunits);
		// console.log("sunits1 "+sunits1);
		// console.log("sunits2 "+sunits2);
		// console.log("sunits3 "+sunits3);
		// console.log("sunits4 "+sunits4);
		// console.log("sunits5 "+sunits5);
		// console.log("savings1 "+savings1);
		// console.log("savings2 "+savings2);
		// console.log("savings3 "+savings3);
		// console.log("savings4 "+savings4);
		// console.log("savings5 "+savings5);
		// console.log(savings5 + savings4 + savings3 + savings2 + savings1)
		return savings5 + savings4 + savings3 + savings2 + savings1;

	}else if(cusType === "Commercial"){

		return (tunits * 7.5 * Math.pow(1.04, year));
	}else if(cusType === "Industrial"){

		return (tunits * 6.5 * Math.pow(1.04, year));
	}
}

function getSlab(billamount, i) {
	if(billamount <= (200 * 5 * Math.pow(1.04, i))){
		return 1;
	}else if(billamount > (200 * 5 * Math.pow(1.04, i)) & billamount <= (200 * 5 * Math.pow(1.04, i)) + (100 * 7.2 * Math.pow(1.04, i))){
		return 2
	}else if(billamount > (200 * 5 * Math.pow(1.04, i)) + (100 * 7.2 * Math.pow(1.04, i)) & billamount <= (200 * 5 * Math.pow(1.04, i)) + (100 * 7.2 * Math.pow(1.04, i)) + (100 * 8.5 * Math.pow(1.04,i))){
		return 3;
	}else if(billamount > (200 * 5 * Math.pow(1.04, i)) + (100 * 7.2 * Math.pow(1.04, i)) + (100 * 8.5 * Math.pow(1.04,i)) & billamount <= (200 * 5 * Math.pow(1.04, i)) + (100 * 7.2 * Math.pow(1.04, i)) + (100 * 8.5 * Math.pow(1.04,i)) + (400 * 9 * Math.pow(1.04,i))){
		return 4;
	}else if(billamount > (200 * 5 * Math.pow(1.04, i)) + (100 * 7.2 * Math.pow(1.04, i)) + (100 * 8.5 * Math.pow(1.04,i)) + (400 * 9 * Math.pow(1.04,i))){
		return 5
	}
}
function getLifeSavings(billamount, capacity, cusType) {
	var ftrBillArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
	var ftrSavingsArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

	for (var i = 0; i < ftrSavingsArray.length; i++) {
		ftrBillArray[i] = billamount * Math.pow(1.05, i).toFixed(2);
		ftrSavingsArray[i] = getSavingsFromCap(ftrBillArray[i], capacity, cusType, i) * 12;
	}
	// console.log(ftrBillArray);
	// console.log(ftrSavingsArray);
	return (ftrSavingsArray.reduce((previous, current) => current += previous)- (4.2 * 1000 * capacity * 2) - ((500 * capacity) * 25))/100000;
}

function slabDist(billamount) {
	if(billamount <= 1000){
		return [1, ]
	}
}

function PMT(ir, np, pv, fv, type) {
    /*
     * ir   - interest rate per month
     * np   - number of periods (months)
     * pv   - present value
     * fv   - future value
     * type - when the payments are due:
     *        0: end of the period, e.g. end of month (default)
     *        1: beginning of period
     */
    var pmt, pvif;

    fv || (fv = 0);
    type || (type = 0);

    if (ir === 0)
        return -(pv + fv)/np;

    pvif = Math.pow(1 + ir, np);
    pmt = - ir * pv * (pvif + fv) / (pvif - 1);

    if (type === 1)
        pmt /= (1 + ir);

    return pmt;
}

function netPresentValue(equity, discountFactor, cashflows)
{
	var sum = 0; 
	discountFactor = 0.15;
	for (var i = 0; i < cashflows.length; i++) {
		sum = sum + cashflows[i] /Math.pow((1+discountFactor), i)
	}
    return -equity + sum;
}