Application.Servers.Website.get('/store/rares', Application.Servers.Website.group('user'), function (request, result) {
    result.end(
        result.render('views/store/rares', {
            page : 'Rare Packages'
        })
    );
});