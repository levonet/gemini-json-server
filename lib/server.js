const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

module.exports = function (opts) {

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

    return server;
};
