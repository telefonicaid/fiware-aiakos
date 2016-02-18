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

var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    openstack = require('./openstack.js'),
    keysPath = __dirname + '/../public/keys/',
    logger = require('../logger');

/**
 * set the path for files with keys
 * @param {String} path
 */
function setKeysPath(path) {

    keysPath = path;
}

/**
 * validate exists region
 * @param {String} region name
 */
function validateRegion(name, key) {
    var result = false;
    var files = fs.readdirSync(keysPath);

    var regex = new RegExp(name + '.' + key);
    files.forEach(function (item) {
        if (regex.test(item)) {
            result = true;
        }
    });

    return result;
}

/**
 * validate key string
 * @param {String} key name
 */
function validateKey(name) {
    var result = false;
    if (['sshkey', 'gpgkey'].indexOf(name) > -1) {
        result = true;
    }

    return result;
}

/**
 * check if a string ends with a suffix
 * @param {String} suffix
 * @returns {boolean}
 */
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

/**
 * remove character 2 at the end of region name
 * @param {String} region
 * @returns {String}
 */
function removeCharacter2(region) {
    var newName = region;
    if (newName.endsWith('2')) {
        newName = newName.substring(0, newName.length - 1);
    }

    return newName;
}

/**
 * get the key for region and type of key
 * @param {Object} req
 * @param {Object} res
 */
function getKey(req, res) {

    var region = req.params.region.toLowerCase();
    region = removeCharacter2(region);

    var key = req.params.key;
    logger.info('Request ' + key + ' for ' + region);
    var statusCode = 404;

    if (validateKey(key) && validateRegion(region, key)) {
        var file = fs.readFileSync(keysPath + region + '.' + key, 'binary');
        res.type('text/plain');
        res.setHeader('Content-Length', file.length);
        statusCode = 200;
        res.write(file, 'utf8');
    }
    res.statusCode = statusCode;

    res.end();

}
/**
 * Discover what type of key
 * @param {String} key string
 * @returns {String} String with the name of key
 */
function discoverKey(content) {

    if (content.indexOf('ssh-rsa') !== -1) {
        return 'ssh';
    }
    if (content.indexOf('-----BEGIN PGP PUBLIC KEY BLOCK-----') !== -1) {
        return 'gpg';
    }

    return null;

}

/**
 * @function saveKeyToFile
 * Write content in a file, using region name for file name
 * @param {String} region
 * @param {Object} req
 * @param {Object} res
 */
function saveKeyToFile(region, content, res) {
    if (region === undefined) {
        res.status(401);
        res.end();
    } else {
        logger.info('post new key for region ' + region);
        var key = discoverKey(content);
        if (key === null) {
            var error = new Error('invalid key');
            error.statusCode = 400;
            throw error;
        }

        region = removeCharacter2(region);
        var filename = keysPath + region.toLowerCase() + '.' + key + 'key';

        fs.writeFile(filename, content, function (err) {
            if (err) {
                return logger.warn(err);
            }

            logger.info('The key file %s was saved!', filename);
            res.status(201);
            res.type('text/plain');
            res.setHeader('Content-Length', content.length);
            res.write(content, 'utf8');
            res.end();

        });
    }

}

/**
 * upload a key for a region
 * @param {Object} req
 * @param {Object} res
 */
function postKey(req, res) {
    var statusCode = 400;
    try {
        if (!req.is('text')) {
            statusCode = 415;
            throw new Error('invalid content-type');
        }

        openstack.validateTokenAndGetRegion(req.header('X-Auth-Token'), function (region) {
            logger.info('postKey: use region name: ' + region);
            saveKeyToFile(region, req.body, res);

        });


    } catch (ex) {
        logger.warn('error in post: %s', ex);
        if (ex.statusCode) {
            res.status(ex.statusCode);
        }else {
            res.status(statusCode);
        }
        res.send(ex.message);
    }

}
/**
 * @function methodNotAllowed
 * @param {Object} req
 * @param {Object} res
 */
function methodNotAllowed(req, res) {
    var err = new Error('Method not allowed');
    err.status = 405;
    logger.warn('Method not allowed:' + err);
    err.stack = '';
    res.setHeader('content-type', 'plain/text');
    res.status(err.status);
    res.send(err.message);
}

/* GET v1 page. */
router.get('/support/:region/:key', getKey);

/* POST v1 key. */
router.post('/support', postKey);

/* Response for another cases  */
router.use(methodNotAllowed);



/** @export */
module.exports = router;

/** @export */
module.exports.validateRegion = validateRegion;

/** @export */
module.exports.validateKey = validateKey;

/** @export */
module.exports.getKey = getKey;

/** @export */
module.exports.setKeysPath = setKeysPath;

/** @export */
module.exports.postKey = postKey;

/** @export */
module.exports.discoverKey = discoverKey;

/** @export */
module.exports.saveKeyToFile = saveKeyToFile;

/** @export */
module.exports.methodNotAllowed = methodNotAllowed;
