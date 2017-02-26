"use strict";
Application.Servers.Website.get('/something-happened', function (request, result) {
    result.end(result.render('views/errors/something-happened'));
});