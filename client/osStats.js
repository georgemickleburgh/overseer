var os = require('os'),
    async = require('async'),
    child_process = require('child_process');

var runDiskSpaceCheck = function(callback) {
    // Execute df -k on the root drive, which will return hard drive information
    child_process.exec("df -k '/'", function(err, stdout, stderr) {
        if (err) {
            console.log(err);
        } else {
            var lines = stdout.trim().split("\n");

            // Deal with the returned strings
            var strDiskInfo = lines[lines.length - 1].replace( /[\s\n\r]+/g,' ');
            var diskInfo = strDiskInfo.split(' ');

            // Run the callback
            callback && callback(diskInfo[1], diskInfo[3], diskInfo[2])
        }
    });
};

/**
 * Our accessible OS stats go here
 */
osStats = function(returnCallback) {
    var diskSpace = {};

    // Run tasks in parallel before returning all of the OS values
    async.series([
            function(callback) {
                runDiskSpaceCheck(function(total, free, used) {
                    diskSpace.total = total;
                    diskSpace.free = free;
                    diskSpace.used = used;

                    callback(null, 'diskspace');
                });
            }
        ], function(callback) {
            // Return all of the operating system values
            returnCallback({
                os: {
                    type: os.type(),
                    platform: os.platform(),
                    arch: os.arch(),
                    release: os.release()
                },
                network: {
                    hostname: os.hostname(),
                    interfaces: os.networkInterfaces()
                },
                cpu: {
                    cpu: os.cpus(),
                    load: os.loadavg()
                },
                memory: {
                    total: os.totalmem(),
                    free: os.freemem(),
                    used: os.totalmem() - os.freemem()
                },
                disk: {
                    total: diskSpace.total,
                    free: diskSpace.free,
                    used: diskSpace.used
                }
            });
        });
};

function getReadableBytes(fileSizeInBytes) {
    var i = -1;
    var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
};

module.exports = osStats;