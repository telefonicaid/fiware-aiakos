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
    config = require('../config').data,
    logger = require('../logger');

var versionMessage = {
  Aiakos :
    {
     version: '1.5.0',
     release_date: '2016-09-27',
     uptime: '',
     git_hash: '506dc98b1a5c3720e4d473c68a3ff6b2e7e54e98',
     doc: 'https://jsapi.apiary.io/apis/fiwareaiakos/reference.html'
    }
};

/**
 * set the path for files with keys
 * @param {String} seconds
 */
function format(seconds) {
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var days = Math.floor(seconds / (86400));  //60*60*24 = 86400
  var hours = Math.floor(seconds % (86400) / 3600);  //60*60 = 3600
  var minutes = Math.floor(seconds % (3600) / 60);
  var seconds = Math.floor(seconds % 60);

  return pad(days) + ' d, ' + pad(hours) + ' h, ' + pad(minutes) + ' m, ' + pad(seconds) + ' s';
}

/**
 * @function get_version
 * @param {Object} req
 * @param {Object} res
 */
function getVersion(req, res) {
  logger.info('call to version');

  res.contentType('application/json');
  res.status(200)

  var uptime = process.uptime();
  versionMessage.Aiakos.uptime = format(uptime);

  res.json(versionMessage);
}

/* GET version content information. */
router.get('/', getVersion);

/** @export */
module.exports = router;

/** @export */
module.exports.format = format;

/** @export */
module.exports.getVersion = getVersion;
