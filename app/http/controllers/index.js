"use strict";
Application.Servers.Website.get("/index", Application.Servers.Website.group("guest"), function(request, result) {
    result.end(result.render("views/index"));
});


Application.Servers.Website.post('/login', Application.Servers.Website.group("guest"), Application.Libraries.Passport.authenticate('login', {
    successRedirect: '/me',
    failureRedirect: '/index',
    failureFlash : true
}));