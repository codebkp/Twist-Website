"use strict";
Application.Servers.Website.get("/updates", function (request, result) {
    result.end(
        result.render("views/updates", {
            updates : Application.Libraries.Cache.get("cms_updates")
        })
    );
});