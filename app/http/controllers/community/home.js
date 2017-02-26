Application.Servers.Website.get('/community', Application.Servers.Website.group('user'), function (request, result) {

    Application.Libraries.Async.series([
        fetch_newbie,
        fetch_stats,
    ], function (errors, results) {

        if (errors)
        {
            Application.Console.error(errors);
            result.redirect('/something-happened');
        }

        else {
            result.end(
                result.render('views/community/home', {
                    page   : 'Community',
                    newbie : results[0],
                    stats  : results[1]
                })
            );
        }

    });

});

function fetch_newbie(callback) {

    if (Application.Libraries.Cache.get('newest_user') == null)
    {
        const User = Application.Servers.Database.model('User');
        User.forge().query(function (qb) { qb.orderBy('id', 'DESC');}).fetch()
            .then (function (data) {
                Application.Libraries.Cache.put('newest_user', data.toJSON(), 300000);
                callback(null, Application.Libraries.Cache.get('newest_user'));
            })
    }

    else {
        callback(null, Application.Libraries.Cache.get('newest_user'));
    }

}


function fetch_stats(callback) {

    if (Application.Libraries.Cache.get('server_stats') == null)
    {

        Application.Libraries.Async.series([
            users_online,
            rooms_active,
            users,
            rooms,
            badges,
            favorite_rooms,
            catalog_items,
            bans
        ], function (error, results) {

            if (error)
            {
                callback(error);
            }
            else {
                const stats = {
                    'users_online'   : Application.Libraries.Numeral(results[0]).format('0,0'),
                    'rooms_active'   : Application.Libraries.Numeral(results[1]).format('0,0'),
                    'users'          : Application.Libraries.Numeral(results[3]).format('0,0'),
                    'rooms'          : Application.Libraries.Numeral(results[4]).format('0,0'),
                    'badges'         : Application.Libraries.Numeral(results[5]).format('0,0'),
                    'favorite_rooms' : Application.Libraries.Numeral(results[6]).format('0,0'),
                    'catalog_items'  : Application.Libraries.Numeral(results[7]).format('0,0'),
                    'bans'           : Application.Libraries.Numeral(results[8]).format('0,0')
                };
                Application.Libraries.Cache.put('server_stats', stats, 900000);
                callback(null, stats);
            }

        });
    }

    else {
        callback(null, Application.Libraries.Cache.get('server_stats'));
    }
}

// Queries
function users_online(callback) {
    Application.Servers.Database.knex('users').select('id').where('online', '1')
        .then (function (results) {
            callback(null, results.length);
        })
        .catch (function (error) {
            callback(error);
        })
}
function rooms_active(callback)  {
    Application.Servers.Database.knex('rooms').select('id').where('users_now', '>', 0)
        .then (function (results) {
            callback(null, results.length);
        })
        .catch (function (error) {
            callback(error);
        })
}
function users(callback)  {
    Application.Servers.Database.knex('users').select('id')
        .then (function (results) {
            callback(null, results.length);
        })
        .catch (function (error) {
            callback(error);
        })
}
function rooms(callback)  {
    Application.Servers.Database.knex('rooms').select('id')
        .then (function (results) {
            callback(null, results.length);
        })
        .catch (function (error) {
            callback(error);
        })
}
function badges(callback)  {
    Application.Servers.Database.knex('user_badges').select('id')
        .then (function (results) {
            callback(null, results.length);
        })
        .catch (function (error) {
            callback(error);
        })
}
function favorite_rooms(callback)  {
    Application.Servers.Database.knex('user_favorites').select('id')
        .then (function (results) {
            callback(null, results.length);
        })
        .catch (function (error) {
            callback(error);
        })
}
function catalog_items(callback)  {
    Application.Servers.Database.knex('catalog_items').select('id')
        .then (function (results) {
            callback(null, results.length);
        })
        .catch (function (error) {
            callback(error);
        })
}
function bans (callback) {
    Application.Servers.Database.knex('bans').select('id')
        .then (function (results) {
            callback(null, results.length);
        })
        .catch (function (error) {
            callback(error);
        })
}