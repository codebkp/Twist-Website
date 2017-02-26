"use  strict";

Application.Servers.Website.use(function (request, result, next) {
    if (request.method === 'GET') {

        if (request.path === '/') {

            if (!request.isAuthenticated()) {
                return result.redirect('/index');
            }

            else {
                return result.redirect('/me');
            }
        }

        else {
            next();
        }

    } else {
        next();
    }
})