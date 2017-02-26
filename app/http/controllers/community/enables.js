Application.Servers.Website.get('/community/enables', Application.Servers.Website.group('user'), function (request, result) {
    result.end(
        result.render('views/community/enables', {
            page : 'Enables List'
        })
    );
});