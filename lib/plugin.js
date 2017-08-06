const Server = require('./server');
const Q = require('q');

module.exports = function (gemini, opts) {
    const server = Server(opts);
    var httpServer;

    gemini.on('startRunner', (runner) => {
        const deferred = Q.defer();

        httpServer = server.listen(opts.port, opts.host, () => {
            console.log(`JSON Server is running on http://${opts.host}:${opts.port}`);
        });

        deferred.resolve();
    });

    gemini.on('endRunner', (runner, data) => {
        const deferred = Q.defer();

        httpServer.close(() => {
            console.log('JSON Server is stopping');
            deferred.resolve();
        })

        return deferred.promise;
    });
};
