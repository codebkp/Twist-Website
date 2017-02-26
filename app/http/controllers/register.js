Application.Servers.Website.post("/register", Application.Servers.Website.group("guest"), Application.Libraries.Passport.authenticate("register", {
    successRedirect : "me",
    failureRedirect : "/index",
    failureFlash    : true
}));