Application.Servers.Website.group("guest", function (request, result, next) {
    if (!request.isAuthenticated()) {
        next();
    } else {
        return result.redirect("/me");
    }
});