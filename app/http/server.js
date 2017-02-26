"use strict";
exports.build = function(callback)  {
    // HTTP Dependencies
    require(__dirname + "/passport")(Application.Libraries.Passport);
    Application.Servers.Website.use(Application.Libraries.Compress());
    Application.Servers.Website.use(Application.Libraries.Body.urlencoded({ extended: true}));
    Application.Servers.Website.use(Application.Libraries.Body.json());
    Application.Servers.Website.use(Application.Libraries.Cookie());

    // Redis Sessions
    Application.Servers.Website.use(Application.Libraries.Session({ store : new Application.Libraries.Redis(), saveUninitialized: false, resave: false, secret: 'it*SFVse', ttl : 3600, cookie: { maxAge: 3600000 * 24 * 7 }}));
    Application.Servers.Website.use(Application.Libraries.Passport.initialize());
    Application.Servers.Website.use(Application.Libraries.Passport.session());
    Application.Servers.Website.use(Application.Libraries.Flash());

    // HTTP Settings
    Application.Servers.Website.group = require('express-group');
    Application.Servers.Website.set('views', Application.Info.Root + '/public');
    if (Application.Info.Mode == 'Development') {
        Application.Servers.Website.set('view cache', false);
    } else {
        Application.Servers.Website.set('view cache', true);
    }
    Application.Servers.Website.set('view engine', 'ejs');
    Application.Servers.Website.use(Application.Libraries.Express.static(Application.Info.Root + "/public/assets", { index : "index.html" }));

    // HTTP Controllers
    Application.Libraries.Async.series([
        Application.Controllers.HTTP.load_middleware,
        Application.Controllers.HTTP.load_controllers
    ], function(errors, messages) {
        Application.Servers.Website.listen(80, "0.0.0.0");
        callback(null, 'Web server is running');
    });
};


exports.load_middleware = function(callback) {
    Application.Libraries.File(__dirname + "/middleware/**/*.js", function (errors, files) {
        callback(null);
        files.forEach(function (file) {
            require(file);
        });
    });
};

exports.load_controllers = function(callback) {
    Application.Libraries.File(__dirname + "/controllers/**/*.js", function (errors, files) {
        callback(null);
        files.forEach(function (file) {
            require(file);
        });
        Application.Servers.Website.get('/*', function (request, result) { return result.redirect('/index'); });
    });
};