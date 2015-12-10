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
    keysPath = __dirname + '/../public/keys/';

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
function validateRegion(name) {
    var result = false;
    var files = fs.readdirSync(keysPath);

    var regex = new RegExp(name + '.*key');
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
 * get the key for region and type of key
 * @param {Object} req
 * @param {Object} res
 */
function getKey(req, res) {

    var region = req.params.region;
    var key = req.params.key;
    console.log('Request ' + key + ' for ' + region);
    var statusCode = 404;

    if (validateKey(key) && validateRegion(region)) {
        var file = fs.readFileSync(keysPath + region + '.' + key, 'binary');
        res.type('text/plain');
        res.setHeader('Content-Length', file.length);
        statusCode = 200;
        res.write(file, 'binary');
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

    if (content.startsWith('ssh-rsa')) {
        return 'ssh';
    }
    if (content.startsWith('-----BEGIN PGP PUBLIC KEY BLOCK-----')) {
        return 'gpg';
    }

    return null;

}
/**
 * upload a key for a region
 * @param {Object} req
 * @param {Object} res
 */
function postKey(req, res) {
    try {
        var region = req.header('region');
        console.log('post new key for region ' + region);
        var key = discoverKey(req.body);
        if (key === null) {
            throw new Error('invalid key');
        }

        var filename = keysPath + region + '.' + key + 'key';

        fs.writeFile(filename, req.body, function(err) {
            if (err) {
                return console.log(err);
            }

            console.log('The key file %s was saved!', filename);
            res.status(201);

        });

    } catch (ex) {
        console.log('error in post: %s', ex);
        res.status(400);
    }
}

/* GET v1 page. */
router.get('/support/:region/:key', getKey);

/* POST v1 key. */
router.post('/support', postKey);


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
