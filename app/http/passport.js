"use strict";

module.exports = function(passport) {
    const LocalStrategy = require("passport-local").Strategy;
    /* Login Handler */
    Application.Libraries.Passport.use("login", new LocalStrategy({ usernameField : 'username', passwordField : 'password', passReqToCallback : true }, function(req, username, password, done) {

        if (Application.Libraries.Validator.isAlphanumeric(username))
        {
            const Player        = Application.Servers.Database.model("User");
            Player.forge().where('username', username).fetch()
                .then (function (user) {

                    if (user != null)
                    {
                        if (user.toJSON().using_bcrypt == 0)
                        {
                            Application.Libraries.Sequence
                                .then (function (next) {
                                    user.set("using_bcrypt", 1);
                                    user.set("password", Application.Libraries.Hash.BCRYPT.hashSync(user.toJSON().password, null, null));
                                    user.save();
                                    next();
                                })
                        }

                        if (Application.Libraries.Hash.BCRYPT.compareSync(Application.Libraries.Hash.MD5(password), user.toJSON().password))
                        {

                            // Record Login
                            const Logins = Application.Servers.Database.model('cms_logins');
                            new Logins({
                                user_id        : user.toJSON().id,
                                ip_address     : req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                                client_browser : req.headers['user-agent'],
                                created_at     :  Application.Libraries.Moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                            }).save();

                            // Update IP
                            user.set('ip_last', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
                            user.save();
                            user.refresh();

                            // Finish
                            done(null, user.toJSON());
                        }

                        else {
                            // Record Login Attempt
                            done(null, null, req.flash("error", "Your password is wrong."));
                        }

                    }

                    else {
                        done(null, null, req.flash("error", "That user doesn't exist."));
                    }
                })

        }
        else {
            done(null, null, req.flash("error", "Your username is invalid."));
        }

    }));

    Application.Libraries.Passport.use("register", new LocalStrategy({ usernameField : 'username', passwordField : 'password', passReqToCallback : true }, function(req, username, password, done) {

        if (Application.Libraries.Validator.isAlphanumeric(username) && username.length > 0 && username.length < 12)
        {

            if (Application.Libraries.Validator.isEmail(req.body.mail))
            {

                if (req.body.password = req.body.password_confirmation)
                {
                    const Player        = Application.Servers.Database.model("User");
                    Player.where('username', username).fetch()
                        .then (function (data) {

                            if (data == null)
                            {

                                Player.where('mail', req.body.mail).fetch()
                                    .then (function (data) {

                                        if (data == null)
                                        {
                                            const user = {
                                                username          : username,
                                                password          : Application.Libraries.Hash.BCRYPT.hashSync(Application.Libraries.Hash.MD5(password), null, null),
                                                mail              : req.body.mail,
                                                look              : "sh-3035-1408.hr-828-61.ha-3488-0.lg-280-110.hd-209-2.ch-255-1423",
                                                credits           : 50000,
                                                activity_points   : 10000,
                                                vip_points        : 15,
                                                account_created   : Application.Libraries.Moment().unix(),
                                                ip_last           : req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                                                ip_reg            : req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                                                using_bcrypt      : 1,
                                            };


                                            new Player(user).save()
                                                .then(function (status) {
                                                    user.id = status.id;
                                                    return done(null, user);
                                                })
                                                .catch (function (error) {
                                                    Application.Console.error(error);
                                                    done(null, null, req.flash("error", "Something went wrong"));
                                                });
                                        }

                                        else {
                                            done(null, null, req.flash("error", "That email is already taken"));
                                        }
                                    })
                                    .catch (function (error) {
                                        Application.Console.error(error);
                                        result.redirect("error", "Something went wrong");
                                    });

                            }

                            else {
                                done(null, null, req.flash("error", "That username is already taken!"));
                            }

                        })
                        .catch (function (error) {
                            Application.Console.error(error);
                            done(null, null, req.flash("error", "Something went wrong"));
                        });

                }

                else {
                    done(null, null, req.flash("error", "Passwords did not match"));
                }

            }

            else {
                done(null, null, req.flash("error", "Email was not in right format"));
            }

        }

        else {
            done(null, null, req.flash("error", "Your username is invalid"));
        }


    }));





    Application.Libraries.Passport.serializeUser(function(user, done) {
        done(null, user);
    });

    Application.Libraries.Passport.deserializeUser(function(user, done) {
        const User = Application.Servers.Database.model('User');
        User.where('id', user.id).fetch({withRelated : ['logins']})
            .then (function (data) {
                done(null, data.toJSON());
            });
    });
}