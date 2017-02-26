Application.Servers.Website.get('/store/vip', Application.Servers.Website.group('user'), function (request, result) {
    result.end(
        result.render('views/store/vip', {
            page : 'VIP Deals'
        })
    );
});