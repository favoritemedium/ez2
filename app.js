
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , instances = require('./routes/instance')
  , http = require('http')
  , path = require('path');

// pass the express to the connect redis module
// allowing it to inherit from express.session.Store
var RedisStore = require('connect-redis')(express);

var app = express();

var auth = require('./helpers/auth')(app);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(auth.middleware);
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(express.session({ store: new RedisStore }));

app.get('/auth/:service', auth.app)

app.get('/', routes.index);
app.get('/logout', routes.logout);

/* Routes for instances */
app.get('/instances', auth.guard, instances.list);
app.get('/instances/create', auth.guard, instances.create);
app.post('/instances/create', auth.guard, instances.save);
app.get('/instances/start/:id', instances.start);
app.get('/instances/stop/:id', instances.stop);
app.get('/instances/snapshot/:id', instances.snapshot);
app.get('/instances/terminate/:id', auth.guard, instances.terminate)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
