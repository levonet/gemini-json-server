const jsonServer = require('json-server');
const Q = require('q');
const fs = require('fs');
const path = require('path');

module.exports = function (gemini, opts) {
    var httpServer;

    opts = opts || {};
    opts.host = opts.host || '0.0.0.0';
    opts.port = opts.port || 8080;
    if (typeof opts.readOnly === 'undefined') {
        opts.readOnly = false;
    }
    if (typeof opts.quiet === 'undefined') {
        opts.quiet = false;
    }

    const defaultsOpts = {
        logger: !opts.quiet,
        readOnly: opts.readOnly,
        static: path.join(process.cwd(), opts.static || '.')
    };

    const server = jsonServer.create();
    const defaults = jsonServer.defaults(defaultsOpts);
    const router = jsonServer.router(path.join(process.cwd(), opts.schema));

    server.use(defaults);

    if (opts.routes) {
        const routes = JSON.parse(fs.readFileSync(path.join(process.cwd(), opts.routes)))
        const rewriter = jsonServer.rewriter(routes)
        server.use(rewriter)
    }

    if (opts.id) {
        router.db._.id = opts.id
        server.db = router.db
    }

    server.use(router);

    gemini.on('startRunner', (runner) => {
        const deferred = Q.defer();
        const host = opts.host;
        const port = opts.port;

        httpServer = server.listen(port, host, () => {
            console.log(`JSON Server is running on http://${host}:${port}`);
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
