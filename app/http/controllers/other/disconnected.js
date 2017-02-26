"use strict";
Application.Servers.Website.post('/disconnected', Application.Servers.Website.group('user'), function (request, result) {
    result.end(result.render('views/errors/disconnected', { error : request.body.error_desc }));
});