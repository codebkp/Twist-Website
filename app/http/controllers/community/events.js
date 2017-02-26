"use strict";
Application.Servers.Website.get("/community/staff/events", Application.Servers.Website.group('user'), function (request, result) {

    const Groups = Application.Servers.Database.model('permissions_groups');
    Groups.forge().query(function (qb) { qb.where('id', '>', 1); qb.where('id', '<', 4); qb.where('hidden', 0); qb.orderBy('id', 'DESC'); }).fetchAll({ withRelated : ['users'] })
        .then (function (data) {
            result.end(
                result.render('views/community/events', {
                    page    : 'Events Team',
                    staff   : data.toJSON(),
                })
            );
        })
        .catch (function (error) {
            Application.Console.error(error);
            result.redirect('/something-happened');
        });
});