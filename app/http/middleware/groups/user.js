Application.Servers.Website.group("user", function (request, result, next) {

    if (request.isAuthenticated())
    {

        result.locals.user = request.user;
        next();
    }

    else {
        return result.redirect("/index");
    }

});