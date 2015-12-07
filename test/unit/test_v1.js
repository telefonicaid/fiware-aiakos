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

var assert = require('assert'),
    v1 = require('../../lib/routes/v1'),
    sinon = require('sinon');

/* jshint multistr: true */
suite('v1', function () {

    suiteSetup(function() {
        v1.setKeysPath('./test/unit/');
    });

    test('should_have_a_validate_region_method', function () {
        assert.equal(v1.validateRegion.name, 'validateRegion');

    });

    test('should_return_error_with_invalid_region', function () {

        var result = v1.validateRegion('invalidName');
        assert(result === false);

    });

    test('should_return_true_with_valid_region', function () {

        var result = v1.validateRegion('region1');

        assert(result === true);

    });

    test('should_return_true_with_gpgkey', function () {

        var result = v1.validateKey('gpgkey');

        assert(result === true);

    });

    test('should_return_true_with_sshkey', function () {

        var result = v1.validateKey('sshkey');

        assert(result === true);

    });


    test('should_return_true_with_invalid_keyname', function () {

        var result = v1.validateKey('ddd');

        assert(result === false);

    });


    test('should_return_a_valid_ssh_key_for_valid_region', function() {
        var req = sinon.stub(),
            res = sinon.stub(),
            next = sinon.stub();
        req.params = sinon.stub();
        req.params.region = 'region1';
        req.params.key = 'sshkey';
        res.write = sinon.spy();
        res.setHeader = sinon.spy();
        res.type = sinon.spy();
        res.end = sinon.spy();

        v1.getKey(req, res, next);

        assert(res.write.calledOnce);
        assert(res.setHeader.calledOnce);
        assert(res.type.calledOnce);
        assert(res.end.calledOnce);

    });

    test('should_return_a_valid_ssh_key_for_valid_region', function() {
        var req = sinon.stub(),
            res = sinon.stub(),
            next = sinon.stub();
        req.params = sinon.stub();
        req.params.region = 'invalidName';
        req.params.key = 'sshkey';
        res.setHeader = sinon.spy();
        res.type = sinon.spy();
        res.end = sinon.spy();

        v1.getKey(req, res, next);

        assert(res.type.calledOnce);
        assert(res.end.calledOnce);

    });

});
