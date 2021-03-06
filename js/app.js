/*global $ config*/

// Add unique ID to each LI

var clientId = 4; // Starts at 4 because of the 4 initial clients that are populated

function uniqueClientId() {
  clientId += 1;
  return 'client-' + clientId;

};

var stock = {
  price: 0
};

function tickerApi() {

  var d = new Date();
  var month = d.getUTCMonth() + 1; //months from 1-12, months are 0-based
  // var day = d.getUTCDate() - 1; // this works when date is reflecting a day ahead
  var day = d.getUTCDate();
  var year = d.getUTCFullYear();

  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }

  var currentDate = year + "-" + month + "-" + day;

  console.log('currentDate:', currentDate);

  var apiKey = config.API;

  var tickerSymbol = document.getElementById('addClientTicker').value;

  var url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + tickerSymbol + "&interval=1min&fastperiod=10&apikey=" + apiKey;

  //Create a new object to interact with the server
  var xhr = new XMLHttpRequest();

  // Provide 3 arguments (GET/POST, The URL, Async True/False);
  xhr.open('GET', url, false);

  // Once request has loaded...
  xhr.onload = function() {
    // Parse the request into JSON
    var data = JSON.parse(this.response);

    // Log the data object
    console.log(data);

    var lastRefreshed = data['Meta Data']['3. Last Refreshed'];
    stock.price = data['Time Series (1min)'][lastRefreshed]['4. close']

    // stock.price = data['Time Series (Daily)'][currentDate]['1. open']; // original api call

    console.log('stock.price', stock.price);

  };
  // Send request to the server asynchronously
  xhr.send();
}

document.addEventListener('DOMContentLoaded', function() {

  const list = document.querySelector('#client-list ul');


  //delete clients
  list.addEventListener('click', function(e) { // Alert user before deleting client
    if (e.target.className == 'delete') {
      if (confirm('Are you sure you want to delete this client?')) {

        const li = e.target.parentElement.parentElement.parentElement.parentElement;
        // Might not be the best solution, but it works
        list.removeChild(li);

      }
    }
    else {
      return false;
    }

  });

  var addClientBtn = document.getElementById('addClientBtn');

  var consultantInitials = ''; // Initialize consultant initials variable
  var consultantFullName = ''; // Initialize consultant full name variable

  // Set consultant value from toggle in add client section
  addClientBtn.addEventListener('click', function() {

    if (document.getElementById('arnell').parentElement.classList.contains('active')) {
      consultantInitials = 'AM';
      consultantFullName = 'Arnell Milhouse';
      console.log(consultantInitials);
    }

    else if (document.getElementById('reece').parentElement.classList.contains('active')) {
      consultantInitials = 'RF';
      consultantFullName = 'Reece Franklin';
      console.log(consultantInitials);
    }

    tickerApi(); // Run API call

  });

  //add client-list
  const addForm = document.forms['add-client'];

  addForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const tickerValue = addForm.querySelector('#addClientTicker').value; // Add stock ticker
    const firstNameValue = addForm.querySelector('#addClientFirstName').value; // Add client first name
    const lastNameValue = addForm.querySelector('#addClientLastName').value; // Add client last name

    var UniqueID = consultantInitials + tickerValue + firstNameValue + lastNameValue;

    //create li elements
    var li = "<li id='" + UniqueID + "'>" +
      "<div class='consultant'><p>" + consultantInitials + "</p></div>" + // Consultant
      "<div class='stock'>" + tickerValue.toUpperCase() + "</div>" + // Stock Ticker
      "<span class='firstName'>" + firstNameValue + "</span>" + ' ' + // First Name
      "<span class='lastName'>" + lastNameValue + "</span>" + // Last Name
      "<a href='#' data-target='#" + uniqueClientId() + "' data-toggle='collapse' aria-controls='client-" + clientId + "'><i class='seeMore fa fa-chevron-left'></i></a>" + // Client info toggle
      "<div class='btn-group btn-group-toggle' data-toggle='buttons'>" +
      "<label class='btn btn-secondary'>" +
      "<input type='radio' name='options' id='option1' autocomplete='off' checked>" +
      "<i class='fas fa-eye'></i>" + // Watching Button
      "</label>" +
      "<label class='btn btn-secondary active'>" +
      "<input type='radio' name='options' id='option2' autocomplete='off'>" +
      "<i class='fas fa-plus'></i>" + // Purchased Button
      "</label>" +
      "<label class='btn btn-secondary'>" +
      "<input type='radio' name='options' id='option3' autocomplete='off'>" +
      "<i class='fas fa-minus'></i>" + // Sold Button
      "</label>" +
      "</div>" +
      "<span class='stockPrice'>$" + parseFloat(stock.price).toFixed(2) + "</span>" + // Display stock with only 2 decimal points
      "<div class='collapse multi-collapse' id='client-" + clientId + "'>" +
      "<div class='card card-body'>" +
      "<div><i class='fas fa-user-tie'></i>" + ' ' +
      "<p id='consultant'>" + consultantFullName + "</p>" + "</div>" +
      "<div><i class='fas fa-phone'></i>" + ' ' + "<p>(978) 495-0992</p></div>" +
      "<div><i class='fas fa-envelope'></i>" + ' ' + "<p>jordana@yahoo.com</p></div>" +
      "<div><i class='fas fa-location-arrow'></i>" + ' ' + "<p>14 Champlain Dr., Hudson, MA 01749</p></div>" +
      "<div><span class='timeStamp'><p>Created: " + timeStamp() + "</p></span><span class='delete'> X </span></div>" +
      "</div>" +
      "</div>" +
      "</li>";

    $(list).append(li);

  });

  // /<.*?>$/gm



  // Filter clients and tickers in search bar
  const searchBar = document.forms['search-clients'].querySelector('input');
  searchBar.addEventListener('keyup', function(e) {
    const term = e.target.value.toLowerCase();
    const clients = list.getElementsByTagName('li');

    Array.from(clients).forEach(function(client) {
      const title = client.innerText;
      if (title.toLowerCase().indexOf(term) != -1) {
        client.style.display = 'block';
      }
      else {
        client.style.display = 'none';
      }
    });
  });
});



// Animate the LIs
$("#client-list-ul li").each(function(i) {
  $(this).delay(400 * i).fadeIn(800);
});

// Create timestamp for Client Info section
function timeStamp() {
  var now = new Date();

  var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];

  var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

  var suffix = (time[0] < 12) ? "AM" : "PM";

  time[0] = (time[0] < 12) ? time[0] : time[0] - 12;

  time[0] = time[0] || 12;

  for (var i = 1; i < 3; i++) {
    if (time[i] < 10) {
      time[i] = "0" + time[i];
    }
  }
  return date.join("/") + " " + time.join(":") + " " + suffix;
}
