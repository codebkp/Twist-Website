"use strict";
require('cache-require-paths');


// Application Dependencies
global.Application = {
    'Info'       : {
        'Version'   : 2,
        'Build'     : 2,
        'Startup'   : Date.now(),
        'Root'      : __dirname,
        'Mode'      : 'Development',
        'Status'    : 0
    },
    'Libraries'  : {
        'Async'     : require('async'),
        'Body'      : require('body-parser'),
        'Bookshelf' : null,
        'Cache'     : require('memory-cache'),
        'Compress'  : require('compression'),
        'Cookie'    : require('cookie-parser'),
        'Express'   : require('express'),
        'File'      : require('glob'),
        'Flash'     : require('connect-flash'),
        'Moment'    : require('moment'),
        'Numeral'   : require('numeral'),
        'Passport'  : require('passport'),
        'Secure'    : require('secure-random'),
        'Sequence'  : require('sequence').Sequence.create(),
        'Redis'     : null,
        'Session'   : require('express-session'),
        'Hash'      : {
            'BCRYPT' : require('bcrypt-nodejs'),
            'MD5'    : require('md5'),
        },
        'Validator' : require('validator'),
    },

    'Servers'    : {
        'Website' : null,
        'Database' : null,
    },

    'Controllers' : {
        'HTTP' : require(__dirname + "/app/http/server"),
        'MSQL' : require(__dirname + "/app/database/server")
    },

    'Console'   : require(__dirname + "/app/console")
};

Application.Libraries.Redis = require('connect-redis')(Application.Libraries.Session);

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

Application.Servers.Website = Application.Libraries.Express();

// Application Cycle
Application.Libraries.Async.parallel([
    Application.Controllers.MSQL.build,
    Application.Controllers.HTTP.build,
], function (errors, messages) {
    Application.Console.clear();
    Application.Console.logo();

    if (errors)
    {
        Application.Console.crash(errors);
    }

    Application.Console.build(messages);
});
