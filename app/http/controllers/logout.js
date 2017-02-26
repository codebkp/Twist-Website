Application.Servers.Website.get('/logout', Application.Servers.Website.group("user"), function(req, res) { req.logout(); res.redirect("/index"); });
