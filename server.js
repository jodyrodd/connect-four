var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    uuid = require('uuid'),
    morgan = require('morgan'),
    pg = require('pg'),
    bodyParser = require('body-parser');

var app = express();
var staticRoot = __dirname + '/';

var connectionString = process.env.DATABASE_URL || 'postgres://game:password123!@localhost:5432/postgres';

app.use(morgan('combined'));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(staticRoot));

app.post("/api/board", function(req, res) {
    const results = [];
    const data = {uuid: uuid.v4(), currentPlayer: null};
    pg.connect(connectionString, (err, client, done) => {
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        client.query('INSERT INTO game_boards(uuid) values($1)', [data.uuid]);
        const query = client.query('SELECT * FROM game_boards WHERE uuid=$1', [data.uuid]);

        query.on('row', (row) => {
            results.push(row);
        });
        query.on('end', () => {
            done();
            return res.json(results[0]);
        });
    });
});

app.get("/api/board/:id", function(req, res) {
    const results = [];
    pg.connect(connectionString, (err, client, done) => {
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        const query = client.query('SELECT * FROM game_boards WHERE uuid=$1', [req.params.id]);

        query.on('row', (row) => {
            results.push(row);
        });
        query.on('end', () => {
            done();
            return res.json(results[0]);
        });
    });
});

app.put("/api/board/:id", function(req, res) {
    const results = [];
    const data = {
        current_player: req.body.current_player,
        rows: req.body.rows
    };
    pg.connect(connectionString, (err, client, done) => {
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        client.query('UPDATE game_boards set current_player=($1), rows=($2) where uuid=($3)',
            [data.current_player, data.rows, req.params.id]);
        const query = client.query('SELECT * FROM game_boards WHERE uuid=$1', [req.params.id]);

        query.on('row', (row) => {
            results.push(row);
        });
        query.on('end', () => {
            done();
            return res.json(results[0]);
        });
    });
});

app.use(function(req, res, next){

    // if the request is not html then move along
    var accept = req.accepts('html', 'json', 'xml');
    if(accept !== 'html'){
        return next();
    }

    // if the request has a '.' assume that it's for a file, move along
    var ext = path.extname(req.path);
    if (ext !== ''){
        return next();
    }

    fs.createReadStream(staticRoot + 'index.html').pipe(res);

});

app.listen(app.get('port'), function() {
    console.log('app running on port', app.get('port'));
});