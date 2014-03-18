(function (global) {
    var config = {
        staticServerUrl: 'http://0.0.0.0:8080',
        staticServerUri: 'http://0.0.0.0',
        staticServerPort: 8080,
        oauthServerPort: 8081,
        redirectUri: '&redirect_uri=0.0.0.0:3000/oauth',
        clientId: 'JDO5CUDRLURHK91M2OODFNPVR0HTDDL8B5SJ3POS0JSL8K435312Q7O5TUVCI2A6',
        clientSecret: 'P05LHTCU10TCV2SPMUSMB00LA9KIBHQ2NGQ6AMS9BVKIT535K6D9CDCJN2795PFF'
    }
    
    global.APP_CONFIG = (global.module || {}).exports = config;
})(this);