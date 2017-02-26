Application.Servers.Website.get('/community/graph', Application.Servers.Website.group('user'), function (request, result) {
    const Graph = Application.Servers.Database.model('server_graph');

    Graph.forge().query(function (qb) { qb.orderBy('id', 'DESC'); qb.limit(100); }).fetchAll()
        .then (function (data) {
            result.end(
                result.render('views/community/graph', {
                    page  : 'Activity Graph',
                    graph : data.toJSON()
                })
            );
        })
        .catch (function (error) {
            Application.Console.error(error);
            result.redirect('/something-happened');
        });
});