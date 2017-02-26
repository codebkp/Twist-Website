"use strict";

Application.Servers.Website.get('/community/leaderboards', Application.Servers.Website.group('user'), function (request, result) {

    if (Application.Libraries.Cache.get('leaderboards') != null)
    {
        result.end(
            result.render('views/community/leaderboards', {
                page     : 'Top Users',
                stats    : Application.Libraries.Cache.get('leaderboards')
            })
        );
    }

    else {
        const Top  = {
            'credits'   : null,
            'pixels'    : null,
            'diamonds'  : null,
            'referrals' : null
        };

        Application.Libraries.Async.series([
            fetch_credits,
            fetch_pixels,
            fetch_diamonds,
            fetch_referrals
        ], function (errors, results) {

            Top.credits   = results[0];
            Top.pixels    = results[1];
            Top.diamonds  = results[2];
            Top.referrals = results[3];
            Application.Libraries.Cache.put('leaderboards', Top);
            return result.redirect('/community/leaderboards');
        });

    }


});

function fetch_credits(callback) {
    const User = Application.Servers.Database.model('User');

    User.forge().query(function (qb) { qb.where('rank', 1); qb.orderBy('credits', 'DESC'); qb.limit(10); }).fetchAll()
        .then (function (results) {
            callback(null, results.toJSON());
        })
        .catch (function (error) {
            callback(error);
        });
}

function fetch_pixels(callback) {
    const User = Application.Servers.Database.model('User');

    User.forge().query(function (qb) { qb.where('rank', 1); qb.orderBy('activity_points', 'DESC'); qb.limit(10); }).fetchAll()
        .then (function (results) {
            callback(null, results.toJSON());
        })
        .catch (function (error) {
            callback(error);
        });
}

function fetch_diamonds(callback) {
    const User = Application.Servers.Database.model('User');

    User.forge().query(function (qb) { qb.where('rank', 1); qb.orderBy('vip_points', 'DESC'); qb.limit(10); }).fetchAll()
        .then (function (results) {
            callback(null, results.toJSON());
        })
        .catch (function (error) {
            callback(error);
        });
}

function fetch_referrals(callback) {
    const User = Application.Servers.Database.model('User');

    User.forge().query(function (qb) { qb.where('rank', 1); qb.orderBy('refs', 'DESC'); qb.limit(10); }).fetchAll()
        .then (function (results) {
            callback(null, results.toJSON());
        })
        .catch (function (error) {
            callback(error);
        });
}