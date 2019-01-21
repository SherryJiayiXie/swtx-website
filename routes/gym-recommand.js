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
        GymGaode.GymID,\
        GymGaode.GymName,\
        GymGaode.GymAddress,\
        GymGaode.GymTel,\
        GymGaode.GymLat,\
        GymGaode.GymLng,\
        GymGaodeScore.ScoreGoodNum\
        FROM\
        GymGaode\
        INNER JOIN GymGaodeScore ON GymGaodeScore.ScoreGymID = GymGaode.GymID\
        '
    connection.query(sql, function (err, results, fields) {
        if (err) {
            console.log(err);
        } else {
            var within = [];
            var nearest = results.sort(function (a, b) {
                var left = (a.GymLng - position.lng) * (a.GymLng - position.lng) + (a.GymLat - position.lat) * (a.GymLat - position.lat);
                var right = (b.GymLng - position.lng) * (b.GymLng - position.lng) + (b.GymLat - position.lat) * (b.GymLat - position.lat);
                return (left < right) ? -1 : ((left > right) ? 1 : 0);
            }).slice(0, 5);
            if (mode == 2) {
                nearest = nearest.sort(function (a, b) {
                    return - (a.ScoreGoodNum - b.ScoreGoodNum);
                })
            }
            res.render("gym-recommand", {gyms: nearest});
        }
    })

    connection.end();
});

module.exports = router;
