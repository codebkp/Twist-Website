"use strict";

Application.Servers.Website.get('/values', Application.Servers.Website.group('user'), function (request, result) {
    const Values = Application.Servers.Database.model('cms_values');

    Values.forge().query(function (qb) { qb.orderBy('id', 'DESC'); }).fetchAll()
        .then (function (data) {
            result.end(
                result.render('views/values/home', {
                    page    : 'Rare Values',
                    values  : data.toJSON()
                })
            );
        })
        .catch (function (error) {
            Application.Console.error(error);
            result.redirect('/something-happened');
        });
});