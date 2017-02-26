Application.Servers.Website.get('/community/news', Application.Servers.Website.group('user'), function (request, result) {
    const News = Application.Libraries.Cache.get('cms_news');
    return result.redirect('/community/news/' + News[0].id);
});

Application.Servers.Website.get('/community/news/:id', Application.Servers.Website.group('user'), function (request, result) {

    const News = Application.Servers.Database.model('cms_news');

    News.forge().where('id', request.params.id).fetch({ withRelated : ['likes']})
        .then (function (data) {


            if (data)
            {
                data = data.toJSON();
                result.end(
                    result.render('views/community/news', {
                        page :   data.title,
                        article : data,
                        other   : Application.Libraries.Cache.get('cms_news').slice(0, 10)
                    })
                );
            }

            else {
                return result.redirect('/community/news' + Application.Libraries.Cace.get('cms_news')[0].id);
            }

        })
        .catch (function (error) {
            Application.Console.error(error);
            result.redirect('/something-happened');
        });


});

