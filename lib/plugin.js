const Server = require('./server');
const Q = require('q');

module.exports = (gemini, opts) => {
    const server = Server(opts);
    var httpServer;

    gemini.on(gemini.events.START_RUNNER, (runner) => {
        const deferred = Q.defer();

        httpServer = server.listen(opts.port, opts.host, () => {
            console.log(`JSON Server is running on http://${opts.host}:${opts.port}`);
        });

        deferred.resolve();
    });

    gemini.on(gemini.events.END_RUNNER, (runner, data) => {
        const deferred = Q.defer();

        httpServer.close(() => {
            console.log('JSON Server is stopping');
            deferred.resolve();
        })

        return deferred.promise;
    });
};
