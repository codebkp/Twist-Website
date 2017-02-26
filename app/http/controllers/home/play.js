"use strict";
Application.Servers.Website.get("/play", Application.Servers.Website.group("user"), function(request, result)  {
    const Token = Application.Servers.Database.model('user_auth_ticket');
    const token = "twist_" + Application.Libraries.Secure(4);

    Token.where('user_id', request.user.id).destroy();
    new Token({user_id: request.user.id, auth_ticket: token}).save()
        .then(function (data) {
            result.end(result.render('views/home/play', {token: token}));
        })
        .catch(function (error) {
            Application.Console.error(error);
            result.redirect('/something-happened');
        });
});