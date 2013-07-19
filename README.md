ez2
===

EZ2 is a simplified web console for Amazon EC2 console. Currently it has provisions to create, start, stop and terminate instances.

INSTALLATION
============

NODE.JS
-------

The first step is to install Node.js if it is not there. Either directly or using a package manager

http://nodejs.org/download/
https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

Next is to use the Node package manager, 'npm install <plugin-name>' or 'npm update'. These are the list of plugins required to run the app:

- authom
- aws-sdk
- connect-redis
- express
- jade
- redis
- stylus

http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/installing.html for the aws-sdk info. NOTE: Install the plugins in the repo main directory.

REDIS
-----

Secondly is to install redis. Follow http://redis.io/download and http://redis.io/topics/quickstart, particularly 'Installing Redis more properly', to quickly bootstrap the database.
NOTE: the last instruction needs to use sudo, 'sudo /etc/init.d/redis_6379 start'.

CONFIGURATION
=============

Thirdly, edit config.json and put in the required key and secret, as well as the desired region. config.js contains the settings for the googleplus login and certain ec2 parameters.

EXECUTION
=========

Run 'node app' to start the application. Confirm with accessing the selected region and checking the EC2 instances in the Amazon console.