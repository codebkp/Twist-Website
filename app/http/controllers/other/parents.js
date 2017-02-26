"use strict";
Application.Servers.Website.get('/parents', Application.Servers.Website.group('user'), function (request, result) {
    result.end(result.render('views/footer/parents', { page : 'Parental Information '}));
});