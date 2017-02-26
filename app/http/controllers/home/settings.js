"use strict";
Application.Servers.Website.get("/settings", Application.Servers.Website.group("user"), function(request, result) {
    result.end(
        result.render("views/home/settings", {
            page : 'Account Settings',
        })
    );
});


// Personal Settings
Application.Servers.Website.post('/settings/personal', Application.Servers.Website.group('user'), function (request, result) {

    const User = Application.Servers.Database.model('User');

    User.forge().where('id', request.user.id).fetch()
        .then (function (user) {

            Application.Libraries.Sequence
                // Motto
                .then (function (next) {
                    user.set('motto', request.body.motto);
                    next();
                })
                // Email
                .then (function (next) {
                    if (request.body.mail != user.toJSON().mail)
                    {
                        if (Application.Libraries.Validator.isEmail(request.body.mail))
                        {
                            User.forge().where('mail', request.body.mail).fetch()
                                .then (function (data) {
                                    if (data == null)
                                    {
                                        user.set('mail', request.body.mail);
                                        next();
                                    }

                                    else
                                    {
                                        request.flash('error', 'That email is in use!');
                                        next();
                                    }

                                })
                                .catch (function (error) {
                                    request.flash('error', 'Something went wrong');
                                    return result.redirect('back');
                                });
                        }
                    }
                    else {
                        next();
                    }
                })
                // Password
                .then (function (next) {
                    if (request.body.current_password.length > 0)
                    {
                        if (Application.Libraries.Hash.BCRYPT.compareSync(Application.Libraries.Hash.MD5(request.body.current_password), user.toJSON().password))
                        {
                            user.set('password', Application.Libraries.Hash.BCRYPT.hashSync(Application.Libraries.Hash.MD5(request.body.new_password), null, null));
                            next();
                        }
                        else {
                            request.flash('error', 'Your password was wrong');
                            next();
                        }
                    }
                });
            user.save();
            request.flash('success', 'Your settings were updated');
            return result.redirect('back');
        })
        .catch (function (error) {
            console.log(error);
            request.flash('error', 'Something went wrong');
            return result.redirect('back');
        });
});


// Profile Settings
Application.Servers.Website.post('/settings/profile', Application.Servers.Website.group('user'), function (request, result) {

    const User = Application.Servers.Database.model('User');
    User.forge().where('id', request.user.id).fetch()
        .then (function (user) {
            user.set('youtube_embed', request.body.youtube_embed);
            user.set('aboutme', request.body.aboutme);
            user.set('twitter', request.body.twitter);
            user.set('instagram', request.body.instagram);
            user.set('snog', request.body.snog);
            user.set('kik', request.body.kik);
            user.set('snapchat', request.body.snapchat);
            user.set('skype', request.body.skype);
            user.save();

            request.flash('success', 'Your settings were updated');
            return result.redirect('back');
        })
        .catch (function (error) {
            request.flash('error', 'Something went wrong');
            return result.redirect('back');
        });

});