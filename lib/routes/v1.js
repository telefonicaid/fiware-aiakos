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

/* GET v1 page. */
router.get('/support/:region/:key', getKey);

/**
 * set the path for files with keys
 * @param path
 */
function setKeysPath(path) {

    keysPath = path;
}

/**
 * get the key for region and type of key
 * @param req
 * @param res
 * @param next
 */
function getKey(req, res, next) {

    var region = req.params.region;
    var key = req.params.key;
    console.log('Request ' + key + ' for ' + region);
    var statusCode = 404;

    if (validateKey(key) && validateRegion(region)) {
        var file = fs.readFileSync(keysPath + region + '.' + key, 'binary');
        res.setHeader('Content-Length', file.length);
        res.write(file, 'binary');
        statusCode = 200;
    }
    res.statusCode = statusCode;

    res.type('text/plain');
    res.end();

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
