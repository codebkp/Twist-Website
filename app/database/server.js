"use strict";

exports.build = function(callback) {
    const knex = require("knex")({
        client: 'mysql',
        connection: {
            host     : '139.59.171.102',
            user     : 'root',
            password : 'password',
            database : 'habbo',
            charset  : 'utf8'
        }

    });

    Application.Servers.Database      = require("bookshelf")(knex);
    Application.Servers.Database.knex = knex;

    Application.Servers.Database.plugin("registry");

    Application.Libraries.File(__dirname + "/models/**/*.js", function( err, models ) {
        models.forEach(function (model) {
            require(model);
        });
    });

    callback(null, 'Database server initialized.');
}
