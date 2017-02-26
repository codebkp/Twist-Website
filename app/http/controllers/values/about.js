"use strict";
Application.Servers.Website.get('/values/about', Application.Servers.Website.group('user'), function (request, result) {
    result.end(
        result.render('views/values/about', {
            page    : 'About Values',
        })
    );
});