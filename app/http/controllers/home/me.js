"use strict";
Application.Servers.Website.get("/me", Application.Servers.Website.group("user"), function(request, result) {
    result.end(
        result.render("views/home/me", {
            page        : request.user.username,
            news        : Application.Libraries.Cache.get("cms_news"),
        })
    );
});
