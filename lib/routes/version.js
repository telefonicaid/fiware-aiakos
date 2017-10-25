/* Copyright 2017 FIWARE Foundation, e.V.
 * All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
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
    logger = require('../logger');

/* GET version content information. */
router.get('/', function(req, res) {
  logger.info('call to version');

  var result = [];
/*
    {
     “<name of GEri/GEi>” :
       {
        “version”: “<version of the GEri/GEi>
        “release_date”: <date of release>
        “uptime”: “<time in days, hours, minutes and seconds since the application was launched>
        “git_hash”: “hash for the current version”
        “doc”: “link to the API documentation in the gh-pages (*.github.io/)
       }
    }
*/

res.contentType('application/json');

var responseData    = {};
responseData['version'] = "1.5.0";
responseData['relase_date']  = "23072017";
responseData['uptime']  = "23423422";
responseData['git_hash'] = 'http://to_some_where';
responseData['doc'] = 'http://to_api_gh_pages';

res.send(JSON.stringify(responseData));
});

/** @export */
module.exports = router;
