"use strict";

Application.Servers.Website.get('/values/actions/edit/:id', Application.Servers.Website.group('user'), function (request, result) {

    if (request.user.rank > 4) {
        if (Application.Libraries.Validator.isNumeric(request.params.id)) {
            const Values = Application.Servers.Database.model('cms_values');
            Values.forge().where('id', request.params.id).fetch()
                .then(function (results) {

                    if (results) {
                        result.end(
                            result.render('views/values/staff/edit', {
                                page   : 'Editing Value of : ' + results.toJSON().name,
                                value  : results.toJSON()
                            })
                        );
                    }

                    else {
                        request.flash('error', 'This value was not found in our database.');
                        return result.redirect('back');
                    }
                })
                .catch(function (error) {
                    Application.Console.error(error);
                    result.redirect('/something-happened');
                });
        }

        else {
            request.flash('error', 'The price must be a number!');
            return result.redirect('back');
        }
    }

    else {
        request.flash('error', 'Only staff can do this!');
        return result.redirect('back');
    }

});


Application.Servers.Website.post('/values/actions/edit', Application.Servers.Website.group('user'), function (request, result) {

    if (request.user.rank > 4)
    {

        if (Application.Libraries.Validator.isNumeric(request.body.id))
        {

            const Values = Application.Servers.Database.model('cms_values');
            Values.forge().where('id', request.body.id).fetch()
                .then (function (data) {
                    data.set('name', request.body.name);
                    data.set('imgurl', request.body.imgurl);
                    data.set('price', Application.Libraries.Numeral(request.body.price).value());
                    data.save();
                    request.flash('success', 'The value has been updated on the website.');
                    return result.redirect('/values');
                })
                .catch(function (error) {
                    Application.Console.error(error);
                    result.redirect('/something-happened');
                });

        }

        else {
            request.flash('error', 'That is not a valid rare value.');
            return result.redirect('back');
        }

    }

    else {
        request.flash('error', 'Only staff can do this.');
        return result.redirect('back');
    }

});