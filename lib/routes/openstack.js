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

var http = require('http'),
    config = require('../config').data;


/**
 * @function parseRegionNameFromUserName
 * Get region name from username. username MUST be admin-regionName
 * @param {String} username
 */
function parseRegionNameFromUserName(username) {

    var  index = username.indexOf('-');
    if (index <= 0) {
        throw new Error ('invalid username ' + username);
    }
    if ( username.indexOf('@') >= 0 ) {
        throw new Error ('invalid username %s. Username can not be an email', username);
    }
    return username.substring(index + 1);
}


/**
 * @function getValidateToken
 * Call to keystone and validate token.
 * @param {String} adminToken
 * @param {String} token
 * @param {function} callback
 */
function getValidateToken(adminToken, token, callback) {
    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Auth-Token': adminToken,
        'X-Subject-Token': token
    };

    var options = {
        host: 'cloud.lab.fiware.org',
        port: '4731',
        path: '/v3/auth/tokens',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf-8');
        var responseString = '';

        res.on('data', function (data) {
                responseString += data;
        });
        res.on('end', function () {
            console.log('Response string: %s', responseString);
            try {
                var resultObject = JSON.parse(responseString);
                var region = parseRegionNameFromUserName(resultObject.token.user.name);
                callback(region);
            } catch (ex) {
                console.log('Error in parse response string:  %s %s', responseString, ex);
                callback();
            }
        });

    });
    req.on('error', function (e) {
        if (e.code === 'ECONNRESET') {
            console.log('Error in connection by TIMEOUT with keystone: ' + e);
        } else {
            console.log('Error in connection with keystone: ' + e);
        }
        callback();


    });

    req.setTimeout(10000, function () {
        req.abort();
        console.log('Timeout in the connection with keystone. Time exceed');
    });


    req.end();


}

/**
 * @function postAdminToken
 * Call to keystone and get new admin token.
 * @param {function} callback
 */
function postAdminToken(callback) {

    var payload = {
        auth: {
            identity: {
                methods: [
                    'password'
                ],
                password: {
                    user: {
                        domain: {
                            id: 'default'
                         },
                        name: config.openstack.username,
                        password: config.openstack.password
                    }
                }
            }
        }
    };

    var payloadString = JSON.stringify(payload);
    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': payloadString.length
    };

    var options = {
        host: 'cloud.lab.fiware.org',
        port: '4731',
        path: '/v3/auth/tokens',
        method: 'POST',
        headers: headers
    };

    var req = http.request(options, function (res) {

        res.setEncoding('utf-8');
        var responseString = '';

        res.on('data', function (data) {
            responseString += data;
        });

        res.on('end', function () {
            console.log('Response string: %s', responseString);

            console.log('res code: ' + res.statusCode);
            console.log('headers:' + res.headers);
            if (res.statusCode === 201) {
                callback(res.headers['x-subject-token']);
            } else {
                callback();
            }

        });
        res.on('error', function(e) {
           console.log(e.code);
        });

    });
    req.on('error', function (e) {
        if (e.code === 'ECONNRESET') {
            console.log('Error in connection by TIMEOUT with keystone: ' + e);
        } else {
            console.log('Error in connection with keystone: ' + e);
        }
        callback();


    });

    req.setTimeout(10000, function () {
        req.abort();
        console.log('Timeout in the connection with keystone. Time exceed');
    });

    req.write(payloadString);

    req.end();
}

/**
 * @function validateTokenAndGetRegion
 * Validate user token against OpenStack and get region name
 * @param {String} token
 * @param {function} callback
 */
function validateTokenAndGetRegion(token, callback) {

    postAdminToken(function(adminToken) {
        console.log('Using admin token %s to validate token: ', adminToken);
        getValidateToken(adminToken, token, function(result) {
            console.log(result);
            callback(result);

        });


    });

}




/** @export */
module.exports.postAdminToken = postAdminToken;

/** @export */
module.exports.getValidateToken = getValidateToken;

/** @export */
module.exports.validateTokenAndGetRegion = validateTokenAndGetRegion;

/** @export */
module.exports.parseRegionNameFromUserName = parseRegionNameFromUserName;
