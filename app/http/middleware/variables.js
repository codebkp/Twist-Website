"use  strict";

Application.Servers.Website.use(function (request, result, next) {
    if (request.method === 'GET') {

        Application.Libraries.Async.series([
            fetch_server,
            fetch_website,
            fetch_news,
            fetch_updates,
            graph_count,
        ], function (errors, results) {

            if (errors) {
                Application.Console.fatal(errors);
                result.end(result.render('views/errors/fatal'));
            }

            result.locals.server   = results[0];
            result.locals.website  = results[1];
            result.locals.error    = request.flash('error');
            result.locals.success  = request.flash('success');
            next();
        });

    } else {
        next();
    }
});

function fetch_server(callback) {
    const Server = Application.Servers.Database.model("server_status");
    Server.forge().fetch()
        .then (function (data) {
            return callback(null, data.toJSON());
        })
        .catch (function (errors) {
            return callback('Failed to fetch table server_status');
        });
}



function fetch_website(callback) {
    if (Application.Libraries.Cache.get("cms_settings") == null) {
        const Config = Application.Servers.Database.model("cms_settings");
        Config.forge().fetch()
            .then(function (data) {
                data = data.toJSON();
                Application.Libraries.Cache.put("cms_settings", data);
                return callback(null, data);
            })
            .catch(function (error) {
                return callback(error);
            });
    } else {
        callback(null, Application.Libraries.Cache.get("cms_settings"));
    }
}


function fetch_news(callback) {
    if (Application.Libraries.Cache.get("cms_news") == null)  {
        const News = Application.Servers.Database.model('cms_news');
        News.forge().query(function (qb) { qb.orderBy('id', 'DESC'); }).fetchAll()
            .then (function (data) {
                Application.Libraries.Cache.put("cms_news", data.toJSON(), 900000);
                callback (null, data.toJSON());
            })
            .catch (function (error) {
                return callback(error);
            });
    } else {
        callback(null, Application.Libraries.Cache.get("cms_news"));
    }
}

function fetch_updates(callback) {
    if (Application.Libraries.Cache.get("cms_updates") == null)  {
        const News = Application.Servers.Database.model('cms_updates');
        News.forge().query(function (qb) { qb.orderBy('id', 'DESC'); }).fetchAll({ withRelated: ['author'] })
            .then (function (data) {
                Application.Libraries.Cache.put("cms_updates", data.toJSON(), 900000);
                callback (null, data.toJSON());
            })
            .catch (function (error) {
                return callback(error);
            });
    } else {
        callback(null, Application.Libraries.Cache.get("cms_updates"));
    }
}

function graph_count(callback) {

    if (Application.Libraries.Cache.get("cms_graph") == null)
    {
        const Server = Application.Servers.Database.model('server_status');
        const Graph = Application.Servers.Database.model('server_graph');

        Server.forge().fetch()
            .then (function (data) {
                data = data.toJSON();
                Graph.forge().save({ users_online : data.users_online, rooms_active : data.loaded_rooms, created_at : Application.Libraries.Moment(new Date()).format("YYYY-MM-DD HH:mm:ss") });
                Application.Libraries.Cache.put('cms_graph', 'daddy', 900000);
                callback(null, null);
            })
            .catch (function (error) {
                return callback(error);
            });
    }

    else {
        callback(null, null);
    }

}