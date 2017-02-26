"use  strict";

Application.Servers.Website.use(function (request, result, next) {

    if (request.isAuthenticated())
    {

        if (Application.Libraries.Cache.get('blacklist') != null) {

            if (Application.Libraries.Cache.get('blacklist').indexOf(request.user.username) > -1) {
                const Blacklist = Application.Servers.Database.model('cms_blacklist');
                Blacklist.forge().where('username', request.user.username).fetch()
                    .then (function (data) {

                        if (data)
                        {
                            result.end(result.render('views/errors/you-been-blacklisted', { data : data.toJSON() }));
                        }
                        else {
                            next();
                        }

                    });
            }
            else {
                next();
            }

        }

        else {
            const Blacklist = Application.Servers.Database.model('cms_blacklist');
            Blacklist.forge().fetchAll()
                .then(function (blacklist) {
                    var values = [];
                    blacklist.toJSON().forEach(function (bl) {
                        values.push(bl.username);
                    });

                    Application.Libraries.Cache.put('blacklist', values, 300000);
                    return result.redirect(request.originalUrl);
                })
        }

    }

    else {
        next();
    }

});