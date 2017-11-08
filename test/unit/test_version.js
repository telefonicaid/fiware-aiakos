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

var assert = require('assert'),
    version = require('../../lib/routes/version'),
    sinon = require('sinon');

/* jshint multistr: true */
suite('version', function () {

    test('should_return_a_null_valid_format_uptime', function () {
      // given
      var uptime = 0;
      var expectedResult = '00 d, 00 h, 00 m, 00 s';

      // when
      var result = version.format(uptime);

      // then
      assert(expectedResult, result);
    });

    test('should_return_a_valid_format_uptime', function () {
      // given
      var uptime = 245132789.734;
      var expectedResult = '2837 d, 04 h, 26 m, 29 s';

      // when
      var result = version.format(uptime);

      // then
      assert(expectedResult, result);
    });

    test('should_return_a_valid_version_data_with_correct_accept', function() {
        // given
        var req = sinon.spy(),
            res = sinon.stub();

        req.accepts = sinon.spy(function () { return ['application/json']; });

        res.end = sinon.spy();
        res.contentType = sinon.spy();
        res.json = sinon.spy();
        res.status = sinon.spy();

        // when
        version.getVersion(req, res);

        // then
        assert(res.contentType, 'application/json');
        assert(res.status.args[0][0] === 200);

        assert(res.json.calledOnce);

        var GEData = res.json.args[0][0].Aiakos;

        assert(GEData.version !== '');
        assert(GEData.releaseDate !== '');
        assert(GEData.uptime !== '');
        assert(GEData.gitHash !== '');
        assert(GEData.doc === 'https://jsapi.apiary.io/apis/fiwareaiakos/reference.html');
    });

    test('should_return_response_with_405', function() {
        //given
        var req = sinon.stub(),
            res = sinon.stub();

        res.status = sinon.stub();
        res.setHeader = sinon.stub();
        res.send = sinon.stub();

        //when
        version.methodNotAllowed(req, res);

        //then
        assert(res.status.withArgs(405).calledOnce);
        assert(res.setHeader.withArgs('content-type', 'application/json').calledOnce);
        assert(res.send.calledOnce);

    });

});
