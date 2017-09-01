var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
    var connection = mysql.createConnection({
        host: "139.129.166.245",
        port: 3306,
        user: "admin",
        password: "admin",
        database: "swtx"
    });
    connection.connect();
    
    var position = {
        lng: parseFloat(req.query.lng),
        lat: parseFloat(req.query.lat)
    };
    var mode = req.query.mode;

    var sql =  
        'SELECT\
        SportShopGaode.SportShopID,\
        SportShopGaode.SportShopName,\
        SportShopGaode.SportShopAddress,\
        SportShopGaode.SportShopLng,\
        SportShopGaode.SportShopLat,\
        SportShopGaode.SportShopTel,\
        SportShopGaodeScore.Good\
        FROM\
        SportShopGaode\
        INNER JOIN SportShopGaodeScore ON SportShopGaodeScore.SportShopID = SportShopGaode.SportShopID\
        '
    connection.query(sql, function (err, results, fields) {
        if (err) {
            console.log(err);
        } else {
            var within = [];
            var nearest = results.sort(function (a, b) {
                var left = (a.SportShopLng - position.lng) * (a.SportShopLng - position.lng) + (a.SportShopLat - position.lat) * (a.SportShopLat - position.lat);
                var right = (b.SportShopLng - position.lng) * (b.SportShopLng - position.lng) + (b.SportShopLat - position.lat) * (b.SportShopLat - position.lat);
                return (left < right) ? -1 : ((left > right) ? 1 : 0);
            }).slice(0, 5);
            if (mode == 2) {
                nearest = nearest.sort(function (a, b) {
                    return - (a.Good - b.Good);
                })
            }
            res.render("shop-recommand", {shops: nearest});
        }
    })

    connection.end();
});

module.exports = router;
