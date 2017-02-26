"use strict";

Application.Servers.Website.get('/switch_theme/:id', Application.Servers.Website.group('user'), function (request, result)  {

    const Player = Application.Servers.Database.model('User');

    Player.forge().where('id', request.user.id).fetch()
        .then (function (user) {

            if (request.params.id > 0 && request.params.id < 7)
            {
                user.set('skin', request.params.id);
                user.save();
                user.refresh();
                return result.redirect('back');
            }

            else {
                return result.redirect('back');
            }


        });

});