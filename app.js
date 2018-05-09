var express = require('express')
var app = express()
 
var mysql = require('mysql')
var geoSearch = require('./geoSearch'); 

var myConnection  = require('express-myconnection')

var config = require('./config')
var dbOptions = {
    host:      config.database.host,
    user:       config.database.user,
    password: config.database.password,
    port:       config.database.port, 
    database: config.database.db
}

app.use(express.static('public'));
app.use(myConnection(mysql, dbOptions, 'pool'))
app.set('view engine', 'ejs')
 

var expressValidator = require('express-validator')
app.use(expressValidator())
 
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
 
 
// PRINCIPAL 
app.get('/', function(req, res) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM Restaurants', function(err, rows, fields) {
            if (err) {
                alert(err);
            } else {
                //Render
                res.render('index', {
                    title: 'Restaurants', 
                    data: rows
                })
            }
        })
    })
}); 

// Agregar Nuevo  
app.get('/add', function(req, res) {
    res.render('add');
});

// POST Para agregar restaurante
app.post('/add', function(req, res) {
    req.getConnection(function(error, conn) {

            // Limpiar 
             var newRest = {
                name: req.sanitize('name').escape().trim(),
                site: req.sanitize('site').escape().trim(),
                email: req.sanitize('email').escape().trim(),
                city: req.sanitize('city').escape().trim(),
                street: req.sanitize('street').escape().trim(),
                state: req.sanitize('state').escape().trim(),
                lat: req.sanitize('lat').escape().trim(),
                lng: req.sanitize('long').escape().trim(),
                phone: req.sanitize('phone').escape().trim(),
                rating: req.sanitize('rating').escape().trim()
            }; 

            conn.query('INSERT INTO Restaurants SET ?', newRest, function(err, result) {
                if (err) {
                    console.log(err);
                } else {                                    
                    res.render('add');
                }
            })
        })
});

// EDIT
app.get('/edit/:id', function(req, res) {
    var id = req.params.id; 
    req.getConnection(function(error, conn) { 
        conn.query('SELECT * FROM Restaurants WHERE id = ?', id, function(err, rows, fields) {
            if (err) {
                console.log(err);
            } else {
                //Render
                res.render('edit', {
                    title: 'Restaurant',
                    data: rows, 
                    id: id
                });
            }
        })
     });
});

// EDIT POST
app.post('/edit', function(req, res) {
    req.getConnection(function(error, conn) {
            // Limpiar 
            var id = req.sanitize('id').escape().trim();
            var newRest = {
                name: req.sanitize('name').escape().trim(),
                site: req.sanitize('site').escape().trim(),
                email: req.sanitize('email').escape().trim(),
                city: req.sanitize('city').escape().trim(),
                street: req.sanitize('street').escape().trim(),
                state: req.sanitize('state').escape().trim(),
                lat: req.sanitize('lat').escape().trim(),
                lng: req.sanitize('long').escape().trim(),
                phone: req.sanitize('phone').escape().trim(),
                rating: req.sanitize('rating').escape().trim()
            }; 

            conn.query(`UPDATE Restaurants SET ? WHERE id = ${id}`, newRest, function(err, result) {
                if (err) {
                    console.log(err);
                } else {                                    
                    res.redirect(`/edit/${id}`);
                }
            })
        })
});

//For getting the async data from the promise. Node. 
async function getRestaurants(lat,lng, r, response) {
    var result = await geoSearch(lat,lng, r);
    console.log(result);
    response.send(JSON.stringify(result));
};

// /restaurants/statistics?latitude=x&longitude=y&radius=z
app.get('/restaurants/statistics/', function(req, res) {
    var {latitude, longitude, radius} = req.query;
    // Limpiar y validar parametros 
    if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
        // NOT VALID 
        res.send(JSON.stringify({error: "Invalid values"}));
    } else {
        getRestaurants(latitude, longitude, radius, res); 
    }
    
});

app.post('/delete', function(req, res) {
    var id = req.body.id; 
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM Restaurants WHERE id = ?', id, function(err, result) {
            //if(err) throw err
            if (err) {
                console.log(err);
            } else {                                    
                res.send(true);
            }
        });
    });
        
});

app.listen(process.env.PORT || 3000, function(){
    console.log('Server running at port 3000: http://127.0.0.1:3000')
})