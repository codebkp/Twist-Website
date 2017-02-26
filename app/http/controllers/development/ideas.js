"use strict";
Application.Servers.Website.get('/development/ideas', Application.Servers.Website.group('user'), function (request, result) {
    result.end(result.render('views/development/ideas', { page : 'Website Ideas'}));
});


Application.Servers.Website.post('/contact', Application.Servers.Website.group('user'), function (request, result) {

    const Reports = Application.Servers.Database.model('cms_contact');
    new Reports({ user_id : request.user.id, topic : request.body.topic, message : request.body.message, created_at : Application.Libraries.Moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}).save()
        .then (function (results) {
            request.flash('success', 'Your message has been sent to our staff');
            return result.redirect('back');
        })
        .catch (function (error) {
            Application.Console.error(error);
            result.redirect('/something-happened');
        });
})