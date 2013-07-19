ez2
===

EZ2 is a simplified web console for Amazon EC2 console. Currently it has provisions to create, start, stop and terminate instances.

## DEPENDENCIES

Install the dependencies below before you get started.

- [Node.JS](nodejs.org) (comes with NPM)
- [Redis](http://redis.io/)


## INSTALLATION

Clone the project and execute command below in your terminal in the project folder.

```
 $ npm install
```

## CONFIGURATION

Edit config.json and put in the required key and secret, as well as the desired region. config.js contains the settings for the googleplus login and certain ec2 parameters.

## EXECUTION

Run 'node app' to start the application. Confirm with accessing the selected region and checking the EC2 instances in the Amazon console.