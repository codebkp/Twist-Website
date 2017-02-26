"use strict";
Application.Servers.Website.get('/rules', Application.Servers.Website.group('user'), function (request, result) {
    result.end(result.render('views/footer/rules', { page : 'Hotel Rules'}));
});