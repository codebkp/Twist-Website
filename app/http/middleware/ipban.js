"use  strict";

Application.Servers.Website.use(function (request, result, next) {

    if (Application.Libraries.Cache.get('banned_ips') != null)
    {

        if (Application.Libraries.Cache.get('banned_ips').indexOf(request.headers['x-forwarded-for'] || request.connection.remoteAddress) > -1)
        {
            result.end(result.render('views/errors/you-been-banned'));
        }
        else {
            next();
        }

    }

    else {
        const Bans = Application.Servers.Database.model('bans');
        Bans.forge().where('bantype', 'ip').fetchAll()
            .then (function (bans)
            {

                var values = [];
                bans.toJSON().forEach (function (ban) {
                    values.push(ban.value);
                });

                Application.Libraries.Cache.put('banned_ips', values, 900000);
                return result.redirect(request.originalUrl);
            })
    }

});