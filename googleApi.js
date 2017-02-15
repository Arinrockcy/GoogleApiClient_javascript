var pHeader = {"alg":"RS256","typ":"JWT"}
var sHeader = JSON.stringify(pHeader);
var pClaim = {};
pClaim.aud = "https://www.googleapis.com/oauth2/v3/token";
pClaim.scope = "https://www.googleapis.com/auth/analytics.readonly";
pClaim.iss = "adgm-535@api-project-156608.iam.gserviceaccount.com";
pClaim.exp = KJUR.jws.IntDate.get("now + 1hour");
pClaim.iat = KJUR.jws.IntDate.get("now");
var IDS = 'Client id: ex: ga:xxxxxxx'; 
var sClaim = JSON.stringify(pClaim);
var key = "private key , get from you google service account";
var sJWS = KJUR.jws.JWS.sign(null, sHeader, sClaim, key);


var XHR = new XMLHttpRequest();
var urlEncodedData = "";
var urlEncodedDataPairs = [];

urlEncodedDataPairs.push(encodeURIComponent("grant_type") + '=' + encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer"));
urlEncodedDataPairs.push(encodeURIComponent("assertion") + '=' + encodeURIComponent(sJWS));
urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

// We define what will happen if the data are successfully sent
XHR.addEventListener('load', function(event) {
    var response = JSON.parse(XHR.responseText);
    token = response["access_token"];
	
});

// We define what will happen in case of error
XHR.addEventListener('error', function(event) {
    console.log('Oops! Something went wrong.');
});

XHR.open('POST', 'https://www.googleapis.com/oauth2/v3/token');
XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
XHR.send(urlEncodedData);	




gapi.analytics.ready(function() {

  
  
var access_tye='offline';


loadDoc(token);
  
  gapi.analytics.auth.authorize({
    serverAuth: {
      access_token: token
    }
  });
//Returning visitors Vs new visitors
 var Visits = new gapi.analytics.googleCharts.DataChart({
    reportType: 'ga',
    query: {
      'ids': IDS,
      
  'metrics': 'ga:percentNewSessions,ga:sessions',
   'dimensions': 'ga:week',
   'filters':'ga:pagePath==/doing-business/registration-authority/business-directory/company-search/,ga:pagePath==/doing-business/registration-authority/business-directory/admin/',
    'start-date': '30daysAgo',
      'end-date': '1daysAgo',
    },
    chart: {
      type: 'LINE',
      container: 'VisitsAndNewvisits',
	  options: {width: '355'}
    }
  });
  Visits.execute();
  
 
//visit and avg visit duration by country
  
  var region = new gapi.analytics.googleCharts.DataChart({
    reportType: 'ga',
    query: {
      'ids': IDS,
  'metrics': 'ga:sessionDuration,ga:avgSessionDuration',
     'dimensions': 'ga:country',
	 'filters':'ga:pagePath==/doing-business/registration-authority/business-directory/company-search/,ga:pagePath==/doing-business/registration-authority/business-directory/admin/',
    'start-date': '30daysAgo',
      'end-date': '1daysAgo',
    },
    chart: {
      type: 'TABLE',
      container: 'VisitsByRegion',
	  options: {width: '100%'}
    }
  });
region.execute();
  
  
    
	//Average Session Duration
var avgduration = new gapi.analytics.googleCharts.DataChart({
    reportType: 'ga',
    query: {
      'ids': IDS,
      
  'metrics': 'ga:avgSessionDuration',
  'dimensions': 'ga:week',
  'filters':'ga:pagePath==/doing-business/registration-authority/business-directory/company-search/,ga:pagePath==/doing-business/registration-authority/business-directory/admin/', 
   
    'start-date': '30daysAgo',
      'end-date': '1daysAgo',
    },
    chart: {
      type: 'LINE',
      container: 'AvgDuration',
	  options: {width: '350'}
    }
  });
  avgduration.execute();	
  
  //Visit by traffic type
  var data = new gapi.analytics.googleCharts.DataChart({
    reportType: 'ga',
    query: {
      'ids': IDS,
      
  'metrics': 'ga:users',
	'dimensions': 'ga:organicSearches',
   'dimensions': 'ga:socialNetwork',
   'dimensions': 'ga:referralPath',
   'dimensions': 'ga:source',
    
  'filters':'ga:pagePath==/doing-business/registration-authority/business-directory/company-search/,ga:pagePath==/doing-business/registration-authority/business-directory/admin/', 
   
    'start-date': '30daysAgo',
      'end-date': '1daysAgo',
    },
    chart: {
      type: 'PIE',
      container: 'TrafficType',
	  options: {width: '350',legend: { position: 'bottom', alignment: 'start' }}
    }
  });
  data.execute();
  
   
  
  
 /*  window.addEventListener('resize', function() {
    Visits.execute();
	avgduration.execute();
  Bounces.execute();
region.execute();
mobileviews.execute();
conversionrate.execute();
  });*/
});


function loadDoc(token) {

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		 var realtime = JSON.parse(this.responseText);
		// document.getElementById("ActiveVisitors").innerHTML =realtime['totalsForAllResults']['rt:activeUsers'];
       }
		 
  };
  var api='api-project-156608';
var url="https://www.googleapis.com/analytics/v3/data/realtime?ids="+IDS+"&metrics=rt%3AactiveUsers&access_token="+token+""
  xhttp.open("GET", url, true);
  //xhttp.send();
} 
