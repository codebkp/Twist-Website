"use strict";
Application.Servers.Website.get('/profile/:username', Application.Servers.Website.group('user'), function (request, result) {

    const User = Application.Servers.Database.model('User');

    User.forge().where('username', request.params.username).fetch({ withRelated : ['badge_slots']})
        .then (function (data) {
            if (data != null)
            {
                result.end(
                    result.render('views/home/profile', {
                        page    : 'Profile of ' + data.toJSON().username,
                        profile : data.toJSON(),
                        g: 0
                 })
                );
            }

            else {
                User.forge().where('username', 'LIKE', request.params.username + "%").fetchAll()
                    .then (function (data) {
                        result.end(
                            result.render('views/errors/profile-not-found', {
                                page        : 'Profiles similar to ' + request.params.username,
                                profiles    : data.toJSON(),
                            })
                        );
                    })
                    .catch (function (error) {
                        Application.Console.error(error);
                        result.redirect('/something-happened');
                    });
            }

        })
        .catch (function (error) {
            Application.Console.error(error);
            result.redirect('/something-happened');
        });

});


Application.Servers.Website.get('/profile', function (request, result) {
    // Put the fucking chromosones in the bag !!
    return result.redirect('/me');
});