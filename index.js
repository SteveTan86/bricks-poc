"use strict";

const hapi = require('hapi');
const path = require('path');

const server = new hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'public')
            }
        }
    }
});

server
    .connection({
        port: 9000
    });

// Register all the necessary plugins and then start the server.
const plugins = [
    {
        register: require('inert'),
        options: {
            etagsCacheMaxSize: 32 // We don't need a lot of space for cache
        }
    },
    {
        register: require('good'),
        options: {
            // TODO: Update for good v7.x.x
            //includes: {
            //    request: ['headers', 'payload'],
            //    response: ['payload']
            //},
            //ops: {
            //    intervals: 30000
            //},
            //reporters: {
            //    'ops-console': [
            //        {
            //            // Equivalent to calling `new require('good-squeeze').Squeeze([{ ops: '*' }, { request: '*' }, { response: '*' }])`
            //            module: 'good-squeeze',
            //            name: 'Squeeze',
            //            args: [{ log: '*' }, { ops: '*' }]
            //        },
            //        {
            //            // Equivalent to calling `new require('good-squeeze').SafeJson()`
            //            module: 'good-squeeze',
            //            name: 'SafeJson'
            //        },
            //        {
            //            // Equivalent to calling `new require('good-console')()`;
            //            module: 'good-console'
            //        }
            //    ],
            //    'all-http': [
            //        {
            //            // Equivalent to calling `new require('good-squeeze').Squeeze([{ ops: '*' }, { request: '*' }, { response: '*' }])`
            //            module: 'good-squeeze',
            //            name: 'Squeeze',
            //            args: [{ error: '*' }, { log: '*' }, { ops: '*' }, { request: '*' }, { response: '*' }]
            //        },
            //        {
            //            // Equivalent to calling `new require('good-squeeze').SafeJson()`
            //            module: 'good-squeeze',
            //            name: 'SafeJson'
            //        },
            //        {
            //            module: 'good-http',
            //            args: [
            //                'https://logger.qanva.st', // URL mapped locally to a logger process
            //                { wreck: headers: { 'x-api-key': 12345 } }
            //            ]
            //        }
            //    ]
            //},
            requestHeaders: true,
            requestPayload: true,
            responsePayload: true,
            opsInterval: 30000,
            reporters: [
                {
                    reporter: require('good-console'),
                    events: {
                        log: '*',
                        ops: '*'
                    }
                }, {
                    reporter: require('good-http'),
                    events: {
                        error: '*',
                        log: '*',
                        ops: '*',
                        request: '*',
                        response: '*'
                    },
                    config: {
                        endpoint: 'https://logger.qanva.st', // URL mapped locally to a logger process
                        wreck: {
                            headers: { 'x-api-key' : 12345 } // TODO Update the API key
                        }
                    }
                }
            ]
        }
    }
];

server
    .register(plugins, error => {
        if (error) throw error;

        require('./routes')(server);

        server
            .start(error => {
                if (error) throw error;

                console.log(`Server Running at ${server.info.uri}`);
            });
    });


