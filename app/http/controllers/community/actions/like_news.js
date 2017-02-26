Application.Servers.Website.get('/community/news/actions/like/:id', Application.Servers.Website.group('user'), function (request, result) {

    const Likes = Application.Servers.Database.model('cms_news_likes');

    Likes.forge().where('news_id', request.params.id).where('username', request.user.username).fetch()
        .then (function (data) {

            if (data)
            {
                data.destroy();
                request.flash('error', 'You have unliked this post!');
                return result.redirect('back');
            }

            else {
                Likes.forge().save({ news_id : request.params.id, username : request.user.username, like : 1})
                    .then (function (results) {
                        request.flash('success', 'You have liked this article!');
                        return result.redirect('back');
                    })
                    .catch (function (error) {
                        Application.Console.error(error);
                        result.redirect('/something-happened');
                    });
            }

        })
        .catch (function (error) {
            Application.Console.error(error);
            result.redirect('/something-happened');
        });


});

