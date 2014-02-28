var express = require('express'),
    app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 8080);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
});

app.get('/', function(req, res){
    res.send(200);
});

app.listen(app.set('port'), function(){
    console.log('Server started at port', app.set('port'));
});