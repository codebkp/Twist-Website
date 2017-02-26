"use strict";

Application.Servers.Website.get('/values/actions/delete/:id', Application.Servers.Website.group('user'), function (request, result) {

    if (request.user.rank > 4) {
        if (Application.Libraries.Validator.isNumeric(request.params.id)) {
            const Values = Application.Servers.Database.model('cms_values');
            Values.forge().where('id', request.params.id).destroy()
                .then(function (results) {

                    if (results) {
                        request.flash('success', 'The value has removed from the site.');
                        return result.redirect('back');
                    }

                    else {
                        request.flash('error', 'Something happened?');
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