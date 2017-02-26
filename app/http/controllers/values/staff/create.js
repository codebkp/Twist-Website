"use strict";

Application.Servers.Website.get('/values/actions/create', Application.Servers.Website.group('user'), function (request, result) {

    if (request.user.rank > 4)
    {

        result.end(
            result.render('views/values/staff/create', {
                page : 'Add Value'
            })
        );

    }

    else {
        request.flash('error', 'Only staff can do this.');
        return result.redirect('back');
    }

});

Application.Servers.Website.post('/values/actions/create', Application.Servers.Website.group('user'), function (request, result) {

    console.log('Request : ' + request.body);

    if (request.user.rank > 4)
    {

        const Values = Application.Servers.Database.model('cms_values');
        Values.forge().save({name : request.body.name, imgurl : request.body.imgurl, price : Application.Libraries.Numeral(request.body.price).value(), timestamp : Date.now() / 1000 | 0})
            .then (function (results) {
                request.flash('success', 'The value has been added on the website.');
                return result.redirect('/values');
            })
            .catch(function (error) {
                Application.Console.error(error);
                result.redirect('/something-happened');
            });

    }

    else {
        request.flash('error', 'Only staff can do this.');
        return result.redirect('back');
    }

});