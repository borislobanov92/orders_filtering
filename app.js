// Тут напишите свою программу
function startApp () {
	fillTable1();
	fillTable2();
	fillTable3();
	fillTable4();
}


function fillTable1 () {
	document.querySelector("#total-sum").innerHTML = getTotalSum(ordersList) + ' руб.';
	document.querySelector("#total-orders").innerHTML = ordersList.length;
	document.querySelector("#total-recommended").innerHTML = getTotalRecommended(ordersList) + ' руб.';
	document.querySelector("#total-typical").innerHTML = getTotalTypical(ordersList) + ' руб.';
	document.querySelector("#total-customers").innerHTML = getTotalCustomers(ordersList);
	document.querySelector("#total-without-recommended").innerHTML = getTotalWithoutRecommended(ordersList);
	document.querySelector("#total-without-typical").innerHTML = getTotalWithoutTypical(ordersList);
}

function getTotalSum (array) {
	var total = 0;
	for (var i = 0, l = array.length; i < l; ++i) {
		total += array[i]["total"];
	}
	return total;
}

function getTotalRecommended (array) {
	var total = 0;
	for (var i = 0, l = array.length; i < l; ++i) {
		total += array[i]["recommended"];
	}
	return total;
}

function getTotalTypical (array) {
	var total = 0;
	for (var i = 0, l = array.length; i < l; ++i) {
		total += array[i]["typical"];
	}
	return total;
}

function getTotalCustomers (array) {
	var customers = [];
	for (var i = 0, l = array.length; i < l; ++i) {
		customers.push(array[i]["user_id"]);
	}
	
	var uniqueCustomers = customers.filter(function(value, index, list){
		return list.indexOf(value) == index;
	});

	return uniqueCustomers.length;
}

function getTotalWithoutRecommended (array) {
	var withoutRecommended = ordersList.filter(function(order){
		return order.recommended == 0;
	});

	return withoutRecommended.length;
}

function getTotalWithoutTypical (array) {
	var onlyRecommended = ordersList.filter(function(order){
		return order.typical == 0;
	});

	return onlyRecommended.length;
}

function fillTable2 () {
	var filtered = filterOrdersByDate(5, 26, 5, 28)
	document.querySelector("#total-sum-within-period").innerHTML = getTotalSum(filtered) + ' руб.';
	document.querySelector("#total-orders-within-period").innerHTML = filtered.length;
	document.querySelector("#total-customers-within-period").innerHTML = getTotalCustomers(filtered);
	document.querySelector("#total-recommended-within-period").innerHTML = getTotalRecommended(filtered) + ' руб.';
}

function convertTimestamp (timestamp) {
	return new Date( timestamp * 1000 );
}

function formatDate (timestamp) {
	var date = convertTimestamp(timestamp);
	var formatted = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
	return formatted;
}

function filterOrdersByDate(monthFrom, dayFrom, monthTo, dayTo) {
	// Месяца необходимо указывать в UTC формате (январь - 0, февраль - 1 и т.д.)
	var filtered = ordersList.filter(function(order) {
		var date = convertTimestamp(order.timestamp);
		return (date.getMonth() >= monthFrom && date.getDate() >= dayFrom && date.getMonth() <= monthTo && date.getDate() <= dayTo);
	});

	return filtered;
}


function fillTable3 () {
	// Строим строки html, как в таблице со студентами, и добавляем в tbody
	var table = document.querySelector('#most-expensive');
	var tbody = table.querySelector('tbody');
	var template = '<tr><td>#date#</td><td>#order_id#</td><td>#customer_id#</td><td>#total#</td><td>#typical#</td><td>#recommended#</td></tr>';
	var HTML = '';
	var orders = sortOrders(ordersList, 'total');

	for (var i = 0; i < 5; ++i) {
		var temp = template;

		temp = temp.replace('#date#', formatDate(orders[i].timestamp));
		temp = temp.replace('#order_id#', orders[i].id);
		temp = temp.replace('#customer_id#', orders[i].user_id);
		temp = temp.replace('#total#', orders[i].total + ' руб.');
		temp = temp.replace('#typical#', orders[i].typical + ' руб.');
		temp = temp.replace('#recommended#', orders[i].recommended + ' руб.');

		HTML += temp;
	}

	tbody.innerHTML = HTML;
} 

function sortOrders (array, prop) {
	// Сортируем по убыванию!
	var sorted = array.sort(function(a, b) {
		if (a[prop] > b[prop]) return -1;

	    if (a[prop] < b[prop]) return 1;

	    return 0;
	});

	return sorted;
}

function fillTable4 () {
	var table = document.querySelector('#frequent-customers');
	var tbody = table.querySelector('tbody');
	var template = '<tr><td>#customer_id#</td><td>#orders#</td></tr>';
	var HTML = '';

	var customers = frequentCustomers(ordersList);
	var frequent = [];

	for (var prop in customers) {
	    if (customers[prop] > 10) {
	    	frequent.push([prop, customers[prop]]);
	    }
	}

	for (var i = 0, l = frequent.length; i < l; ++i) {
		var temp = template;

		temp = temp.replace('#customer_id#', frequent[i][0]);
		temp = temp.replace('#orders#', frequent[i][1]);

		HTML += temp;
	}

	tbody.innerHTML = HTML;
}

function frequentCustomers (array) {
	var customers = {};

	for (var i = 0, l = array.length; i < l; ++i) {

		if (customers['' + array[i]['user_id']] == undefined) {
			customers['' + array[i]['user_id']] = 1;
		}
		else customers['' + array[i]['user_id']]++;
	};

	return customers;
}

function fillTable5 () {

	var requestedId = document.querySelector('#customer-id').value;

	if (isNaN(parseInt(requestedId))) {
		alert('ID покупателя должно быть числом');
		return false;
	}

	var table = document.querySelector('#customer-by-id');
	var tbody = table.querySelector('tbody');
	var template = '<tr><td>#date#</td><td>#order_id#</td><td>#total#</td><td>#typical#</td><td>#recommended#</td></tr>';
	var HTML = '';
	
	var customerOrders = ordersList.filter(function(customer) {
		return customer['user_id'].toString() == requestedId;
	});

	for (var i = 0, l = customerOrders.length; i < l; ++i) {
		var temp = template;

		temp = temp.replace('#date#', formatDate(customerOrders[i].timestamp));
		temp = temp.replace('#order_id#', customerOrders[i].id);
		temp = temp.replace('#total#', customerOrders[i].total + ' руб.');
		temp = temp.replace('#typical#', customerOrders[i].typical + ' руб.');
		temp = temp.replace('#recommended#', customerOrders[i].recommended + ' руб.');

		HTML += temp;
	}

	tbody.innerHTML = HTML;
}

