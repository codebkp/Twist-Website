"use  strict";

Application.Servers.Website.use(function (request, result, next) {

    if (request.isAuthenticated())
    {

        if (Application.Libraries.Cache.get('banned_users') != null) {

            if (Application.Libraries.Cache.get('banned_users').indexOf(request.user.username) > -1) {
                result.end(result.render('views/errors/you-been-banned'));
            }
            else {
                next();
            }

        }

        else {
            const Bans = Application.Servers.Database.model('bans');
            Bans.forge().where('bantype', 'user').fetchAll()
                .then(function (bans) {
                    var values = [];
                    bans.toJSON().forEach(function (ban) {
                        values.push(ban.value);
                    });

                    Application.Libraries.Cache.put('banned_users', values, 300000);
                    return result.redirect(request.originalUrl);
                })
        }

    }

    else {
        next();
    }

});