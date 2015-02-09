var PusherClient = require('pusher-node-client').PusherClient;
var libnotify = require('libnotify');

var argsList = [
        'appId',
        'key',
        'secret'
    ],
    args = {},
    tmp = '';

process.argv.forEach(function (arg, i, array) {
    if (arg.indexOf('--') != -1) {
        tmp = arg.split('=');
        args[tmp[0].replace('--', '')] = tmp[1];
    }
});

argsList.forEach(function (a) {
    if (args[a] == undefined) {
        console.error('Argument "--' + a + '" is not set');
        process.exit();
    }
});

var pres, pusher_client;
pusher_client = new PusherClient(args);
pres = null;

pusher_client.on('connect', function() {
    console.log('connected');
    pres = pusher_client.subscribe("collaborator");
    return pres.on('build-complete', function(data) {
        console.log('data', data);
        libnotify.notify(data.message, {
            time: 5000
        });
    });
});

pusher_client.connect();
