var daemonize = require('daemonize2'),
    path = require('path'),
    cwd = path.join(__dirname, '../');

// Setup module.exports
var daemon = module.exports = {};

// Setup opts
var masterDaemon = daemonize.setup({
    main : '../index.js',
    argv : '-master',
    name : 'overseer-master'
});
var clientDaemon = daemonize.setup({
    main : '../index.js',
    argv : '-client',
    name : 'overseer-client'
});

daemon.startClient = function() {
    clientDaemon.start().once('started', function() {
        process.exit();
    });
};

daemon.stopClient = function() {
    clientDaemon.kill();
}

daemon.restartClient = function() {
    if (clientDaemon.status()) {
        clientDaemon.stop().once("stopped", function() {
            clientDaemon.start().once("started", function() {
                process.exit();
            });
        });
    } else {
        clientDaemon.start().once("started", function() {
            process.exit();
        });
    }
};

daemon.startMaster = function() {
    masterDaemon.start().once('started', function() {
        process.exit();
    });
};

daemon.stopMaster = function() {
    masterDaemon.kill();
}

daemon.restartMaster = function() {
    if (masterDaemon.status()) {
        masterDaemon.stop().once("stopped", function() {
            masterDaemon.start().once("started", function() {
                process.exit();
            });
        });
    } else {
        masterDaemon.start().once("started", function() {
            process.exit();
        });
    }
};