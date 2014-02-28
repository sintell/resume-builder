var express = require('express'),
    app = module.exports = express();

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
});

app.get('/', function(req, res){
    res.send(200);
});
