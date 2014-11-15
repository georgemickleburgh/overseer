// Ensure we have the flag argument
if (process.argv.length > 2) {
    if (process.argv[2] == '-master') {
        // Run the master server
        var master = require('./master');
        master.startServer();
    }
    else if (process.argv[2] == '-client') {
        // Run the client server
        var client = require('./client');
        client.startServer();
    } else {
        console.log('Please specify either -master or -client');
    }
} else {
    console.log('Please specify either -master or -client');
}