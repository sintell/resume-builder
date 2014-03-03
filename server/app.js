var express = require('express'),
    https = require('https'),
    app = module.exports = express();

app.configure(function(){
    app.set("client_id", "JDO5CUDRLURHK91M2OODFNPVR0HTDDL8B5SJ3POS0JSL8K435312Q7O5TUVCI2A6");
    app.set("client_secret", "P05LHTCU10TCV2SPMUSMB00LA9KIBHQ2NGQ6AMS9BVKIT535K6D9CDCJN2795PFF");

    app.use(express.cookieParser('secret'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
});

app.get('/oauth', function(req, res){
    var authCode, error;
    
    error = req.query.error;
    if (typeof(error) !== "undefined"){
        console.log("error:", error);
        res.send(403);
        return;
    };
    
    authCode = req.query.code;
    if (typeof(authCode) == "undefined"){
        res.redirect("https://m.hh.ru/oauth/authorize?response_type=code&client_id="+app.set("client_id"));  
        return;      
    };


    var postString = "grant_type=authorization_code&client_id="+app.set("client_id")+"&client_secret="+app.set("client_secret")+
    "&code="+authCode;
    var postOptions = {
        hostname: 'm.hh.ru',
        port: 443,
        path: '/oauth/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': postString.length
      }
    }

    var postRequest = https.request(postOptions, function(postResponse){
        postResponse.on('data', function (chunk) {
            var data = JSON.parse(chunk);
            if (typeof(data["error"]) !== "undefined"){
                //TODO: improve error handling
                res.send(500);
            };
            res.cookie('access_token',data["access_token"], { maxAge: 900000 });
            res.cookie('refresh_token',data["refresh_token"], { maxAge: 900000 });
            console.log('BODY: ' + chunk);
            console.log('BODY: ' + data.access_token);
            res.redirect("http://0.0.0.0:8080/");
            return;
        });
    });
    postRequest.on("error", function(err){
        console.log(err);
    });

    postRequest.write(postString);
    postRequest.end();

});
