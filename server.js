'use strict';

require("6to5/register");

var express  = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    csrf         = require('csurf'),
    session      = require('express-session'),
    state        = require('express-state'),
    compression  = require('compression'),

    mongoose     = require('mongoose'),

    hbs          = require('./lib/exphbs'),
    middleware   = require('./middleware'),
    config       = require('./config'),

    passport     = require('passport'),
    auth         = require('./auth'),

    routesStandard = require('./routes/standard'),
    routesAuth = require('./routes/auth'),
    routesAPI = require('./routes/api'),

    port         = (process.env.PORT || 8000);


mongoose.connect('mongodb://' +
    process.env.CONTACTLENS_MONGODB_USER +
    ':' +
    process.env.CONTACTLENS_MONGODB_PASSWORD +
    '@' +
    process.env.CONTACTLENS_MONGODB_HOST +
    ':' +
    process.env.CONTACTLENS_MONGODB_PORT +
    '/' +
    process.env.CONTACTLENS_MONGODB_DB
);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', setupServer);


function setupServer () {
    var app = express(),
        server = app.listen(port, function () {
            console.log("Contact Lens is now listening on port " + server.address().port);
        });


    state.extend(app);
    app.set('state namespace', 'App');


    app.engine(hbs.extname, hbs.engine);
    app.set('view engine', hbs.extname);
    app.set('views', config.dirs.views);
    app.enable('view cache');


    if (app.get('env') === 'development') {
      app.use(middleware.logger('tiny'));
    }


    app.use(compression());
    app.use(express.static(config.dirs.pub));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000,
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    auth.serialization();
    auth.Google();

    //app.use(csrf());
    app.use(function (req, res, next) {
        //var token = req.csrfToken();
        //res.cookie('XSRF-TOKEN', token);
        //res.locals._csrf = token;
        // app.expose(token, 'Data._csrf');
        app.expose(req.user, 'Data.user');
        next();
    });

    app.use(middleware.exposeTemplates());
    app.use(middleware.exposeContacts());

    app.use(express.Router());

    app.use('/', routesStandard);
    app.use('/auth', routesAuth);
    app.use('/api', routesAPI);


    // Error handling middleware
    app.use(function (req, res) {
        res.status(404);

        app.expose(true, 'Data.status404');

        if (req.accepts('html')) {
            res.render('404', { url: req.url });
        } else if (req.accepts('json')) {
            res.send({ error: 'Not found' });
        } else {
          res.type('txt').send('Not found');
        }
    });

    return server;
}

