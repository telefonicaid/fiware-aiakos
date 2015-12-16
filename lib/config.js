/*
 * Copyright 2015 Telefónica I+D
 * All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

'use strict';

var path = require('path'),
    prog = require('../package.json'),
    name = path.basename(process.argv[1], '.sh'),
    optimist = require('optimist'),
    yaml = require('js-yaml'),
    util = require('util'),
    fs = require('fs');


/**
 * Program configuration.
 *
 * <var>config</var> attributes will be updated with those read from <var>configFile</var>, if exists,
 * and from command line arguments, in that order.
 */
var config = {
    configFile: path.join(__dirname, '/../config', name + '.yml'),
    listenPort: 3000,
    openstack: {
        username: 'user',
        password: 'admin'
    },
    default: true
};



function readConfigFile(file) {
    var cfgParserResult = [ 'INFO', 'Read configuration file' ];
    try {
        var cfgParse = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
        ['app', 'openstack'].forEach(function (key) {
            switch (key in cfgParse && key) {
                 case 'app':
                    config.listenPort = cfgParse.app.port;
                    break;
                case 'openstack':
                    Object.keys(config.openstack).filter(hasOwnProperty, cfgParse.openstack).forEach(function(key) {
                        config.openstack[key] = cfgParse.openstack[key];
                    });
                    break;
                default:
                    throw new Error(util.format('no "%s" node found', key));
            }
        });
        config.default = false;
    } catch (err) {
        var msg = err.errno ? 'Could not read configuration file' : util.format('Configuration file: %s', err.message);
        cfgParserResult = [ 'WARN', msg ];
    }

    // show result of configuration processing
    console.log('config:' + cfgParserResult);

    return cfgParserResult;
}


function main() {
    // create argument parser
    var argParser = optimist.demand([])
        .options('h', { 'alias': 'help', 'describe': 'show help message and exit', 'boolean': true })
        .options('v', { 'alias': 'version', 'describe': 'show version and exit', 'boolean': true });

    // read configuration file if exists (path maybe taken from command line)
    argParser
        .options('c', {
            'alias': 'config-file', 'describe': 'configuration file', 'string': true,
            'default': config.configFile
        })
        .check(function (argv) {
            config.configFile = argv['config-file'];
        })
        .parse(process.argv);

    // process config file
    readConfigFile(config.configFile);

    // process command line arguments
    argParser
        .usage(util.format('Usage: %s [options]\n\n%s', name, prog.description))
        .options('p', {
            'alias': 'listen-port', 'describe': 'listen port',
            'default': config.listenPort
        })
        .check(function (argv) {
            if (argv.version) {
                console.error('%s v%s', name, prog.version);
                process.exit(1);
            } else if (argv.help) {
                optimist.showHelp();
                process.exit(0);
            } else {
                Object.keys(argv).forEach(function (key) {
                    var attr = key.replace(/(-)([a-z])/, function (str, $1, $2) { return $2.toUpperCase(); });
                    if (attr in config) {
                        config[attr] = argv[key];
                    }
                });
            }
        })
        .parse(process.argv);

    return config;
}


main();


/** @export */
module.exports.data = config;

/** @export */
module.exports.readConfigFile = readConfigFile;
