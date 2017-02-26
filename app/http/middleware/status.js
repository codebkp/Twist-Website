"use  strict";

Application.Servers.Website.use(function (request, result, next) {
    if (Application.Info.Status == 1) {

        result.end(result.render("views/errors/fatal"));

    } else {
        next();
    }
})