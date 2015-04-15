overseer
========

overseer is a monitoring tool for Linux/Mac OS X which is designed as a dashboard for multiple servers.

It consists of both a master and client CLI application, which start servers to monitor the current state of various
server stats, such as Memory, Disk Space and CPU Load.

### Installation

Install this module via NPM:

```bash
npm install -g overseer
```

### How to use

The client server must be run on every server which needs to be monitored:

```bash
sudo overseer start client
```

The master server runs the actual monitoring dashboard:

```bash
sudo overseer start master
```

(the master and client servers can be run on the same server, if you want to monitor that server)

Now, visit the overseer master server's URL via port 34747 (i.e. http://localhost:34747).

### Configuration

Once the master server has been run for the first, it will create a file in a new .overseer directory within the local user directory. For example:

```bash
~/.overseer/config.json
```

The will contain a JSON array of the servers which will be monitored by overseer. Any changes to this document should be reflected instantly on the master server, but if there are any issues, it should be restarted.

![Example](https://github.com/earthly/overseer/blob/master/docs/screenshots/example-master.png "Example setup")
