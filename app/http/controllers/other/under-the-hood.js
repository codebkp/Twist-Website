"use strict";
Application.Servers.Website.get('/under-the-hood', function (request, result) {
    result.end(result.render('views/under-the-hood', { version : Application.Info.Version + '.' + Application.Info.Build }));
});