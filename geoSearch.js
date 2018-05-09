var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  database: "restaurantes",
  user: "root",
  password: "root"
});

con.connect(function(err) {
  if (err) console.log(err);
 	 console.log("Connected!");
});

//For the getDistance function
var deg2rad = function (deg) {
  return deg * (Math.PI/180)
};

// Little class for points
class LatLngPoint {
	constructor(lat, lng) {
		this.lat = lat; 
		this.lng = lng; 
	}

	/**
	 * Get the distance in meters between 2 points in lat lng. 
	 */
	getDistance(point) {
		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(point.lat-this.lat);  // deg2rad below
		var dLon = deg2rad(point.lng-this.lng); 
		var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(this.lat)) * Math.cos(deg2rad(point.lat)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2)
		; 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c; // Distance in km
		return d;
	}
}

/**
 * Calculates the standard deviation
 */
var calcStd = function(arr, mean) {
	var sum = 0; 
	var N = arr.length; 
	for (let i = 0; i < N; i++) {
		sum += Math.pow(arr[i] - mean, 2);
	}

	return (N > 0) ? sum/N : 0;
};
/**
 * Returns an array of restaurant objects that falls
 * inside the circle with center (lat, lng) and radius r. 
 * Basically if the distance between the center and a 
 * point p is greater than the radius then the point is 
 * not within the circle. 
 */
function geoSearch(lat,lng, r) {
	// Main promise for getting data
	return new Promise(resolve => {
		// EVERYONE! 
		con.query('SELECT * FROM Restaurants', function(err, rows, fields) {
	        if (err) {
	            console.log(err);
	        } else {
	        	//Total of restaurants 
	        	var count = 0; 
	        	//Sum rating
	        	var sumRatings = 0; 
	        	// For calculating the standard deviation
	        	var ratings = []; 
	        	// Center of the circle 
	        	var center = new LatLngPoint(lat, lng);
	        	for (let i = 0; i < rows.length; i++) {
	        		var rest = rows[i];
	        		//Special case values not numbers. Not necessary if the DB data is valid. 
	        		if (isNaN(rest.lat) || isNaN(rest.lng))
	        			continue; 

	        		// console.log(rest);
	        		var p1 = new LatLngPoint(rest.lat, rest.lng);

	        		if (center.getDistance(p1) <= r) {
	        			//Falls within the cirlce. 
	        			count ++;
	        			sumRatings += rest.rating;
	        			ratings.push(rest.rating);
	        		}
	        	}

	        	//The average avoiding /0 
	        	var avg = (count > 0) ? sumRatings/count : 0; 
	        	resolve({
	        		count: count, 
	        		avg: avg, 
	        		std: calcStd(ratings, avg)
	        	});
	        }
	    });
	});
		 
};

module.exports = geoSearch;