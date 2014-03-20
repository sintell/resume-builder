(function() {
    var config = {
        serverHost: 'http://0.0.0.0',
        staticServerUrl: 'http://0.0.0.0:8080',
        staticServerPort: 8080,
        oauthServerPort: 8081,
        redirectUri: '',
        clientId: 'JDO5CUDRLURHK91M2OODFNPVR0HTDDL8B5SJ3POS0JSL8K435312Q7O5TUVCI2A6',
        clientSecret: 'P05LHTCU10TCV2SPMUSMB00LA9KIBHQ2NGQ6AMS9BVKIT535K6D9CDCJN2795PFF'
    }
    

    if (typeof define !== 'undefined') {
        define([], function() {
            return config;    
        });
    } else {
        module.exports = config;
    }
    return config;
}());