"use strict";

Application.Servers.Website.get('/api/get_online', function (request, result)  {
    const Server = Application.Servers.Database.model("server_status")
    Server.forge().fetch()
        .then (function (data) {
            result.json(data.toJSON().users_online);
        })
        .catch (function (errors) {
            result.end();
        });
});